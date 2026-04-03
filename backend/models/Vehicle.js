const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNumber: { type: String, required: true, uppercase: true, trim: true },
  vehicleType: { type: String, enum: ['Car', 'Bike', 'Truck', 'Bus'], default: 'Car' },
  tagId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true })

module.exports = mongoose.model('Vehicle', vehicleSchema)
