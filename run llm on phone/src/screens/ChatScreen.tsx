import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Send, 
  Bot, 
  User, 
  Plus,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react-native';
import { theme } from '../theme/theme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'suggestion';
  suggestions?: string[];
}

const quickSuggestions = [
  "Help me plan my day",
  "What should I focus on?",
  "Track my habits",
  "Set a reminder",
  "How's my productivity?",
  "Give me motivation"
];

const aiResponses = [
  "I'd be happy to help you plan your day! Let's start by looking at your current tasks and priorities.",
  "Based on your habits, I suggest focusing on your most important task first. Would you like me to help you prioritize?",
  "Great! I can see you're making progress on your habits. Keep up the excellent work!",
  "I'll set that reminder for you. What time would you like to be reminded?",
  "Your productivity is looking great! You've completed 85% of your tasks today.",
  "You're doing amazing! Remember, every small step counts towards your bigger goals. Keep pushing forward!"
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI productivity assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text',
      suggestions: quickSuggestions.slice(0, 3)
    }
  ]);

  // Fetch initial suggestions from backend
  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      try {
        const response = await fetch('http://192.168.1.6:5004/suggestions');
        if (response.ok) {
          const data = await response.json();
          setMessages(prev => prev.map(msg => 
            msg.id === '1' ? { ...msg, suggestions: data.suggestions } : msg
          ));
        }
      } catch (error) {
        console.log('Using default suggestions');
      }
    };

    fetchInitialSuggestions();
  }, []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const commonEmojis = ['😀', '😂', '😊', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💯', '✨', '🚀', '💪', '🎯', '⭐'];

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      // Call Python backend
      const response = await fetch('http://192.168.1.6:5004/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          history: messages.slice(-5).map(msg => msg.text) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        suggestions: data.suggestions || undefined
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI backend:', error);
      
      // Fallback to mock response if backend is unavailable
      const fallbackResponse = "I'm having trouble connecting to my AI brain right now. Please make sure the Python backend is running on port 5001!";
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        suggestions: ['Try again', 'Check connection', 'Restart backend']
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleEmojiPress = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={theme.gradients.primary}
            style={styles.avatar}
          >
            <Bot size={20} color="#FFFFFF" />
          </LinearGradient>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <LinearGradient
          colors={item.isUser ? theme.gradients.primary : theme.gradients.glass}
          style={styles.messageGradient}
        >
          <Text style={[
            styles.messageText,
            { color: item.isUser ? '#FFFFFF' : theme.colors.onSurface }
          ]}>
            {item.text}
          </Text>
          
          {item.suggestions && item.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {item.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </LinearGradient>
      </View>
      
      {item.isUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={theme.gradients.secondary}
            style={styles.avatar}
          >
            <User size={20} color="#FFFFFF" />
          </LinearGradient>
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessage]}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.avatar}
        >
          <Bot size={20} color="#FFFFFF" />
        </LinearGradient>
      </View>
      
      <View style={[styles.messageBubble, styles.aiBubble]}>
        <LinearGradient
          colors={theme.gradients.glass}
          style={styles.messageGradient}
        >
          <View style={styles.typingContainer}>
            <Animated.View style={[
              styles.typingDot,
              {
                opacity: typingAnimation,
                transform: [{
                  scale: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  })
                }]
              }
            ]} />
            <Animated.View style={[
              styles.typingDot,
              {
                opacity: typingAnimation,
                transform: [{
                  scale: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  })
                }]
              }
            ]} />
            <Animated.View style={[
              styles.typingDot,
              {
                opacity: typingAnimation,
                transform: [{
                  scale: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  })
                }]
              }
            ]} />
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerInfo}>
              <LinearGradient
                colors={theme.gradients.secondary}
                style={styles.headerAvatar}
              >
                <Bot size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>AI Assistant</Text>
                <Text style={styles.headerSubtitle}>Online</Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Phone size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Video size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreVertical size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
        />

        <View style={styles.inputContainer}>
          <LinearGradient
            colors={theme.gradients.glass}
            style={styles.inputGradient}
          >
            <View style={styles.inputContent}>
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={theme.colors.onSurfaceVariant}
                multiline={false}
                maxLength={500}
                onSubmitEditing={sendMessage}
                blurOnSubmit={true}
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
              />
              
              <TouchableOpacity 
                style={styles.emojiButton}
                onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={20} color={showEmojiPicker ? theme.colors.primary : theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  { opacity: inputText.trim() ? 1 : 0.5 }
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <LinearGradient
                  colors={inputText.trim() ? theme.gradients.primary : ['#E5E7EB', '#D1D5DB']}
                  style={styles.sendButtonGradient}
                >
                  <Send size={20} color={inputText.trim() ? '#FFFFFF' : theme.colors.onSurfaceVariant} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {showEmojiPicker && (
          <View style={styles.emojiPickerContainer}>
            <LinearGradient
              colors={theme.gradients.glass}
              style={styles.emojiPickerGradient}
            >
              <View style={styles.emojiGrid}>
                {commonEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emojiGridButton}
                    onPress={() => handleEmojiPress(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    elevation: theme.elevation.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerGradient: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: theme.spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: theme.borderRadius.xl,
    elevation: theme.elevation.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  userBubble: {
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  aiBubble: {
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  messageGradient: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: theme.spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  messageText: {
    ...theme.typography.body,
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  suggestionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  suggestionText: {
    ...theme.typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.onSurfaceVariant,
  },
  inputContainer: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  inputGradient: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.onSurface,
    maxHeight: 100,
    paddingVertical: theme.spacing.sm,
  },
  emojiButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiPickerContainer: {
    position: 'absolute',
    bottom: 80,
    left: theme.spacing.md,
    right: theme.spacing.md,
    elevation: theme.elevation.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emojiPickerGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: theme.spacing.md,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  emojiGridButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
});