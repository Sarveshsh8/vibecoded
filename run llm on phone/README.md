# AI Assistant App

A beautiful personal productivity app with an integrated AI chatbot powered by Transformers.

## Features

- **Tasks Management**: Add, complete, and organize your daily tasks
- **Habit Tracking**: Build and track daily habits with progress visualization
- **Focus Timer**: Pomodoro technique for focused work sessions
- **Statistics Dashboard**: Track your productivity metrics
- **AI Chat Assistant**: Get help and motivation from an AI assistant powered by Microsoft DialoGPT

## Quick Start

### Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- Expo CLI (will be installed automatically)

### Running the App

1. **Start everything with one command:**
   ```bash
   ./start_app.sh
   ```

2. **Stop all services:**
   ```bash
   ./stop_app.sh
   ```

### Manual Setup (if needed)

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start Python backend:**
   ```bash
   cd backend
   python3 app.py
   ```
   Backend will be available at: http://localhost:5002

3. **Start React Native app (in a new terminal):**
   ```bash
   npx expo start --web
   ```
   App will be available at: http://localhost:8081

## Testing on Mobile

1. Install **Expo Go** app on your phone
2. Run `./start_app.sh`
3. Press `s` to switch to Expo Go mode
4. Scan the QR code with your phone's camera or Expo Go app
5. Make sure your phone and computer are on the same WiFi network

## AI Backend

The AI assistant uses Microsoft's DialoGPT-small model for conversational responses. The backend provides:

- `/health` - Health check endpoint
- `/chat` - Main chat endpoint for AI responses
- `/suggestions` - Get initial conversation suggestions

## Project Structure

```
AIAssistantApp/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── start_server.py     # Alternative startup script
├── src/
│   ├── screens/            # React Native screens
│   │   ├── ChatScreen.tsx  # AI chat interface
│   │   ├── TasksScreen.tsx # Task management
│   │   ├── HabitsScreen.tsx# Habit tracking
│   │   ├── FocusScreen.tsx # Pomodoro timer
│   │   └── StatsScreen.tsx # Statistics dashboard
│   └── theme/              # App theming
├── start_app.sh            # Main startup script
├── stop_app.sh             # Stop all services
└── README.md               # This file
```

## Troubleshooting

### Backend Issues
- Make sure port 5001 is not in use
- Check that Python dependencies are installed
- Verify the model downloads successfully (first run may take time)

### Frontend Issues
- Make sure port 8081 is not in use
- Check that Node.js and npm are installed
- Try clearing Expo cache: `npx expo start --clear`

### Mobile Connection Issues
- Ensure phone and computer are on the same WiFi network
- Try using the tunnel option: `npx expo start --tunnel`
- Check firewall settings

## Development

The app uses:
- **Frontend**: React Native with Expo
- **Backend**: Python Flask with Transformers
- **AI Model**: Microsoft DialoGPT-small
- **Styling**: React Native Paper with custom theme

## License

This project is for educational and personal use.