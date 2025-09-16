import { AIResponse, ChatContext } from '../types/chat';

// Simple local AI responses - in a real app, you'd integrate with OpenAI, Claude, or a local model
const AI_RESPONSES = {
  greetings: [
    "Hello! How can I help you today?",
    "Hi there! What would you like to do?",
    "Good to see you! How's your day going?",
    "Hey! Ready to tackle the day together?"
  ],
  schedule: [
    "I can help you manage your schedule. What would you like to add or check?",
    "Let's organize your day! What's on your agenda?",
    "I'm here to help with your schedule. What do you need to plan?"
  ],
  alarm: [
    "I can set up smart alarms for you. What time would you like to wake up?",
    "Let's set up your wake-up routine! When do you want to start your day?",
    "I'll help you wake up refreshed. What's your ideal wake-up time?"
  ],
  weather: [
    "I don't have weather data right now, but I can help you plan your day based on your schedule!",
    "For weather updates, you might want to check a weather app, but I can help you plan around your activities!"
  ],
  help: [
    "I can help you with:\n• Managing your daily schedule\n• Setting smart alarms\n• Planning your day\n• Chatting and keeping you company\n\nWhat would you like to do?",
    "Here's what I can do for you:\n• Schedule management\n• Alarm and wake-up assistance\n• Daily planning\n• Friendly conversation\n\nHow can I assist you today?"
  ]
};

export async function generateAIResponse(input: string): Promise<AIResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowerInput = input.toLowerCase();

  // Greeting responses
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
    return {
      text: getRandomResponse(AI_RESPONSES.greetings),
      suggestions: ['Set my alarm', 'Show my schedule', 'Plan my day', 'What can you do?']
    };
  }

  // Schedule-related responses
  if (lowerInput.includes('schedule') || lowerInput.includes('plan') || lowerInput.includes('agenda')) {
    return {
      text: getRandomResponse(AI_RESPONSES.schedule),
      suggestions: ['Add new event', 'View today\'s schedule', 'Set reminder', 'Plan tomorrow']
    };
  }

  // Alarm-related responses
  if (lowerInput.includes('alarm') || lowerInput.includes('wake') || lowerInput.includes('wake up')) {
    return {
      text: getRandomResponse(AI_RESPONSES.alarm),
      suggestions: ['Set 7 AM alarm', 'Set 8 AM alarm', 'Set smart alarm', 'View alarms']
    };
  }

  // Weather-related responses
  if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('sunny')) {
    return {
      text: getRandomResponse(AI_RESPONSES.weather),
      suggestions: ['Plan indoor activities', 'Check my schedule', 'Set reminder to check weather']
    };
  }

  // Help requests
  if (lowerInput.includes('help') || lowerInput.includes('what can you do') || lowerInput.includes('capabilities')) {
    return {
      text: getRandomResponse(AI_RESPONSES.help),
      suggestions: ['Set alarm', 'Manage schedule', 'Plan my day', 'Chat with me']
    };
  }

  // Time-related responses
  if (lowerInput.includes('time') || lowerInput.includes('what time')) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      text: `It's currently ${timeString}. How can I help you make the most of your day?`,
      suggestions: ['Set alarm', 'Check schedule', 'Plan next activity', 'Take a break']
    };
  }

  // Motivation and encouragement
  if (lowerInput.includes('tired') || lowerInput.includes('exhausted') || lowerInput.includes('stressed')) {
    return {
      text: "I understand you're feeling tired. Let me help you take care of yourself. Would you like me to set a reminder for a break or help you plan some rest time?",
      suggestions: ['Set break reminder', 'Plan relaxation time', 'Adjust schedule', 'Set earlier bedtime']
    };
  }

  // Default response
  return {
    text: "That's interesting! I'm here to help you manage your schedule, set alarms, and chat. Could you tell me more about what you'd like to do?",
    suggestions: ['Set alarm', 'Manage schedule', 'Plan my day', 'What can you do?']
  };
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Context-aware response generation (for future enhancement)
export function generateContextualResponse(input: string, context: ChatContext): Promise<AIResponse> {
  // This would use the context to provide more personalized responses
  // For now, we'll use the basic response generator
  return generateAIResponse(input);
}

// Smart alarm suggestions based on user patterns
export function getSmartAlarmSuggestions(context: ChatContext): string[] {
  const suggestions = [];
  
  if (context.userPreferences.wakeUpTime) {
    suggestions.push(`Set alarm for ${context.userPreferences.wakeUpTime}`);
  } else {
    suggestions.push('Set 7:00 AM alarm', 'Set 8:00 AM alarm', 'Set 9:00 AM alarm');
  }

  if (context.userPreferences.workHours) {
    const workStart = context.userPreferences.workHours.start;
    const wakeUpTime = new Date(`2000-01-01 ${workStart}`);
    wakeUpTime.setHours(wakeUpTime.getHours() - 1);
    suggestions.push(`Set alarm for ${wakeUpTime.toTimeString().slice(0, 5)} (1 hour before work)`);
  }

  return suggestions;
}
