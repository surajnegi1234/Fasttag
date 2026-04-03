import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, amount, paymentMethod, transaction, newBalance } = location.state || {};

  useEffect(() => {
    if (!vehicle || !amount) navigate('/dashboard');
  }, [vehicle, amount, navigate]);

  if (!vehicle || !amount) return null;

  const transactionId = transaction?.transactionId || `TXN${Date.now()}`;
  const dateTime = transaction?.createdAt
    ? new Date(transaction.createdAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="payment-success-page">
      <div className="container">
        <div className="success-container">
          <Card className="success-card">
            <div className="success-animation">
              <svg className="success-checkmark" viewBox="0 0 52 52">
                <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="success-checkmark__check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>

            <div className="success-content">
              <h1 className="success-title">Payment Successful!</h1>
              <p className="success-message">Your FASTag has been recharged successfully</p>

              <div className="transaction-details">
                <div className="detail-row">
                  <span className="detail-label">Vehicle Number</span>
                  <span className="detail-value">{vehicle.vehicleNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Recharge Amount</span>
                  <span className="detail-value amount">₹{parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">{paymentMethod?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value">{transactionId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date & Time</span>
                  <span className="detail-value">{dateTime}</span>
                </div>
                <div className="detail-row highlight">
                  <span className="detail-label">New FASTag Balance</span>
                  <span className="detail-value">₹{parseFloat(newBalance || vehicle.balance).toFixed(2)}</span>
                </div>
              </div>

              <div className="success-actions">
                <Button variant="primary" size="large" onClick={() => navigate('/dashboard')} className="btn-full">
                  Go to Dashboard
                </Button>
                <Button variant="secondary" size="medium" onClick={() => navigate('/history')} className="btn-full">
                  View Transaction History
                </Button>
              </div>

              <div className="success-note">
                <p><strong>Note:</strong> It may take up to 5 minutes for the balance to reflect in your FASTag account.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
