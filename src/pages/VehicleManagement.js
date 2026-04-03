import React, { useState, useEffect } from 'react';
import { MdDirectionsCar } from 'react-icons/md';
import { vehicleAPI } from '../utils/api';
import Card from '../components/Card';
import VehicleCard from '../components/VehicleCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import './VehicleManagement.css';

const INITIAL_FORM = { vehicleNumber: '', vehicleType: 'Car', tagId: '' };

const VehicleManagement = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    vehicleAPI.getAll().then(setVehicleList).catch(console.error);
  }, []);

  const openAdd = () => { setEditingVehicle(null); setFormData(INITIAL_FORM); setIsModalOpen(true); };
  const openEdit = (v) => { setEditingVehicle(v); setFormData({ vehicleNumber: v.vehicleNumber, vehicleType: v.vehicleType, tagId: v.tagId }); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await vehicleAPI.delete(id);
      setVehicleList(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingVehicle) {
        const updated = await vehicleAPI.update(editingVehicle._id, formData);
        setVehicleList(prev => prev.map(v => v._id === updated._id ? updated : v));
      } else {
        const created = await vehicleAPI.add(formData);
        setVehicleList(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="vehicle-management-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Vehicle Management</h1>
            <p className="page-subtitle">Manage your registered vehicles and FASTag accounts</p>
          </div>
          <Button variant="primary" onClick={openAdd}>Add Vehicle</Button>
        </div>

        {vehicleList.length > 0 ? (
          <div className="vehicles-grid">
            {vehicleList.map(vehicle => (
              <div key={vehicle._id} className="vehicle-card-wrapper">
                <VehicleCard vehicle={vehicle} showRechargeButton={false} />
                <div className="vehicle-actions">
                  <Button variant="secondary" size="small" onClick={() => openEdit(vehicle)}>Edit</Button>
                  <Button variant="danger" size="small" onClick={() => handleDelete(vehicle._id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={MdDirectionsCar} title="No Vehicles Added"
            message="Add your first vehicle to start managing your FASTag accounts"
            actionText="Add Your First Vehicle" onAction={openAdd} />
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
          title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-banner">{error}</div>}
            <InputField label="Vehicle Number" name="vehicleNumber" placeholder="e.g., MH12AB1234"
              value={formData.vehicleNumber} onChange={handleChange} required />
            <div className="input-field">
              <label className="input-label">Vehicle Type *</label>
              <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="input" required>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
                <option value="Bus">Bus</option>
              </select>
            </div>
            <InputField label="FASTag ID" name="tagId" placeholder="e.g., TAG001234567890"
              value={formData.tagId} onChange={handleChange} />
            <div className="modal-actions">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={loading}>
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
