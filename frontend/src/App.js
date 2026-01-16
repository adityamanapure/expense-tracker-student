import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardContainer from './components/DashboardContainer';
import './App.css';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    
    return showLogin ? (
      <Login onToggleForm={() => setShowLogin(false)} />
    ) : (
      <Signup onToggleForm={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expency</h1>
        <div className="user-info">
          <span>Welcome, {user.name}!</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>
      <DashboardContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
