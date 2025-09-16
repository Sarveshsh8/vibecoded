#!/bin/bash

# AI Assistant App Startup Script
# This script starts both the Python backend and React Native frontend

echo "🤖 Starting AI Assistant App..."
echo "=================================="

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    pkill -f "python3 app.py" 2>/dev/null
    pkill -f "expo start" 2>/dev/null
    pkill -f "Metro" 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Expo CLI is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not available. Please install Node.js and npm first."
    exit 1
fi

echo "📦 Installing Python dependencies..."
cd backend
if [ -f "requirements.txt" ]; then
    python3 -m pip install -r requirements.txt --quiet
    if [ $? -eq 0 ]; then
        echo "✅ Python dependencies installed"
    else
        echo "❌ Failed to install Python dependencies"
        exit 1
    fi
else
    echo "❌ requirements.txt not found in backend directory"
    exit 1
fi

echo ""
echo "🚀 Starting Python Backend Server..."
echo "Backend will be available at: http://localhost:5004"
echo ""

# Start Python backend in background
python3 app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Failed to start Python backend"
    exit 1
fi

echo "✅ Python backend started successfully (PID: $BACKEND_PID)"

# Go back to main directory
cd ..

echo ""
echo "📱 Starting React Native App..."
echo "App will be available at: http://localhost:8081"
echo ""

# Start React Native app
echo "Press 'w' to open in web browser"
echo "Press 's' to switch to Expo Go for mobile testing"
echo "Press Ctrl+C to stop all services"
echo ""

npx expo start --web

# If we reach here, the user stopped the app
cleanup
