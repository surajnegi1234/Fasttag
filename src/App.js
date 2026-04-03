import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import VehicleManagement from './pages/VehicleManagement';
import Recharge from './pages/Recharge';
import PaymentSuccess from './pages/PaymentSuccess';
import RechargeHistory from './pages/RechargeHistory';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';
import './styles/App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loading"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loading"></div></div>;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  const { user, logout } = useAuth();

  return (
    <div className="App">
      {user && <Navbar user={user} onLogout={logout} />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/vehicles" element={<PrivateRoute><VehicleManagement /></PrivateRoute>} />
        <Route path="/recharge/:vehicleId?" element={<PrivateRoute><Recharge /></PrivateRoute>} />
        <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><RechargeHistory /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/" element={<Navigate to={user?.role === 'admin' ? '/admin' : '/login'} />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
