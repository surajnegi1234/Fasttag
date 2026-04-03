const express = require('express');
const router = express.Router();
const { getAllUsers, getAllTransactions, getAnalytics, toggleUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/transactions', getAllTransactions);
router.get('/analytics', getAnalytics);

module.exports = router;
