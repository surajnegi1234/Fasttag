import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDirectionsCar, MdTwoWheeler, MdLocalShipping } from 'react-icons/md';
import Card from './Card';
import Button from './Button';
import './VehicleCard.css';

const VehicleCard = ({ vehicle, showRechargeButton = true }) => {
  const navigate = useNavigate();

  const handleRecharge = () => {
    navigate(`/recharge/${vehicle.id}`);
  };

  const getVehicleIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'car': return MdDirectionsCar;
      case 'bike': return MdTwoWheeler;
      case 'truck': return MdLocalShipping;
      default: return MdDirectionsCar;
    }
  };

  const getBalanceColor = (balance) => {
    if (balance < 100) return 'low';
    if (balance < 300) return 'medium';
    return 'high';
  };

  return (
    <Card className="vehicle-card" hover>
      <div className="vehicle-header">
        <div className="vehicle-icon">
          {React.createElement(getVehicleIcon(vehicle.vehicleType))}
        </div>
        <div className="vehicle-info">
          <h3 className="vehicle-number">{vehicle.vehicleNumber}</h3>
          <p className="vehicle-type">{vehicle.vehicleType}</p>
        </div>
        <div className={`vehicle-status status-${vehicle.status.toLowerCase()}`}>
          {vehicle.status}
        </div>
      </div>

      <div className="vehicle-details">
        <div className="detail-item">
          <span className="detail-label">Tag ID</span>
          <span className="detail-value">{vehicle.tagId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Balance</span>
          <span className={`detail-value balance-${getBalanceColor(vehicle.balance)}`}>
            ₹{vehicle.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {showRechargeButton && (
        <div className="vehicle-actions">
          <Button 
            variant="primary" 
            size="medium" 
            className="btn-full"
            onClick={handleRecharge}
          >
            Recharge Now
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VehicleCard;