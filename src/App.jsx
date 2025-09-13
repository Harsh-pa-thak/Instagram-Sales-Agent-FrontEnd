import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Import the new stylesheet

// --- LEADS COMPONENT ---
function Leads({ refreshTrigger }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://instagram-sales-agent.onrender.com/api/leads');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger, fetchLeads]);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Scraped Leads</h2>
        <button className="button" onClick={fetchLeads} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Leads'}
        </button>
      </div>
      <table className="leads-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Profile</th>
            <th>Send DM</th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? leads.map(lead => (
            <tr key={lead.id || lead.username}>
              <td>{lead.username}</td>
              <td>
                <a href={lead.profile_url} target="_blank" rel="noopener noreferrer">
                  View Profile
                </a>
              </td>
              <td>
                <a
                  className="dm-link"
                  href={`https://www.instagram.com/direct/t/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open DM
                </a>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No leads found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  const [posts, setPosts] = useState([]);
  const [refreshLeads, setRefreshLeads] = useState(0);
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'https://instagram-sales-agent.onrender.com';

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setMessage('Error: Could not load posts.');
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleScrapeClick = async (postUrl) => {
    setMessage(`Sending scrape request for: ${postUrl}...`);
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_url: postUrl }),
      });
      const result = await response.json();
      setMessage(result.message);
      // Trigger a refresh of the leads after a successful scrape
      setRefreshLeads(prev => prev + 1);
    } catch (error) {
      console.error("Failed to start scrape:", error);
      setMessage("Error: Could not start scrape job.");
    }
  };

  return (
    <div className="App">
      <h1>Instagram Sales Agent Dashboard</h1>

      {message && <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      <div className="section-container">
        <div className="section-header">
          <h2>My Instagram Posts</h2>
        </div>
        <div className="post-list">
          {posts.length > 0 ? posts.map(post => (
            <div key={post.id} className="post-item">
              <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                {post.post_url}
              </a>
              <button className="button" onClick={() => handleScrapeClick(post.post_url)}>
                Scrape Leads
              </button>
            </div>
          )) : <p>No posts found. Add a post via the Make.com automation.</p>}
        </div>
      </div>

      <hr />

      <Leads refreshTrigger={refreshLeads} />
    </div>
  );
}

export default App;