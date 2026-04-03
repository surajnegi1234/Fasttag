import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdAccountBalanceWallet, MdDirectionsCar, MdLocalOffer, MdAssessment } from 'react-icons/md';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { vehicleAPI, transactionAPI } from '../utils/api';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import TransactionItem from '../components/TransactionItem';
import VehicleCard from '../components/VehicleCard';
import Button from '../components/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [v, t] = await Promise.all([
          vehicleAPI.getAll(),
          transactionAPI.getAll({ limit: 10 })
        ]);
        setVehicles(v);
        setTransactions(t.transactions);

        // Build last 7 days chart data from transactions
        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return { date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), amount: 0 };
        });
        t.transactions.forEach(tx => {
          const txDate = new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          const entry = last7.find(d => d.date === txDate);
          if (entry) entry.amount += tx.amount;
        });
        setChartData(last7);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalBalance = vehicles.reduce((sum, v) => sum + v.balance, 0);

  if (loading) return <div className="loading-screen"><div className="loading"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.name}!</h1>
            <p className="page-subtitle">Manage your FASTag accounts and recharges</p>
          </div>
          <Link to="/recharge">
            <Button variant="primary" size="large">Quick Recharge</Button>
          </Link>
        </div>

        <div className="dashboard-stats">
          <StatCard icon={MdAccountBalanceWallet} value={`₹${user?.walletBalance?.toFixed(2)}`} label="Wallet Balance" color="success" />
          <StatCard icon={MdDirectionsCar} value={vehicles.length} label="Registered Vehicles" />
          <StatCard icon={MdLocalOffer} value={`₹${totalBalance.toFixed(2)}`} label="Total FASTag Balance" color="primary" />
          <StatCard icon={MdAssessment} value={transactions.length} label="Recent Transactions" />
        </div>

        {chartData.some(d => d.amount > 0) && (
          <Card className="chart-card">
            <h2 className="section-title">Recharge Activity (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`₹${v}`, 'Amount']} />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}

        <div className="dashboard-content">
          <div className="vehicles-section">
            <div className="section-header">
              <h2 className="section-title">Your Vehicles</h2>
              <Link to="/vehicles"><Button variant="ghost" size="small">Manage All</Button></Link>
            </div>
            {vehicles.length > 0 ? (
              <div className="vehicles-grid">
                {vehicles.map(vehicle => <VehicleCard key={vehicle._id} vehicle={vehicle} />)}
              </div>
            ) : (
              <EmptyState icon={MdDirectionsCar} title="No Vehicles Added"
                message="Add your first vehicle to start using FASTag services"
                actionText="Add Vehicle" onAction={() => navigate('/vehicles')} />
            )}
          </div>

          <div className="transactions-section">
            <div className="section-header">
              <h2 className="section-title">Recent Transactions</h2>
              <Link to="/history"><Button variant="ghost" size="small">View All</Button></Link>
            </div>
            <Card>
              {transactions.length > 0 ? (
                <div className="transactions-list">
                  {transactions.slice(0, 3).map(tx => <TransactionItem key={tx._id} transaction={tx} />)}
                </div>
              ) : (
                <div className="empty-transactions"><p>No transactions yet</p></div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
