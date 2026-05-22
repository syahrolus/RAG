#!/bin/bash

echo "Starting Pentest RAG System..."

# Start Backend
echo "Starting Backend..."
(cd backend && source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
python3 main.py || python main.py) &

# Start Frontend
echo "Starting Frontend..."
(cd frontend && npm run dev) &

echo "Backend starting on http://localhost:8000"
echo "Frontend starting on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both services."

# Wait for background processes
wait
