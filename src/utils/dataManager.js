import { users, vehicles, transactions } from '../data/dummyData';

// In-memory data store (in real app, this would be API calls)
let currentUser = null;
let currentVehicles = [...vehicles];
let currentTransactions = [...transactions];

export const dataManager = {
  // User management
  getCurrentUser: () => currentUser,
  setCurrentUser: (user) => {
    currentUser = { ...user };
  },
  updateUserWalletBalance: (amount) => {
    if (currentUser) {
      currentUser.walletBalance -= amount;
    }
  },

  // Vehicle management
  getVehicles: () => currentVehicles,
  updateVehicleBalance: (vehicleId, amount) => {
    currentVehicles = currentVehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, balance: vehicle.balance + amount }
        : vehicle
    );
  },

  // Transaction management
  getTransactions: () => currentTransactions,
  addTransaction: (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success'
    };
    currentTransactions = [newTransaction, ...currentTransactions];
    return newTransaction;
  },

  // Process recharge
  processRecharge: (vehicleId, amount, paymentMethod) => {
    // Update vehicle balance
    dataManager.updateVehicleBalance(vehicleId, amount);
    
    // Deduct from wallet
    dataManager.updateUserWalletBalance(amount);
    
    // Add transaction
    const vehicle = currentVehicles.find(v => v.id === vehicleId);
    const transaction = dataManager.addTransaction({
      vehicleId,
      vehicleNumber: vehicle.vehicleNumber,
      amount,
      paymentMethod: paymentMethod.name,
      transactionId: `TXN${Date.now()}`
    });
    
    return { updatedUser: currentUser, updatedVehicles: currentVehicles, transaction };
  }
};