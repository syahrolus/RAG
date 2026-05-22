@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo   Pentest RAG System - Installer (Windows)
echo ==========================================

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python is not installed or not in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)

:: Check for Node.js
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js/npm is not installed. Please install Node.js.
    pause
    exit /b 1
)

echo.
echo [1/2] Setting up Backend (Python)...
cd backend
if not exist venv (
    python -m venv venv
    echo [+] Created virtual environment.
)
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo.
echo [2/2] Setting up Frontend (Node.js)...
cd frontend
call npm install
cd ..

echo.
echo ==========================================
echo   Installation Complete!
echo   To start the system, run: run_rag.bat
echo ==========================================
pause
