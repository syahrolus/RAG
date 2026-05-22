#!/bin/bash

echo "=========================================="
echo "  Pentest RAG System - Installer (Linux/macOS)"
echo "=========================================="

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "[!] Python3 is not installed. Please install Python 3.10+."
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "[!] Node.js/npm is not installed. Please install Node.js."
    exit 1
fi

echo ""
echo "[1/2] Setting up Backend (Python)..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "[+] Created virtual environment."
fi
source venv/bin/activate
python3 -m pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo ""
echo "[2/2] Setting up Frontend (Node.js)..."
cd frontend
npm install
cd ..

echo ""
echo "=========================================="
echo "  Installation Complete!"
echo "  To start the system, run: ./run_rag.sh"
echo "=========================================="
