#!/bin/bash

# AI Assistant Backend Management Script
# This script helps you start, stop, and manage the Python backend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to kill processes on specific ports
kill_ports() {
    local ports=("5000" "5001" "5002" "5003" "5004")
    print_status "Killing processes on ports: ${ports[*]}"
    
    for port in "${ports[@]}"; do
        local pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo "$pids" | xargs kill -9 2>/dev/null
            print_success "Killed processes on port $port"
        else
            print_status "No processes found on port $port"
        fi
    done
}

# Function to start the backend
start_backend() {
    print_status "Starting AI Assistant Backend..."
    
    # Check if backend directory exists
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi
    
    # Kill any existing processes on the ports
    kill_ports
    
    # Start the backend
    cd backend
    print_status "Starting Python backend on port 5004..."
    python3 app.py &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    # Check if backend started successfully
    if ps -p $BACKEND_PID > /dev/null; then
        print_success "Backend started successfully (PID: $BACKEND_PID)"
        
        # Test the backend
        print_status "Testing backend connection..."
        if curl -s http://192.168.1.6:5004/health > /dev/null; then
            print_success "Backend is responding correctly!"
            print_status "Backend URL: http://192.168.1.6:5004"
            print_status "Health check: http://192.168.1.6:5004/health"
            print_status "Chat endpoint: http://192.168.1.6:5004/chat"
        else
            print_warning "Backend started but health check failed"
        fi
    else
        print_error "Failed to start backend"
        exit 1
    fi
}

# Function to stop the backend
stop_backend() {
    print_status "Stopping AI Assistant Backend..."
    kill_ports
    print_success "Backend stopped"
}

# Function to check backend status
check_status() {
    print_status "Checking backend status..."
    
    if curl -s http://192.168.1.6:5004/health > /dev/null; then
        print_success "Backend is running and healthy!"
        
        # Get detailed status
        local response=$(curl -s http://192.168.1.6:5004/health)
        echo "Status: $response"
    else
        print_warning "Backend is not responding"
        
        # Check if any processes are running on the ports
        local ports=("5000" "5001" "5002" "5003" "5004")
        for port in "${ports[@]}"; do
            local pids=$(lsof -ti:$port 2>/dev/null)
            if [ ! -z "$pids" ]; then
                print_warning "Process found on port $port (PID: $pids)"
            fi
        done
    fi
}

# Function to test the chat endpoint
test_chat() {
    print_status "Testing chat endpoint..."
    
    local response=$(curl -s -X POST http://192.168.1.6:5004/chat \
        -H "Content-Type: application/json" \
        -d '{"message": "Hello, how are you?"}')
    
    if [ $? -eq 0 ]; then
        print_success "Chat endpoint is working!"
        echo "Response: $response"
    else
        print_error "Chat endpoint test failed"
    fi
}

# Function to show help
show_help() {
    echo "AI Assistant Backend Management Script"
    echo "======================================"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start the backend server"
    echo "  stop      Stop the backend server"
    echo "  restart   Restart the backend server"
    echo "  status    Check backend status"
    echo "  test      Test the chat endpoint"
    echo "  kill      Kill all processes on ports 5000-5004"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start the backend"
    echo "  $0 status   # Check if backend is running"
    echo "  $0 test     # Test the chat functionality"
}

# Main script logic
case "$1" in
    start)
        start_backend
        ;;
    stop)
        stop_backend
        ;;
    restart)
        stop_backend
        sleep 2
        start_backend
        ;;
    status)
        check_status
        ;;
    test)
        test_chat
        ;;
    kill)
        kill_ports
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
