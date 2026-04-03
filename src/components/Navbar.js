import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdDirectionsCar, MdHistory, MdPerson, MdLogout, MdNotifications, MdAdminPanelSettings } from 'react-icons/md';
import { notificationAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    notificationAPI.getAll().then(setNotifications).catch(() => {});
  }, [location.pathname]);

  const unread = notifications.filter(n => !n.read).length;

  const handleMarkRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: MdHome },
    { path: '/vehicles', label: 'Vehicles', icon: MdDirectionsCar },
    { path: '/history', label: 'History', icon: MdHistory },
    { path: '/profile', label: 'Profile', icon: MdPerson }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🏷️</span>
          <span className="brand-text">FASTag</span>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-open' : ''}`}>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`navbar-item ${location.pathname === item.path ? 'navbar-item-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}>
              <item.icon className="navbar-icon" />
              <span>{item.label}</span>
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" className={`navbar-item ${location.pathname === '/admin' ? 'navbar-item-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}>
              <MdAdminPanelSettings className="navbar-icon" />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <div className="notif-wrapper">
            <button className="notif-btn" onClick={() => setShowNotifs(!showNotifs)}>
              <MdNotifications />
              {unread > 0 && <span className="notif-badge">{unread}</span>}
            </button>
            {showNotifs && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span>Notifications</span>
                  {unread > 0 && <button onClick={handleMarkRead} className="mark-read-btn">Mark all read</button>}
                </div>
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n, i) => (
                    <div key={i} className={`notif-item notif-${n.type} ${n.read ? 'read' : 'unread'}`}>
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-balance">₹{user?.walletBalance?.toFixed(2)}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}><MdLogout /></button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
