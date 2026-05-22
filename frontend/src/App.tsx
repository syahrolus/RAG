import React, { useState } from 'react';
import axios from 'axios';
import { Search, PlusCircle, Database, BookOpen, Loader2 } from 'lucide-react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:7744`;

function App() {
  const [knowledge, setKnowledge] = useState('');
  const [source, setSource] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ answer: string; sources: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddKnowledge = async () => {
    if (!knowledge) return;
    setAdding(true);
    try {
      await axios.post(`${API_BASE_URL}/add_knowledge`, {
        content: knowledge,
        metadata: { source: source || 'manual_entry' }
      });
      setMessage('Knowledge added successfully!');
      setKnowledge('');
      setSource('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding knowledge:', error);
      setMessage('Failed to add knowledge.');
    } finally {
      setAdding(false);
    }
  };

  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/query`, {
        prompt: query,
        top_k: 3
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error querying:', error);
      setMessage('Query failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1><Database size={32} /> Pentest RAG Knowledge Base</h1>
        <p>Store your pentest findings and retrieve them when needed.</p>
      </header>

      <main>
        <section className="input-section">
          <div className="card">
            <h2><PlusCircle size={20} /> Add New Knowledge</h2>
            <textarea
              placeholder="Paste your findings, commands, or knowledge here..."
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
            />
            <input
              type="text"
              placeholder="Source (e.g., HTB-Machine-Name, CVE-2024-XXXX)"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
            <button onClick={handleAddKnowledge} disabled={adding || !knowledge}>
              {adding ? <Loader2 className="spin" size={18} /> : 'Add to Database'}
            </button>
            {message && <p className="status-message">{message}</p>}
          </div>
        </section>

        <section className="query-section">
          <div className="card">
            <h2><Search size={20} /> Query Knowledge</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              />
              <button onClick={handleQuery} disabled={loading || !query}>
                {loading ? <Loader2 className="spin" size={18} /> : 'Search'}
              </button>
            </div>

            {results && (
              <div className="results">
                <h3><BookOpen size={18} /> Retrieved Context</h3>
                <div className="answer">
                  {results.answer.split('\n---CHUNK---\n').map((chunk, i) => (
                    <div key={i} className="chunk">
                      {chunk}
                    </div>
                  ))}
                </div>
                <div className="sources">
                  <strong>Sources:</strong> {results.sources.join(', ')}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
