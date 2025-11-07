import React from 'react';
import './TransactionItem.css';

const TransactionItem = ({ transaction }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success': return 'success';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      default: return 'success';
    }
  };

  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <div className="transaction-vehicle">{transaction.vehicleNumber}</div>
        <div className="transaction-date">{transaction.date} at {transaction.time}</div>
      </div>
      <div className="transaction-details">
        <div className="transaction-amount">₹{transaction.amount.toFixed(2)}</div>
        <div className={`transaction-status status-${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;