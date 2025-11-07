import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdDirectionsCar, MdTwoWheeler, MdLocalShipping } from 'react-icons/md';
import { dataManager } from '../utils/dataManager';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { paymentMethods } from '../data/dummyData';
import './Recharge.css';

const Recharge = ({ onDataUpdate }) => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const vehicles = dataManager.getVehicles();
  
  const [selectedVehicle, setSelectedVehicle] = useState(
    vehicleId ? vehicles.find(v => v.id === parseInt(vehicleId)) : null
  );
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentStep(2);
  };

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  const handleAmountSubmit = () => {
    if (amount && parseFloat(amount) > 0) {
      setCurrentStep(3);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = () => {
    setLoading(true);
    
    // Check if user has sufficient wallet balance
    const currentUser = dataManager.getCurrentUser();
    const rechargeAmount = parseFloat(amount);
    
    if (currentUser.walletBalance < rechargeAmount) {
      alert('Insufficient wallet balance!');
      setLoading(false);
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      // Process the recharge
      const result = dataManager.processRecharge(
        selectedVehicle.id, 
        rechargeAmount, 
        selectedPaymentMethod
      );
      
      // Update parent component
      onDataUpdate();
      
      setLoading(false);
      navigate('/payment-success', {
        state: {
          vehicle: selectedVehicle,
          amount: rechargeAmount,
          paymentMethod: selectedPaymentMethod,
          transaction: result.transaction,
          newBalance: selectedVehicle.balance + rechargeAmount
        }
      });
    }, 2000);
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'step-active' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-label">Select Vehicle</div>
      </div>
      <div className={`step ${currentStep >= 2 ? 'step-active' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-label">Enter Amount</div>
      </div>
      <div className={`step ${currentStep >= 3 ? 'step-active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Payment</div>
      </div>
    </div>
  );

  const renderVehicleSelection = () => (
    <Card>
      <h2 className="section-title">Select Vehicle</h2>
      <div className="vehicles-list">
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className={`vehicle-option ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
            onClick={() => handleVehicleSelect(vehicle)}
          >
            <div className="vehicle-info">
              <div className="vehicle-icon">
                {vehicle.vehicleType === 'Car' ? <MdDirectionsCar /> : 
                 vehicle.vehicleType === 'Bike' ? <MdTwoWheeler /> : 
                 vehicle.vehicleType === 'Truck' ? <MdLocalShipping /> : <MdDirectionsCar />}
              </div>
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
  );

  const renderAmountSelection = () => (
    <Card>
      <h2 className="section-title">Enter Recharge Amount</h2>
      
      <div className="selected-vehicle-info">
        <div className="vehicle-icon">
          {selectedVehicle.vehicleType === 'Car' ? <MdDirectionsCar /> : 
           selectedVehicle.vehicleType === 'Bike' ? <MdTwoWheeler /> : 
           selectedVehicle.vehicleType === 'Truck' ? <MdLocalShipping /> : <MdDirectionsCar />}
        </div>
        <div>
          <div className="vehicle-number">{selectedVehicle.vehicleNumber}</div>
          <div className="current-balance">Current Balance: ₹{selectedVehicle.balance.toFixed(2)}</div>
        </div>
      </div>

      <div className="amount-section">
        <InputField
          label="Recharge Amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        
        <div className="quick-amounts">
          <p className="quick-amounts-label">Quick Select:</p>
          <div className="quick-amounts-grid">
            {quickAmounts.map(quickAmount => (
              <button
                key={quickAmount}
                type="button"
                className={`quick-amount-btn ${amount === quickAmount.toString() ? 'selected' : ''}`}
                onClick={() => handleAmountSelect(quickAmount)}
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="step-actions">
        <Button variant="ghost" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleAmountSubmit}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Continue
        </Button>
      </div>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card>
      <h2 className="section-title">Select Payment Method</h2>
      
      <div className="payment-summary">
        <div className="summary-item">
          <span>Vehicle:</span>
          <span>{selectedVehicle.vehicleNumber}</span>
        </div>
        <div className="summary-item">
          <span>Amount:</span>
          <span>₹{parseFloat(amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-methods">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            className={`payment-method ${selectedPaymentMethod?.id === method.id ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect(method)}
          >
            <div className="payment-icon">{method.icon}</div>
            <div className="payment-name">{method.name}</div>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <Button variant="ghost" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handlePayment}
          disabled={!selectedPaymentMethod}
          loading={loading}
        >
          Pay Now
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="recharge-page">
      <div className="container">
        <h1 className="page-title">Recharge FASTag</h1>
        
        {renderStepIndicator()}
        
        <div className="recharge-content">
          {currentStep === 1 && renderVehicleSelection()}
          {currentStep === 2 && renderAmountSelection()}
          {currentStep === 3 && renderPaymentMethods()}
        </div>
      </div>
    </div>
  );
};

export default Recharge;