import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🔥 Wake up Render backend on app load (free tier cold-start prevention)
// This fires silently in the background so the backend is warm before the user hits Login/Register
fetch('https://jobpilot-backend-l4o2.onrender.com/health', { method: 'GET' }).catch(() => {
  // Silently ignore — just a warm-up ping
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
