// src/components/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Re-close the menu on any route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Always read token fresh so we reflect login/logout immediately
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        Fitness Freaks
      </Link>

      <button
        className="nav-toggle"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
        <Link className="nav-item" to="/">
          <i className="fas fa-dumbbell" style={{ marginRight: 8 }} />
          Home
        </Link>

        {isLoggedIn && (
          <Link className="nav-item" to="/posts/new">
            <i className="fas fa-plus-circle" style={{ marginRight: 8 }} />
            New Post
          </Link>
        )}

        {!isLoggedIn && (
          <>
            <Link className="nav-item" to="/login">
              <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }} />
              Login
            </Link>
            <Link className="nav-item" to="/register">
              <i className="fas fa-user-plus" style={{ marginRight: 8 }} />
              Register
            </Link>
          </>
        )}

        {isLoggedIn && (
          <button
            type="button"
            className="nav-item"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
