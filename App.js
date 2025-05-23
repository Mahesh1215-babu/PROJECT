// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Keep default React CSS or remove if you create your own

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- 1. Fetch initial message from Flask Backend ---
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/message')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setBackendMessage(data.message))
      .catch(error => {
        console.error("Error fetching backend message:", error);
        setError("Could not connect to Flask backend. Is it running?");
      });
  }, []); // Empty dependency array means this runs once on component mount

  // --- 2. Handle Chatbot Submission ---
  const handleChatSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission reload
    setLoading(true);
    setBotResponse(''); // Clear previous response
    setError('');      // Clear previous error

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: chatInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Chatbot error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      setBotResponse(data.response); // Assuming 'response' key from Flask
      setChatInput(''); // Clear input field

    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      setError(`Error from bot: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="App" style={appStyle}>
      <header style={headerStyle}>
        <h1>🌿 Tree Plantation Chatbot 🌿</h1>
      </header>

      <main style={mainStyle}>
        <p style={welcomeMessageStyle}>
          {backendMessage ? `Backend Says: ${backendMessage}` : 'Connecting to backend...'}
        </p>
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

        <div style={chatbotContainerStyle}>
          <h2>Ask the Plant Bot</h2>
          <form onSubmit={handleChatSubmit} style={formStyle}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g. How to plant Tulsi?"
              disabled={loading}
              style={inputStyle}
              required
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Asking...' : 'Ask'}
            </button>
          </form>

          {botResponse && (
            <div style={responseContainerStyle}>
              <h3>Bot Response:</h3>
              <p>{botResponse}</p>
            </div>
          )}
        </div>
      </main>

      <footer style={footerStyle}>
        <p>&copy; 2025 Tree Plantation AI</p>
      </footer>
    </div>
  );
}

// Simple inline styles for demonstration (you'd use CSS modules or a proper CSS file normally)
const appStyle = {
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  backgroundColor: '#f0f8ff',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  color: '#333',
};

const headerStyle = {
  backgroundColor: '#2e8b57',
  color: 'white',
  padding: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const mainStyle = {
  flexGrow: 1,
  padding: '20px',
  maxWidth: '800px',
  margin: '20px auto',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const welcomeMessageStyle = {
  fontSize: '1.2em',
  marginBottom: '20px',
  color: '#2e8b57',
  fontWeight: 'bold',
};

const chatbotContainerStyle = {
  marginTop: '30px',
  borderTop: '1px solid #eee',
  paddingTop: '20px',
};

const formStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px',
  justifyContent: 'center',
};

const inputStyle = {
  padding: '10px',
  fontSize: '1em',
  border: '1px solid #ccc',
  borderRadius: '4px',
  flexGrow: 1,
  maxWidth: '400px',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '1em',
  backgroundColor: '#2e8b57',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const responseContainerStyle = {
  backgroundColor: '#e0ffe0',
  border: '1px solid #2e8b57',
  borderRadius: '8px',
  padding: '15px',
  marginTop: '20px',
  textAlign: 'left',
};

const footerStyle = {
  backgroundColor: '#eee',
  padding: '15px',
  marginTop: '30px',
  color: '#555',
};


export default App;