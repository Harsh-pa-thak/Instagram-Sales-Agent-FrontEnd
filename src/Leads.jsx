import { useState, useEffect } from 'react';

// This component is now in its own file.
function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // This function fetches the latest leads from the server.
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://instagram-sales-agent.onrender.com/api/leads');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leads when the component first loads.
  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="section-container">
      <div className="header">
        <h2>Scraped Leads</h2>
        <button onClick={fetchLeads} disabled={loading} className="button">
          {loading ? 'Refreshing...' : 'Refresh Leads'}
        </button>
      </div>
      
      {loading && <p>Loading leads...</p>}
      
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Profile</th>
            <th>Send DM</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.username}</td>
              <td>
                <a href={lead.profile_url} target="_blank" rel="noopener noreferrer">
                  View Profile
                </a>
              </td>
              <td>
                <a href={`https://www.instagram.com/direct/new/`} target="_blank" rel="noopener noreferrer">
                  Open DM
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leads;
