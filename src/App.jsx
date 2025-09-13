import React, { useState, useEffect, useCallback } from 'react';

// --- STYLING (CSS) ---
const Style = () => (
  <style>{`
    body {
      background-color: #121212;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e5e5e5;
      display: flex;
      display : center;
      align-items: center;
      justify-content: center;
    }
    .dashboard-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: #1e1e1e;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.5);
    }
    h1, h2 {
      text-align: center;
      color: #ffffff;
      border-bottom: 2px solid #333;
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .button {
      padding: 0.5rem 1rem;
      border: none;
      background-color: #bb86fc;
      color: #121212;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #9b5de5;
    }
    .post-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .post-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #333;
      border-radius: 8px;
      background-color: #2c2c2c;
    }
    .post-item a {
      color: #bb86fc;
      text-decoration: none;
      font-weight: 500;
      word-break: break-all;
      margin-right: 1rem;
    }
    .post-item a:hover {
      text-decoration: underline;
    }
    .leads-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    .leads-table th, .leads-table td {
      border: 1px solid #333;
      padding: 0.75rem;
      text-align: left;
    }
    .leads-table th {
      background-color: #2c2c2c;
      font-weight: 600;
    }
    .leads-table tr:nth-child(even) {
      background-color: #1f1f1f;
    }
    .dm-link {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background-color: #03dac5;
      color: #121212;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
    }
    .dm-link:hover {
      background-color: #018786;
    }
    hr {
      border: 1px solid #333;
      margin: 2rem 0;
    }
  `}</style>
);

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
    } catch (error) {
      console.error("Failed to start scrape:", error);
      setMessage("Error: Could not start scrape job.");
    }
  };

  return (
    <>
      <Style />
      <div className="dashboard-container">
        <h1>Instagram Sales Agent Dashboard</h1>

        {message && <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

        <div className="section-container">
          <h2>My Instagram Posts</h2>
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
    </>
  );
}

export default App;
