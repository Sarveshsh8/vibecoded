#!/bin/bash

# AI Assistant App Stop Script
# This script stops all running services

echo "🛑 Stopping AI Assistant App..."
echo "==============================="

# Kill Python backend processes
echo "Stopping Python backend..."
pkill -f "python3 app.py" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Python backend stopped"
else
    echo "ℹ️  No Python backend processes found"
fi

# Kill Expo/Metro processes
echo "Stopping React Native app..."
pkill -f "expo start" 2>/dev/null
pkill -f "Metro" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ React Native app stopped"
else
    echo "ℹ️  No React Native processes found"
fi

# Kill any remaining Node processes related to our app
pkill -f "node.*expo" 2>/dev/null

echo ""
echo "✅ All services stopped successfully!"
echo "You can now run ./start_app.sh to restart the app"
