import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import './SignUp.css';

const SignUp = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: '', vehicleNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name) errs.name = 'Name is required';
    if (!formData.phone) errs.phone = 'Phone is required';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!formData.vehicleNumber) errs.vehicleNumber = 'Vehicle number is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(formData);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="brand-logo">
            <span className="brand-icon">🏷️</span>
            <h1 className="brand-title">FASTag Recharge</h1>
          </div>
          <p className="signup-subtitle">Create your account</p>
        </div>

        <Card className="signup-card">
          <form onSubmit={handleSubmit}>
            {errors.general && <div className="error-banner">{errors.general}</div>}
            <div className="form-grid">
              <InputField label="Full Name" name="name" placeholder="Enter your full name"
                value={formData.name} onChange={handleChange} error={errors.name} required />
              <InputField label="Phone Number" name="phone" placeholder="Enter phone number"
                value={formData.phone} onChange={handleChange} error={errors.phone} required />
            </div>
            <InputField label="Email Address" type="email" name="email" placeholder="Enter your email"
              value={formData.email} onChange={handleChange} error={errors.email} required />
            <div className="form-grid">
              <InputField label="Password" type="password" name="password" placeholder="Enter password"
                value={formData.password} onChange={handleChange} error={errors.password} required />
              <InputField label="Confirm Password" type="password" name="confirmPassword"
                placeholder="Confirm password" value={formData.confirmPassword}
                onChange={handleChange} error={errors.confirmPassword} required />
            </div>
            <InputField label="Vehicle Number" name="vehicleNumber" placeholder="e.g., MH12AB1234"
              value={formData.vehicleNumber} onChange={handleChange} error={errors.vehicleNumber} required />
            <Button type="submit" variant="primary" size="large" className="btn-full" loading={loading}>
              Create Account
            </Button>
            <div className="login-prompt">
              Already have an account?{' '}
              <Link to="/login" className="login-link">Sign In</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
