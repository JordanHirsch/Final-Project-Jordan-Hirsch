import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';    // your global resets
import './App.css';      // gym-theme styles
import axios from 'axios';
import App from './App';

// point axios at your backend, using an env var if provided
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// if we have a token, send it on every request
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
