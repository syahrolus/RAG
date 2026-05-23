import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PlusCircle, Database, BookOpen, Loader2, Trash2, Edit, Save, X, List } from 'lucide-react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:7744`;

interface Entry {
  id: string;
  content: string;
  source: string;
  chunks: number;
}

function App() {
  const [knowledge, setKnowledge] = useState('');
  const [source, setSource] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ answer: string; sources: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'search' | 'manage'>('search');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSource, setEditSource] = useState('');

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list_knowledge`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    if (view === 'manage') {
      fetchEntries();
    }
  }, [view]);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this knowledge?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/delete_knowledge/${id}`);
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const startEdit = (entry: Entry) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
    setEditSource(entry.source);
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(`${API_BASE_URL}/update_knowledge/${id}`, {
        content: editContent,
        metadata: { source: editSource }
      });
      setEditingId(null);
      fetchEntries();
      setMessage('Updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1><Database size={32} /> Pentest RAG Knowledge Base</h1>
        <div className="nav-tabs">
          <button className={view === 'search' ? 'active' : ''} onClick={() => setView('search')}>
            <Search size={18} /> Search & Add
          </button>
          <button className={view === 'manage' ? 'active' : ''} onClick={() => setView('manage')}>
            <List size={18} /> Manage Database
          </button>
        </div>
      </header>

      <main>
        {view === 'search' ? (
          <>
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
          </>
        ) : (
          <section className="manage-section">
            <div className="card full-width">
              <h2><List size={20} /> Database Entries ({entries.length})</h2>
              <div className="entry-list">
                {entries.length === 0 ? (
                  <p>No entries found in database.</p>
                ) : (
                  entries.map(entry => (
                    <div key={entry.id} className="entry-item">
                      {editingId === entry.id ? (
                        <div className="edit-form">
                          <textarea 
                            value={editContent} 
                            onChange={(e) => setEditContent(e.target.value)} 
                          />
                          <input 
                            type="text" 
                            value={editSource} 
                            onChange={(e) => setEditSource(e.target.value)} 
                          />
                          <div className="edit-actions">
                            <button className="btn-save" onClick={() => handleUpdate(entry.id)}>
                              <Save size={16} /> Save
                            </button>
                            <button className="btn-cancel" onClick={() => setEditingId(null)}>
                              <X size={16} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="entry-content-preview">
                            <p>{entry.content.substring(0, 200)}{entry.content.length > 200 ? '...' : ''}</p>
                            <span className="badge">{entry.source}</span>
                            <span className="badge-light">{entry.chunks} chunks</span>
                          </div>
                          <div className="entry-actions">
                            <button className="btn-icon" title="Edit" onClick={() => startEdit(entry)}>
                              <Edit size={18} />
                            </button>
                            <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(entry.id)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
