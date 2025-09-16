#!/bin/bash

# Script to easily update the backend URL in the .env file
# Usage: ./update_backend_url.sh [new_url]

# Default values
DEFAULT_URL="http://192.168.1.6:5004"
DEFAULT_LOCALHOST="http://localhost:5004"

# Get the new URL from command line argument or prompt user
if [ $# -eq 1 ]; then
    NEW_URL="$1"
else
    echo "🔧 AI Assistant Backend URL Updater"
    echo "=================================="
    echo ""
    echo "Current backend URL: $(grep '^BACKEND_URL=' .env | cut -d'=' -f2)"
    echo ""
    echo "Choose an option:"
    echo "1) Use localhost (http://localhost:5004)"
    echo "2) Use network IP (http://192.168.1.6:5004)"
    echo "3) Enter custom URL"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            NEW_URL="$DEFAULT_LOCALHOST"
            ;;
        2)
            NEW_URL="$DEFAULT_URL"
            ;;
        3)
            read -p "Enter the new backend URL: " NEW_URL
            ;;
        *)
            echo "Invalid choice. Using default network IP."
            NEW_URL="$DEFAULT_URL"
            ;;
    esac
fi

# Validate URL format
if [[ ! $NEW_URL =~ ^https?:// ]]; then
    echo "❌ Invalid URL format. Please include http:// or https://"
    exit 1
fi

# Update the .env file
if [ -f .env ]; then
    # Backup the current .env file
    cp .env .env.backup
    
    # Update the BACKEND_URL line
    sed -i.tmp "s|^BACKEND_URL=.*|BACKEND_URL=$NEW_URL|" .env
    rm .env.tmp
    
    echo "✅ Backend URL updated successfully!"
    echo "📝 New URL: $NEW_URL"
    echo "💾 Backup saved as .env.backup"
    echo ""
    echo "🔄 You may need to restart your React Native app for changes to take effect."
else
    echo "❌ .env file not found. Please run this script from the project root directory."
    exit 1
fi
