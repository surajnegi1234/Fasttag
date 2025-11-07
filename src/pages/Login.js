import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import { users } from '../data/dummyData';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        onLogin(user);
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
      
      setLoading(false);
    }, 1000);
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
            {errors.general && (
              <div className="error-banner">
                {errors.general}
              </div>
            )}
            
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            
            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            
            <div className="login-options">
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="btn-full"
              loading={loading}
            >
              Sign In
            </Button>
            
            <div className="signup-prompt">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </div>
          </form>
        </Card>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;