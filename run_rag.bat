@echo off
echo Starting Pentest RAG System...

start cmd /k "cd backend && venv\Scripts\activate && python main.py"
start cmd /k "cd frontend && npm run dev"

echo Backend starting on http://localhost:7744
echo Frontend starting on http://localhost:7743
echo.
echo Press any key to close this window (the other windows will remain open).
pause
