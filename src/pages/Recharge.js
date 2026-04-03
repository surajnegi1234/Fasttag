import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdDirectionsCar, MdTwoWheeler, MdLocalShipping } from 'react-icons/md';
import { vehicleAPI, transactionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import './Recharge.css';

const PAYMENT_METHODS = [
  { id: 1, name: 'UPI', icon: '📱' },
  { id: 2, name: 'Credit Card', icon: '💳' },
  { id: 3, name: 'Debit Card', icon: '💳' },
  { id: 4, name: 'Net Banking', icon: '🏦' }
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const VehicleIcon = ({ type }) => {
  if (type === 'Bike') return <MdTwoWheeler />;
  if (type === 'Truck') return <MdLocalShipping />;
  return <MdDirectionsCar />;
};

const Recharge = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    vehicleAPI.getAll().then(list => {
      setVehicles(list);
      if (vehicleId) {
        const v = list.find(v => v._id === vehicleId);
        if (v) { setSelectedVehicle(v); setCurrentStep(2); }
      }
    });
  }, [vehicleId]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await transactionAPI.recharge({
        vehicleId: selectedVehicle._id,
        amount: parseFloat(amount),
        paymentMethod: selectedPaymentMethod.name
      });
      await refreshUser();
      navigate('/payment-success', {
        state: {
          vehicle: result.vehicle,
          amount: parseFloat(amount),
          paymentMethod: selectedPaymentMethod,
          transaction: result.transaction,
          newBalance: result.vehicle.balance
        }
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {['Select Vehicle', 'Enter Amount', 'Payment'].map((label, i) => (
        <div key={i} className={`step ${currentStep >= i + 1 ? 'step-active' : ''}`}>
          <div className="step-number">{i + 1}</div>
          <div className="step-label">{label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="recharge-page">
      <div className="container">
        <h1 className="page-title">Recharge FASTag</h1>
        {renderStepIndicator()}
        <div className="recharge-content">
          {error && <div className="error-banner">{error}</div>}

          {currentStep === 1 && (
            <Card>
              <h2 className="section-title">Select Vehicle</h2>
              <div className="vehicles-list">
                {vehicles.map(vehicle => (
                  <div key={vehicle._id}
                    className={`vehicle-option ${selectedVehicle?._id === vehicle._id ? 'selected' : ''}`}
                    onClick={() => { setSelectedVehicle(vehicle); setCurrentStep(2); }}>
                    <div className="vehicle-info">
                      <div className="vehicle-icon"><VehicleIcon type={vehicle.vehicleType} /></div>
                      <div className="vehicle-details">
                        <div className="vehicle-number">{vehicle.vehicleNumber}</div>
                        <div className="vehicle-type">{vehicle.vehicleType}</div>
                      </div>
                    </div>
                    <div className="vehicle-balance">
                      <div className="balance-label">Current Balance</div>
                      <div className="balance-amount">₹{vehicle.balance.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {currentStep === 2 && selectedVehicle && (
            <Card>
              <h2 className="section-title">Enter Recharge Amount</h2>
              <div className="selected-vehicle-info">
                <div className="vehicle-icon"><VehicleIcon type={selectedVehicle.vehicleType} /></div>
                <div>
                  <div className="vehicle-number">{selectedVehicle.vehicleNumber}</div>
                  <div className="current-balance">Current Balance: ₹{selectedVehicle.balance.toFixed(2)}</div>
                </div>
              </div>
              <div className="wallet-info">Wallet Balance: ₹{user?.walletBalance?.toFixed(2)}</div>
              <div className="amount-section">
                <InputField label="Recharge Amount" type="number" placeholder="Enter amount"
                  value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <div className="quick-amounts">
                  <p className="quick-amounts-label">Quick Select:</p>
                  <div className="quick-amounts-grid">
                    {QUICK_AMOUNTS.map(q => (
                      <button key={q} type="button"
                        className={`quick-amount-btn ${amount === q.toString() ? 'selected' : ''}`}
                        onClick={() => setAmount(q.toString())}>₹{q}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="step-actions">
                <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button variant="primary" onClick={() => setCurrentStep(3)}
                  disabled={!amount || parseFloat(amount) <= 0}>Continue</Button>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <h2 className="section-title">Select Payment Method</h2>
              <div className="payment-summary">
                <div className="summary-item"><span>Vehicle:</span><span>{selectedVehicle.vehicleNumber}</span></div>
                <div className="summary-item"><span>Amount:</span><span>₹{parseFloat(amount).toFixed(2)}</span></div>
              </div>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(method => (
                  <div key={method.id}
                    className={`payment-method ${selectedPaymentMethod?.id === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod(method)}>
                    <div className="payment-icon">{method.icon}</div>
                    <div className="payment-name">{method.name}</div>
                  </div>
                ))}
              </div>
              <div className="step-actions">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button variant="primary" onClick={handlePayment}
                  disabled={!selectedPaymentMethod} loading={loading}>Pay Now</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recharge;
