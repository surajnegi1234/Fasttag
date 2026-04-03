const User = require('../models/User')
const Transaction = require('../models/Transaction')

const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query

    let query = { role: 'user' }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ users, total })
  } catch (err) {
    next(err)
  }
}

const getAllTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const query = status && status !== 'All' ? { status } : {}

    const total = await Transaction.countDocuments(query)
    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ transactions, total })
  } catch (err) {
    next(err)
  }
}

const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfDay = new Date(now.setHours(0, 0, 0, 0))
    const last30days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [totalUsers, totalTransactions, totalRev, dailyRev, monthlyRev, revenueByDay] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Transaction.countDocuments({ status: 'Success' }),
      Transaction.aggregate([
        { $match: { status: 'Success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { status: 'Success', createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { status: 'Success', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { status: 'Success', createdAt: { $gte: last30days } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ])

    res.json({
      totalUsers,
      totalTransactions,
      totalRevenue: totalRev[0]?.total || 0,
      dailyRevenue: dailyRev[0]?.total || 0,
      monthlyRevenue: monthlyRev[0]?.total || 0,
      revenueByDay
    })
  } catch (err) {
    next(err)
  }
}

// toggle user active/inactive
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.isActive = !user.isActive
    await user.save()
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAllUsers, getAllTransactions, getAnalytics, toggleUserStatus }
