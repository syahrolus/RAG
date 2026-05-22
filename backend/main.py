from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import uuid

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# Initialize embeddings and vector store
embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
vectorstore = Chroma(persist_directory=CHROMA_DB_DIR, embedding_function=embeddings)

class QueryRequest(BaseModel):
    prompt: str
    top_k: int = 3

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]

class KnowledgeItem(BaseModel):
    content: str
    metadata: Optional[dict] = None

@app.post("/add_knowledge")
async def add_knowledge(item: KnowledgeItem):
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(item.content)
        
        docs = [
            Document(page_content=chunk, metadata=item.metadata or {"source": "manual_entry"})
            for chunk in chunks
        ]
        
        vectorstore.add_documents(docs)
        return {"message": f"Added {len(docs)} chunks to knowledge base."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=QueryResponse)
async def query_knowledge(request: QueryRequest):
    try:
        # Search for relevant chunks
        results = vectorstore.similarity_search(request.prompt, k=request.top_k)
        
        # Combine chunks for context
        context = "\n\n".join([doc.page_content for doc in results])
        sources = [doc.metadata.get("source", "unknown") for doc in results]
        
        # In a real RAG, we'd send this to an LLM. 
        # For now, we'll return the context as the "answer" or a summary.
        # Since this is a RAG backend, the UI will likely handle the LLM part 
        # or we can integrate a local LLM later.
        # For this prototype, let's just return the retrieved context.
        
        return QueryResponse(
            answer=context,
            sources=list(set(sources))
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7744)
