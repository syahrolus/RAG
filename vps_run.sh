#!/bin/bash

# VPS Startup Script (Headless)
echo "Starting Pentest RAG System in background..."

# Ensure we are in the right directory
BASE_DIR=$(pwd)

# Start Backend with logging
echo "Starting Backend on port 8000..."
cd $BASE_DIR/backend
source venv/bin/activate
nohup python3 main.py > backend.log 2>&1 &
echo $! > ../backend.pid

# Start Frontend with logging
echo "Starting Frontend on port 5173..."
cd $BASE_DIR/frontend
nohup npm run dev -- --host > frontend.log 2>&1 &
echo $! > ../frontend.pid

echo "----------------------------------------"
echo "System started in the background!"
echo "Backend Log:  backend/backend.log"
echo "Frontend Log: frontend/frontend.log"
echo "----------------------------------------"
echo "To stop the system, run: kill \$(cat *.pid) && rm *.pid"
