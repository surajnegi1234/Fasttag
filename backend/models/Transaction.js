const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicleNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, unique: true },
  status: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Success' },
  balanceBefore: { type: Number },
  balanceAfter: { type: Number }
}, { timestamps: true })

// auto generate txn id
transactionSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
  }
  next()
})

module.exports = mongoose.model('Transaction', transactionSchema)
