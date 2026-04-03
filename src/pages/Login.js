import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
    if (!formData.password) errs.password = 'Password is required';
    return errs;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const user = await login(formData);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="brand-logo">
            <span className="brand-icon">🏷️</span>
            <h1 className="brand-title">FASTag Recharge</h1>
          </div>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <Card className="login-card">
          <form onSubmit={handleSubmit}>
            {errors.general && <div className="error-banner">{errors.general}</div>}
            <InputField label="Email Address" type="email" name="email"
              placeholder="Enter your email" value={formData.email}
              onChange={handleChange} error={errors.email} required />
            <InputField label="Password" type="password" name="password"
              placeholder="Enter your password" value={formData.password}
              onChange={handleChange} error={errors.password} required />
            <Button type="submit" variant="primary" size="large" className="btn-full" loading={loading}>
              Sign In
            </Button>
            <div className="signup-prompt">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">Sign Up</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
