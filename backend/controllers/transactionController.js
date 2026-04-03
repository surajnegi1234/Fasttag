const Transaction = require('../models/Transaction')
const Vehicle = require('../models/Vehicle')
const User = require('../models/User')

const getTransactions = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query
    const query = { userId: req.user._id }

    if (status && status !== 'All') query.status = status
    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } }
      ]
    }

    const total = await Transaction.countDocuments(query)
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

const recharge = async (req, res, next) => {
  try {
    const { vehicleId, amount, paymentMethod } = req.body
    const amt = parseFloat(amount)

    if (!amt || amt <= 0) return res.status(400).json({ message: 'Invalid amount' })

    const [vehicle, user] = await Promise.all([
      Vehicle.findOne({ _id: vehicleId, userId: req.user._id }),
      User.findById(req.user._id)
    ])

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' })
    if (user.walletBalance < amt) return res.status(400).json({ message: 'Insufficient wallet balance' })

    const balanceBefore = vehicle.balance
    vehicle.balance += amt
    user.walletBalance -= amt

    // notify if wallet is running low
    const threshold = Number(process.env.LOW_BALANCE_THRESHOLD || 100)
    if (user.walletBalance < threshold) {
      user.notifications.push({
        message: `Low wallet balance: ₹${user.walletBalance.toFixed(2)}. Please add funds.`,
        type: 'warning'
      })
    }

    if (vehicle.balance < 100) {
      user.notifications.push({
        message: `Low FASTag balance on ${vehicle.vehicleNumber}: ₹${vehicle.balance.toFixed(2)}`,
        type: 'warning'
      })
    }

    const txn = await Transaction.create({
      userId: req.user._id,
      vehicleId: vehicle._id,
      vehicleNumber: vehicle.vehicleNumber,
      amount: amt,
      paymentMethod,
      status: 'Success',
      balanceBefore,
      balanceAfter: vehicle.balance
    })

    await Promise.all([vehicle.save(), user.save()])

    res.status(201).json({ transaction: txn, vehicle, walletBalance: user.walletBalance })
  } catch (err) {
    next(err)
  }
}

const getInvoice = async (req, res, next) => {
  try {
    const txn = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('vehicleId', 'vehicleNumber vehicleType tagId')

    if (!txn) return res.status(404).json({ message: 'Transaction not found' })

    res.json({
      invoiceNumber: `INV-${txn.transactionId}`,
      date: txn.createdAt,
      user: { name: req.user.name, email: req.user.email, phone: req.user.phone },
      vehicle: txn.vehicleId,
      amount: txn.amount,
      paymentMethod: txn.paymentMethod,
      status: txn.status,
      transactionId: txn.transactionId,
      balanceBefore: txn.balanceBefore,
      balanceAfter: txn.balanceAfter
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getTransactions, recharge, getInvoice }
