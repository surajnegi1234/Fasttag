const Vehicle = require('../models/Vehicle')

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id })
    res.json(vehicles)
  } catch (err) {
    next(err)
  }
}

const addVehicle = async (req, res, next) => {
  try {
    const { vehicleNumber, vehicleType, tagId } = req.body
    const vehicle = await Vehicle.create({
      userId: req.user._id,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleType,
      tagId: tagId || 'TAG' + Date.now()
    })
    res.status(201).json(vehicle)
  } catch (err) {
    next(err)
  }
}

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user._id })
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' })

    const { vehicleNumber, vehicleType, tagId, status } = req.body
    if (vehicleNumber) vehicle.vehicleNumber = vehicleNumber.toUpperCase()
    if (vehicleType) vehicle.vehicleType = vehicleType
    if (tagId) vehicle.tagId = tagId
    if (status) vehicle.status = status

    await vehicle.save()
    res.json(vehicle)
  } catch (err) {
    next(err)
  }
}

const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' })
    res.json({ message: 'Vehicle deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getVehicles, addVehicle, updateVehicle, deleteVehicle }
