import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import { authAPI } from './utils/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      setShowLogin(false);
    } catch (error) {
      console.error('Login failed:', error);
      alert(error || 'Failed to log in. Please try again.');
    }
  };

  const handleSignup = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      setShowSignup(false);
    } catch (error) {
      console.error('Signup failed:', error);
      alert(error || 'Failed to create account. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            Mindful Journal
          </div>
          <div className="nav-buttons">
            {isLoggedIn ? (
              <>
                <span className="welcome-message">
                  Welcome, {user?.username || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="btn btn-outline"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setShowSignup(true)}
                  className="btn btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="hero">
        {isLoggedIn ? (
          <>
            <h1>
              Welcome back,
              <span>{user?.username || 'User'}</span>
            </h1>
            <p>
              Ready to write a new journal entry?
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => alert('Journal entry functionality coming soon!')}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                New Journal Entry
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>
              Your Personal
              <span>Mental Health Journal</span>
            </h1>
            <p>
              Track your thoughts, feelings, and progress on your mental health journey.
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => setShowSignup(true)}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Get Started
              </button>
              <button
                onClick={() => alert('Learn more about our journaling app')}
                className="btn btn-outline"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Learn more
              </button>
            </div>
          </>
        )}
      </main>

      {/* Auth Modals */}
      <LoginForm 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onSwitchToSignup={openSignup}
      />
      
      <SignupForm 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)}
        onSignup={handleSignup}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
}

export default App;
