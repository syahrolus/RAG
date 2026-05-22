# Pentest RAG Knowledge Base 🧠🛡️

A cross-platform, local Retrieval-Augmented Generation (RAG) system designed specifically for pentesters to store findings and provide context to AI agents (Claude Code, Gemini CLI, etc.) while saving tokens.

## 🌟 Features

- **Local Vector DB:** Uses ChromaDB and local embeddings (`all-MiniLM-L6-v2`). No data leaves your machine.
- **Cross-Platform:** Works on Windows (`.bat`) and Linux/macOS (`.sh`).
- **AI-Agent Ready:** Integrated via `CLAUDE.md` and Gemini CLI Skills.
- **Dual-Pane UI:** Easy management for adding knowledge and querying context.
- **Token Efficient:** Only provide the AI with the *relevant* parts of your 100+ page pentest notes.

## 🏗️ Architecture

- **Backend:** FastAPI, LangChain, ChromaDB.
- **Frontend:** React, TypeScript, Vite, Lucide-React.
- **AI Integration:** Specialized scripts for model context retrieval.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js & npm

### Installation & Run

#### Windows
```powershell
.\run_rag.bat
```

#### Linux / macOS
```bash
chmod +x run_rag.sh
./run_rag.sh
```

The UI will be available at `http://localhost:5173`. The first run will automatically download the embedding model (~90MB).

## 🤖 AI Agent Integration

### Claude Code
Claude will automatically detect the `CLAUDE.md` file in this directory and know how to query the RAG using the `Bash` tool.

### Gemini CLI
Install the packaged skill:
```powershell
gemini skills install pentest-rag-access.skill --scope workspace
/skills reload
```

## 📂 Project Structure
- `backend/`: FastAPI server and vector storage logic.
- `frontend/`: React application for UI management.
- `pentest-rag-access/`: Source for the AI agent skill.
- `CLAUDE.md`: Instructions for Claude Code.
- `GEMINI.md`: Instructions for Gemini CLI.

---
*Built for pentesters who want a local "Second Brain".*
