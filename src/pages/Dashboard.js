import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdAccountBalanceWallet, MdDirectionsCar, MdLocalOffer, MdAssessment } from 'react-icons/md';
import { dataManager } from '../utils/dataManager';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import TransactionItem from '../components/TransactionItem';
import VehicleCard from '../components/VehicleCard';
import Button from '../components/Button';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const vehicles = dataManager.getVehicles();
  const transactions = dataManager.getTransactions();
  const userVehicles = vehicles.filter(v => v.userId === user?.id);
  const recentTransactions = transactions.slice(0, 3);
  const totalBalance = userVehicles.reduce((sum, vehicle) => sum + vehicle.balance, 0);

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.name}!</h1>
            <p className="page-subtitle">Manage your FASTag accounts and recharges</p>
          </div>
          <Link to="/recharge">
            <Button variant="primary" size="large">
              Quick Recharge
            </Button>
          </Link>
        </div>

        <div className="dashboard-stats">
          <StatCard 
            icon={MdAccountBalanceWallet}
            value={`₹${user?.walletBalance?.toFixed(2)}`}
            label="Wallet Balance"
            color="success"
          />
          <StatCard 
            icon={MdDirectionsCar}
            value={userVehicles.length}
            label="Registered Vehicles"
          />
          <StatCard 
            icon={MdLocalOffer}
            value={`₹${totalBalance.toFixed(2)}`}
            label="Total FASTag Balance"
            color="primary"
          />
          <StatCard 
            icon={MdAssessment}
            value={transactions.length}
            label="Total Transactions"
          />
        </div>

        <div className="dashboard-content">
          <div className="vehicles-section">
            <div className="section-header">
              <h2 className="section-title">Your Vehicles</h2>
              <Link to="/vehicles">
                <Button variant="ghost" size="small">
                  Manage All
                </Button>
              </Link>
            </div>
            
            {userVehicles.length > 0 ? (
              <div className="vehicles-grid">
                {userVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={MdDirectionsCar}
                title="No Vehicles Added"
                message="Add your first vehicle to start using FASTag services"
                actionText="Add Vehicle"
                onAction={() => navigate('/vehicles')}
              />
            )}
          </div>

          <div className="transactions-section">
            <div className="section-header">
              <h2 className="section-title">Recent Transactions</h2>
              <Link to="/history">
                <Button variant="ghost" size="small">
                  View All
                </Button>
              </Link>
            </div>
            
            <Card>
              {recentTransactions.length > 0 ? (
                <div className="transactions-list">
                  {recentTransactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="empty-transactions">
                  <p>No transactions yet</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;