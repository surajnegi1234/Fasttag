const mongoose = require('mongoose')

// create default admin if none exists
const seedAdmin = async () => {
  const User = require('../models/User')
  const admin = await User.findOne({ role: 'admin' })
  if (!admin) {
    await User.create({
      name: 'Admin',
      email: 'admin@fasttag.com',
      phone: '9999999999',
      password: 'Admin@123',
      role: 'admin'
    })
    console.log('Admin created => email: admin@fasttag.com | password: Admin@123')
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected:', conn.connection.host)
    await seedAdmin()
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
