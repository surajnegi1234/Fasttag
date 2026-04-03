const User = require('../models/User')

const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('notifications')
    // newest first
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt))
  } catch (err) {
    next(err)
  }
}

const markAllRead = async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { 'notifications.$[].read': true } })
    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getNotifications, markAllRead }
