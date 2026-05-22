# Pentest RAG Knowledge Base

A local RAG system to store and retrieve knowledge gained during pentesting.

## Architecture
- **Backend:** FastAPI, ChromaDB, LangChain, SentenceTransformers.
- **Frontend:** React (TypeScript), Vite, Lucide-React.

## How it works
1. **Add Knowledge:** Paste findings, commands, or notes into the "Add New Knowledge" section. It gets chunked, embedded locally (using `all-MiniLM-L6-v2`), and stored in ChromaDB.
2. **Query:** Use the search bar to find relevant context. The system performs a similarity search and returns the most relevant chunks.
3. **Token Efficiency:** Instead of pasting everything into an AI's context, you can query this local DB first and only provide the relevant context to the AI.

## Setup & Running
1. Run `run_rag.bat` to start both the backend and frontend.
2. Open `http://localhost:5173` in your browser.

## Dependencies
- Python 3.10+
- Node.js
- ChromaDB (Local vector storage)
