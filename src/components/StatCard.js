import React from 'react';
import Card from './Card';
import './StatCard.css';

const StatCard = ({ icon: Icon, value, label, color = 'primary' }) => {
  return (
    <Card className="stat-card" hover>
      <div className="stat-content">
        <div className={`stat-icon stat-icon-${color}`}>
          <Icon />
        </div>
        <div className="stat-info">
          <h3 className="stat-value">{value}</h3>
          <p className="stat-label">{label}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;