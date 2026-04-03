const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Vehicle = require('../models/Vehicle')

// cookie config - keeping it same everywhere
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, vehicleNumber, vehicleType } = req.body

    // check if email taken
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, phone, password })

    // if they added a vehicle during signup, create it too
    if (vehicleNumber) {
      await Vehicle.create({
        userId: user._id,
        vehicleNumber: vehicleNumber.toUpperCase(),
        vehicleType: vehicleType || 'Car',
        tagId: 'TAG' + Date.now(),
        balance: 0
      })
    }

    res.status(201).cookie('token', makeToken(user._id), cookieOpts).json({ user })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.cookie('token', makeToken(user._id), cookieOpts).json({ user })
  } catch (err) {
    next(err)
  }
}

// just returns whoever is logged in
const getMe = (req, res) => res.json(req.user)

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}

// clear the cookie on logout
const logout = (req, res) => res.clearCookie('token', cookieOpts).json({ message: 'Logged out' })

module.exports = { register, login, getMe, updateProfile, changePassword, logout }
