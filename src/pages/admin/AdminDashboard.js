import React, { useState, useEffect } from 'react';
import { MdPeople, MdAttachMoney, MdTrendingUp, MdReceipt } from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { adminAPI } from '../../utils/api';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import './AdminDashboard.css';

const TABS = ['Overview', 'Users', 'Transactions'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('Overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (tab === 'Overview') {
          const data = await adminAPI.getAnalytics();
          setAnalytics(data);
        } else if (tab === 'Users') {
          const data = await adminAPI.getUsers({ search: userSearch });
          setUsers(data.users);
        } else {
          const data = await adminAPI.getTransactions();
          setTransactions(data.transactions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab, userSearch]);

  const handleToggleUser = async (id) => {
    try {
      const { user } = await adminAPI.toggleUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: user.isActive } : u));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {loading && <div className="loading-screen"><div className="loading"></div></div>}

        {!loading && tab === 'Overview' && analytics && (
          <>
            <div className="dashboard-stats">
              <StatCard icon={MdPeople} value={analytics.totalUsers} label="Total Users" />
              <StatCard icon={MdReceipt} value={analytics.totalTransactions} label="Total Transactions" />
              <StatCard icon={MdAttachMoney} value={`₹${analytics.dailyRevenue.toFixed(2)}`} label="Today's Revenue" color="success" />
              <StatCard icon={MdTrendingUp} value={`₹${analytics.monthlyRevenue.toFixed(2)}`} label="Monthly Revenue" color="primary" />
            </div>

            <div className="admin-charts">
              <Card>
                <h2 className="section-title">Daily Revenue (Last 30 Days)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h2 className="section-title">Transaction Count (Last 30 Days)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analytics.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}

        {!loading && tab === 'Users' && (
          <Card>
            <div className="admin-toolbar">
              <input className="admin-search" placeholder="Search users..."
                value={userSearch} onChange={e => setUserSearch(e.target.value)} />
            </div>
            <div className="admin-table">
              <div className="table-header">
                <div className="header-cell">Name</div>
                <div className="header-cell">Email</div>
                <div className="header-cell">Phone</div>
                <div className="header-cell">Wallet</div>
                <div className="header-cell">Joined</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Action</div>
              </div>
              {users.map(u => (
                <div key={u._id} className="table-row">
                  <div className="table-cell">{u.name}</div>
                  <div className="table-cell">{u.email}</div>
                  <div className="table-cell">{u.phone}</div>
                  <div className="table-cell">₹{u.walletBalance?.toFixed(2)}</div>
                  <div className="table-cell">{new Date(u.createdAt).toLocaleDateString()}</div>
                  <div className="table-cell">
                    <span className={`status ${u.isActive ? 'status-success' : 'status-failed'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="table-cell">
                    <Button size="small" variant={u.isActive ? 'danger' : 'secondary'}
                      onClick={() => handleToggleUser(u._id)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {!loading && tab === 'Transactions' && (
          <Card>
            <div className="admin-table">
              <div className="table-header">
                <div className="header-cell">Date</div>
                <div className="header-cell">User</div>
                <div className="header-cell">Vehicle</div>
                <div className="header-cell">Amount</div>
                <div className="header-cell">Method</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Transaction ID</div>
              </div>
              {transactions.map(tx => (
                <div key={tx._id} className="table-row">
                  <div className="table-cell">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  <div className="table-cell">{tx.userId?.name || 'N/A'}</div>
                  <div className="table-cell">{tx.vehicleNumber}</div>
                  <div className="table-cell">₹{tx.amount.toFixed(2)}</div>
                  <div className="table-cell">{tx.paymentMethod}</div>
                  <div className="table-cell">
                    <span className={`status status-${tx.status.toLowerCase()}`}>{tx.status}</span>
                  </div>
                  <div className="table-cell transaction-id">{tx.transactionId}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
