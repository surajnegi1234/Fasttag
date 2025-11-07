import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdDirectionsCar, MdHistory, MdPerson, MdLogout } from 'react-icons/md';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: MdHome },
    { path: '/vehicles', label: 'Vehicles', icon: MdDirectionsCar },
    { path: '/history', label: 'History', icon: MdHistory },
    { path: '/profile', label: 'Profile', icon: MdPerson }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🏷️</span>
          <span className="brand-text">FASTag</span>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-item ${isActive(item.path) ? 'navbar-item-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="navbar-icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-balance">₹{user?.walletBalance?.toFixed(2)}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <MdLogout />
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;