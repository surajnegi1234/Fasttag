import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { dataManager } from './utils/dataManager';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import VehicleManagement from './pages/VehicleManagement';
import Recharge from './pages/Recharge';
import PaymentSuccess from './pages/PaymentSuccess';
import RechargeHistory from './pages/RechargeHistory';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    dataManager.setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleDataUpdate = () => {
    setCurrentUser(dataManager.getCurrentUser());
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar user={currentUser} onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard key={refreshKey} user={currentUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vehicles" 
            element={isAuthenticated ? <VehicleManagement /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/recharge/:vehicleId?" 
            element={isAuthenticated ? <Recharge onDataUpdate={handleDataUpdate} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payment-success" 
            element={isAuthenticated ? <PaymentSuccess /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/history" 
            element={isAuthenticated ? <RechargeHistory key={refreshKey} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;