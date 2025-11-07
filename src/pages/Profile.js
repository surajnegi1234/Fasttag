import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import './Profile.css';

const Profile = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In real app, would update user data
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">Manage your account information</p>

        <div className="profile-content">
          <Card>
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-text">{user?.name?.charAt(0)}</span>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
              </div>
              <Button 
                variant={isEditing ? "ghost" : "secondary"} 
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="profile-form">
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              
              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />

              {isEditing && (
                <div className="form-actions">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="section-title">Account Information</h3>
            <div className="account-stats">
              <div className="stat-item">
                <span className="stat-label">Wallet Balance</span>
                <span className="stat-value">₹{user?.walletBalance?.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">January 2024</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Account Status</span>
                <span className="stat-value status-active">Active</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title">Account Actions</h3>
            <div className="action-buttons">
              <Button variant="secondary" className="btn-full">
                Change Password
              </Button>
              <Button variant="danger" className="btn-full" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;