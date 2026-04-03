import React, { useState, useEffect, useCallback } from 'react';
import { MdAssessment, MdDownload } from 'react-icons/md';
import { transactionAPI } from '../utils/api';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './RechargeHistory.css';

const generateInvoicePDF = (invoice) => {
  const content = `
FASTTAG RECHARGE INVOICE
========================
Invoice No : ${invoice.invoiceNumber}
Date       : ${new Date(invoice.date).toLocaleString()}

CUSTOMER DETAILS
----------------
Name  : ${invoice.user.name}
Email : ${invoice.user.email}
Phone : ${invoice.user.phone}

VEHICLE DETAILS
---------------
Number : ${invoice.vehicle?.vehicleNumber || 'N/A'}
Type   : ${invoice.vehicle?.vehicleType || 'N/A'}
Tag ID : ${invoice.vehicle?.tagId || 'N/A'}

TRANSACTION DETAILS
-------------------
Transaction ID  : ${invoice.transactionId}
Payment Method  : ${invoice.paymentMethod}
Status          : ${invoice.status}
Balance Before  : Rs. ${invoice.balanceBefore?.toFixed(2)}
Recharge Amount : Rs. ${invoice.amount?.toFixed(2)}
Balance After   : Rs. ${invoice.balanceAfter?.toFixed(2)}

========================
Thank you for using FASTag Recharge!
  `.trim();

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoice.invoiceNumber}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const RechargeHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await transactionAPI.getAll({ search, status: statusFilter, page, limit: 15 });
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDownloadInvoice = async (txId) => {
    setDownloadingId(txId);
    try {
      const invoice = await transactionAPI.getInvoice(txId);
      generateInvoicePDF(invoice);
    } catch (err) {
      alert('Failed to generate invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="history-page">
      <div className="container">
        <h1 className="page-title">Transaction History</h1>
        <p className="page-subtitle">View all your FASTag recharge transactions</p>

        <Card className="filters-card">
          <div className="filters">
            <InputField placeholder="Search by vehicle number or transaction ID"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="status-filter">
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="loading-screen"><div className="loading"></div></div>
          ) : transactions.length > 0 ? (
            <>
              <div className="transactions-table">
                <div className="table-header">
                  <div className="header-cell">Date</div>
                  <div className="header-cell">Vehicle</div>
                  <div className="header-cell">Amount</div>
                  <div className="header-cell">Method</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell">Transaction ID</div>
                  <div className="header-cell">Invoice</div>
                </div>
                <div className="table-body">
                  {transactions.map(tx => (
                    <div key={tx._id} className="table-row">
                      <div className="table-cell">
                        <div className="date">{new Date(tx.createdAt).toLocaleDateString()}</div>
                        <div className="time">{new Date(tx.createdAt).toLocaleTimeString()}</div>
                      </div>
                      <div className="table-cell">{tx.vehicleNumber}</div>
                      <div className="table-cell">₹{tx.amount.toFixed(2)}</div>
                      <div className="table-cell">{tx.paymentMethod}</div>
                      <div className="table-cell">
                        <span className={`status status-${tx.status.toLowerCase()}`}>{tx.status}</span>
                      </div>
                      <div className="table-cell transaction-id">{tx.transactionId}</div>
                      <div className="table-cell">
                        <button className="invoice-btn" title="Download Invoice"
                          disabled={downloadingId === tx._id}
                          onClick={() => handleDownloadInvoice(tx._id)}>
                          <MdDownload />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <Button variant="ghost" size="small" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  <span>Page {page} of {totalPages}</span>
                  <Button variant="ghost" size="small" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState icon={MdAssessment} title="No Transactions Found" message="No transactions match your current filters" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default RechargeHistory;
