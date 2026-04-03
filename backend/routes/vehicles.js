const express = require('express');
const router = express.Router();
const { getVehicles, addVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getVehicles).post(addVehicle);
router.route('/:id').put(updateVehicle).delete(deleteVehicle);

module.exports = router;
