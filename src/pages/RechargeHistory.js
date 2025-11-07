import React, { useState } from 'react';
import { MdAssessment } from 'react-icons/md';
import { dataManager } from '../utils/dataManager';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import InputField from '../components/InputField';
import './RechargeHistory.css';

const RechargeHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const transactions = dataManager.getTransactions();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success': return 'success';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      default: return 'success';
    }
  };

  return (
    <div className="history-page">
      <div className="container">
        <h1 className="page-title">Transaction History</h1>
        <p className="page-subtitle">View all your FASTag recharge transactions</p>

        <Card className="filters-card">
          <div className="filters">
            <InputField
              placeholder="Search by vehicle number or transaction ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </Card>

        <Card>
          {filteredTransactions.length > 0 ? (
            <div className="transactions-table">
              <div className="table-header">
                <div className="header-cell">Date</div>
                <div className="header-cell">Vehicle</div>
                <div className="header-cell">Amount</div>
                <div className="header-cell">Method</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Transaction ID</div>
              </div>
              
              <div className="table-body">
                {filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="table-row">
                    <div className="table-cell">
                      <div className="date-time">
                        <div className="date">{transaction.date}</div>
                        <div className="time">{transaction.time}</div>
                      </div>
                    </div>
                    <div className="table-cell">
                      <div className="vehicle-info">
                        <div className="vehicle-number">{transaction.vehicleNumber}</div>
                      </div>
                    </div>
                    <div className="table-cell">
                      <div className="amount">₹{transaction.amount.toFixed(2)}</div>
                    </div>
                    <div className="table-cell">
                      <div className="payment-method">{transaction.paymentMethod}</div>
                    </div>
                    <div className="table-cell">
                      <span className={`status status-${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="table-cell">
                      <div className="transaction-id">{transaction.transactionId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState 
              icon={MdAssessment}
              title="No Transactions Found"
              message="No transactions match your current filters"
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default RechargeHistory;