from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native app

# Global variables for model
model = None
tokenizer = None
generator = None

def load_model():
    """Load SmolLM-135M model with bfloat16 precision"""
    global model, tokenizer, generator
    
    try:
        # Using SmolLM-135M - a very efficient small language model
        model_name = "HuggingFaceTB/SmolLM-135M"
        
        logger.info(f"Loading model: {model_name}")
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Add padding token if it doesn't exist
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # Load model with bfloat16 precision for better performance
        # Use CPU for better compatibility, especially on macOS
        model = AutoModelForCausalLM.from_pretrained(
            model_name, 
            torch_dtype=torch.bfloat16,  # Use bfloat16 for better performance
            device_map="cpu"  # Use CPU for better compatibility
        )
        
        logger.info("SmolLM-135M model loaded successfully with bfloat16 precision!")
        
    except Exception as e:
        logger.error(f"Error loading SmolLM model: {str(e)}")
        logger.info("Falling back to DialoGPT-small...")
        
        try:
            # Fallback to DialoGPT if SmolLM fails
            model_name = "microsoft/DialoGPT-small"
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(model_name)
            
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token
                
            logger.info("DialoGPT-small fallback loaded successfully!")
            
        except Exception as e2:
            logger.error(f"Fallback model also failed: {str(e2)}")
            model = None
            tokenizer = None

def generate_response(user_message, conversation_history=None):
    """Generate AI response to user message using SmolLM-135M with system prompt"""
    
    if model is None or tokenizer is None:
        # Return error message when model is not available
        raise Exception("AI model is not loaded. Please restart the backend.")
    
    try:
        # Simple Q&A system prompt
        system_prompt = """You are a helpful AI assistant. Answer questions clearly and concisely.

Q: {user_message}
A:"""
        
        # Prepare the conversation context
        if conversation_history:
            # Use recent conversation history for context
            context = " ".join(conversation_history[-2:])  # Last 2 messages
            prompt = f"Q: {context} {user_message}\nA:"
        else:
            prompt = system_prompt.format(user_message=user_message)
        
        # Tokenize the input
        inputs = tokenizer.encode(prompt, return_tensors="pt")
        
        # Keep inputs on CPU since model is on CPU
        # No need to move inputs to device
        
        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                inputs,
                max_new_tokens=100,  # Generate up to 100 new tokens
                temperature=0.7,
                do_sample=True,
                top_p=0.9,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id,
                repetition_penalty=1.1
            )
        
        # Decode the response
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract just the assistant's response
        if "A:" in generated_text:
            ai_response = generated_text.split("A:")[-1].strip()
        else:
            # If no clear assistant response, take everything after the prompt
            ai_response = generated_text[len(prompt):].strip()
        
        # Clean up the response
        if ai_response:
            # Remove any incomplete sentences at the end
            sentences = ai_response.split('.')
            if len(sentences) > 1 and len(sentences[-1].strip()) < 10:
                ai_response = '.'.join(sentences[:-1]) + '.'
            
            # Ensure response is not too long
            if len(ai_response) > 200:
                ai_response = ai_response[:200] + "..."
            
            return ai_response
        else:
            raise Exception("Failed to generate AI response. Please try again.")
            
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        raise Exception(f"AI response generation failed: {str(e)}")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None and tokenizer is not None,
        'message': 'AI Assistant Backend is running!'
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        conversation_history = data.get('history', [])
        
        logger.info(f"📨 Received message: {user_message}")
        
        # Generate AI response
        ai_response = generate_response(user_message, conversation_history)
        
        # Generate suggestions based on the response
        suggestions = generate_suggestions(user_message, ai_response)
        
        response_data = {
            'response': ai_response,
            'suggestions': suggestions,
            'timestamp': None  # Will be set by frontend
        }
        
        # Enhanced terminal logging
        print("\n" + "="*60)
        print(f"🤖 AI RESPONSE:")
        print(f"Q: {user_message}")
        print(f"A: {ai_response}")
        print("="*60 + "\n")
        
        logger.info(f"✅ Generated response: {ai_response[:100]}...")
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def generate_suggestions(user_message, ai_response):
    """Generate helpful suggestions based on the conversation"""
    
    message_lower = user_message.lower()
    response_lower = ai_response.lower()
    
    suggestions = []
    
    # Task-related suggestions
    if any(word in message_lower for word in ['task', 'todo', 'work']):
        suggestions.extend([
            "Add a new task",
            "View my task list",
            "Set task priority"
        ])
    
    # Habit-related suggestions
    if any(word in message_lower for word in ['habit', 'routine', 'daily']):
        suggestions.extend([
            "Track a habit",
            "View habit progress",
            "Set habit reminder"
        ])
    
    # Focus-related suggestions
    if any(word in message_lower for word in ['focus', 'concentrate', 'work']):
        suggestions.extend([
            "Start Pomodoro timer",
            "Take a break",
            "Meditation session"
        ])
    
    # General productivity suggestions
    if not suggestions:
        suggestions.extend([
            "What are my tasks today?",
            "How can I be more productive?",
            "Show me my progress"
        ])
    
    # Return top 3 suggestions
    return suggestions[:3]

@app.route('/suggestions', methods=['GET'])
def get_initial_suggestions():
    """Get initial suggestions for new users"""
    return jsonify({
        'suggestions': [
            "What can you help me with?",
            "Tell me about artificial intelligence",
            "How do I stay productive?"
        ]
    })

if __name__ == '__main__':

    print("\n" + "🚀" + "="*58 + "🚀")
    print("🤖 AI ASSISTANT BACKEND STARTING...")
    print("🚀" + "="*58 + "🚀\n")
    
    logger.info("Starting AI Assistant Backend...")
    
    # Load the model on startup
    load_model()
    
    print("\n" + "✅" + "="*58 + "✅")
    print("🎉 AI ASSISTANT BACKEND IS READY!")
    print("📱 Chat with your AI assistant now!")
    print("✅" + "="*58 + "✅\n")
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',  # Allow connections from any IP (for mobile testing)
        port=5004,  # Changed to 5004 to avoid port conflicts
        debug=True
    )
