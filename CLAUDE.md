# Pentest RAG Integration

You have access to a local RAG (Retrieval-Augmented Generation) system for pentesting knowledge.

## How to access the RAG
If you need to retrieve commands, CVE details, or methodology from previous pentests, use the `query_rag.py` tool located in the `pentest-rag-access/scripts/` directory.

### Tool Usage
Run the script using the `Bash` tool:
```bash
python pentest-rag-access/scripts/query_rag.py "Your search query here"
```

### Knowledge Base Details
- **Backend:** `http://localhost:8000` (FastAPI)
- **Content:** 20+ initial entries seeded, including Nmap, Metasploit, PrivEsc, and AD techniques.
- **Purpose:** Use this to bypass token limits and access a private, local knowledge base without sending everything to the internet.

## Guidelines
- Query the RAG if the user asks for specific technical procedures you aren't certain about.
- Use the retrieved context to provide accurate, methodology-driven pentesting advice.
