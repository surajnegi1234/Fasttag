const express = require('express');
const router = express.Router();
const { getTransactions, recharge, getInvoice } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getTransactions);
router.post('/recharge', recharge);
router.get('/:id/invoice', getInvoice);

module.exports = router;
