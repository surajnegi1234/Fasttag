import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import './Profile.css';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePwChange = (e) => setPwData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setProfileMsg('');
    try {
      await authAPI.updateProfile(formData);
      await refreshUser();
      setIsEditing(false);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwMsg('Passwords do not match');
      return;
    }
    setLoading(true);
    setPwMsg('');
    try {
      await authAPI.changePassword({ currentPassword: pwData.currentPassword, newPassword: pwData.newPassword });
      setPwMsg('Password changed successfully!');
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg(err.message);
    } finally {
      setLoading(false);
    }
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
              <Button variant={isEditing ? 'ghost' : 'secondary'}
                onClick={() => { setIsEditing(!isEditing); setProfileMsg(''); }}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
            {profileMsg && <div className={profileMsg.includes('success') ? 'success-banner' : 'error-banner'}>{profileMsg}</div>}
            <div className="profile-form">
              <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
              <InputField label="Email Address" name="email" type="email" value={user?.email} disabled />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
              {isEditing && (
                <div className="form-actions">
                  <Button variant="primary" onClick={handleSave} loading={loading}>Save Changes</Button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="section-title">Change Password</h3>
            {pwMsg && <div className={pwMsg.includes('success') ? 'success-banner' : 'error-banner'}>{pwMsg}</div>}
            <form onSubmit={handlePasswordChange}>
              <InputField label="Current Password" name="currentPassword" type="password"
                value={pwData.currentPassword} onChange={handlePwChange} required />
              <InputField label="New Password" name="newPassword" type="password"
                value={pwData.newPassword} onChange={handlePwChange} required />
              <InputField label="Confirm New Password" name="confirmPassword" type="password"
                value={pwData.confirmPassword} onChange={handlePwChange} required />
              <Button type="submit" variant="secondary" loading={loading}>Change Password</Button>
            </form>
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
                <span className="stat-value">{new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Account Status</span>
                <span className="stat-value status-active">Active</span>
              </div>
            </div>
            <Button variant="danger" className="btn-full" onClick={logout}>Logout</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
