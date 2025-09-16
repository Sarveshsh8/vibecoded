// Configuration for AI Assistant App
// This file manages environment variables and app settings

// Default configuration values
const DEFAULT_CONFIG = {
  BACKEND_URL: 'http://192.168.1.6:5004',
  CHAT_ENDPOINT: '/chat',
  SUGGESTIONS_ENDPOINT: '/suggestions',
  HEALTH_ENDPOINT: '/health',
  BACKEND_TIMEOUT: 10000,
  MAX_RETRIES: 3,
};

// Get configuration from environment variables or use defaults
export const config = {
  // Backend URL - change this to match your setup
  BACKEND_URL: process.env.BACKEND_URL || DEFAULT_CONFIG.BACKEND_URL,
  
  // API endpoints
  CHAT_ENDPOINT: process.env.CHAT_ENDPOINT || DEFAULT_CONFIG.CHAT_ENDPOINT,
  SUGGESTIONS_ENDPOINT: process.env.SUGGESTIONS_ENDPOINT || DEFAULT_CONFIG.SUGGESTIONS_ENDPOINT,
  HEALTH_ENDPOINT: process.env.HEALTH_ENDPOINT || DEFAULT_CONFIG.HEALTH_ENDPOINT,
  
  // Network settings
  BACKEND_TIMEOUT: parseInt(process.env.BACKEND_TIMEOUT || DEFAULT_CONFIG.BACKEND_TIMEOUT.toString()),
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || DEFAULT_CONFIG.MAX_RETRIES.toString()),
  
  // Helper functions
  getChatUrl: () => `${config.BACKEND_URL}${config.CHAT_ENDPOINT}`,
  getSuggestionsUrl: () => `${config.BACKEND_URL}${config.SUGGESTIONS_ENDPOINT}`,
  getHealthUrl: () => `${config.BACKEND_URL}${config.HEALTH_ENDPOINT}`,
};

// Export individual values for convenience
export const {
  BACKEND_URL,
  CHAT_ENDPOINT,
  SUGGESTIONS_ENDPOINT,
  HEALTH_ENDPOINT,
  BACKEND_TIMEOUT,
  MAX_RETRIES,
  getChatUrl,
  getSuggestionsUrl,
  getHealthUrl,
} = config;

// Log current configuration (for debugging)
console.log('🔧 AI Assistant Config:', {
  BACKEND_URL: config.BACKEND_URL,
  CHAT_URL: config.getChatUrl(),
  SUGGESTIONS_URL: config.getSuggestionsUrl(),
  HEALTH_URL: config.getHealthUrl(),
});
