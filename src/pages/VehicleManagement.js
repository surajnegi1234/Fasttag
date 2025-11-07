import React, { useState } from 'react';
import { MdDirectionsCar } from 'react-icons/md';
import { dataManager } from '../utils/dataManager';
import Card from '../components/Card';
import VehicleCard from '../components/VehicleCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import './VehicleManagement.css';

const VehicleManagement = () => {
  const [vehicleList, setVehicleList] = useState(dataManager.getVehicles());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Car',
    tagId: ''
  });

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleNumber: '',
      vehicleType: 'Car',
      tagId: ''
    });
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      tagId: vehicle.tagId
    });
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicleList(prev => prev.filter(v => v.id !== vehicleId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVehicle) {
      // Update existing vehicle
      setVehicleList(prev => prev.map(v => 
        v.id === editingVehicle.id 
          ? { ...v, ...formData }
          : v
      ));
    } else {
      // Add new vehicle
      const newVehicle = {
        id: Date.now(),
        userId: 1,
        ...formData,
        balance: 0,
        status: 'Active'
      };
      setVehicleList(prev => [...prev, newVehicle]);
    }
    
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="vehicle-management-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Vehicle Management</h1>
            <p className="page-subtitle">Manage your registered vehicles and FASTag accounts</p>
          </div>
          <Button variant="primary" onClick={handleAddVehicle}>
            Add Vehicle
          </Button>
        </div>

        {vehicleList.length > 0 ? (
          <div className="vehicles-grid">
            {vehicleList.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card-wrapper">
                <VehicleCard vehicle={vehicle} showRechargeButton={false} />
                <div className="vehicle-actions">
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={MdDirectionsCar}
            title="No Vehicles Added"
            message="Add your first vehicle to start managing your FASTag accounts"
            actionText="Add Your First Vehicle"
            onAction={handleAddVehicle}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        >
          <form onSubmit={handleSubmit}>
            <InputField
              label="Vehicle Number"
              name="vehicleNumber"
              placeholder="e.g., MH12AB1234"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
            />
            
            <div className="input-field">
              <label className="input-label">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
                <option value="Bus">Bus</option>
              </select>
            </div>
            
            <InputField
              label="FASTag ID"
              name="tagId"
              placeholder="e.g., TAG001234567890"
              value={formData.tagId}
              onChange={handleChange}
              required
            />
            
            <div className="modal-actions">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default VehicleManagement;