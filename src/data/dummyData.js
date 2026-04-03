export const users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '+91 9876543210',
    password: 'password123',
    walletBalance: 2500.00
  }
];

export const vehicles = [
  {
    id: 1,
    userId: 1,
    vehicleNumber: 'MH12AB1234',
    vehicleType: 'Car',
    tagId: 'TAG001234567890',
    balance: 450.00,
    status: 'Active'
  },
  {
    id: 2,
    userId: 1,
    vehicleNumber: 'MH14CD5678',
    vehicleType: 'Bike',
    tagId: 'TAG001234567891',
    balance: 120.00,
    status: 'Active'
  }
];

export const transactions = [
  {
    id: 1,
    vehicleId: 1,
    vehicleNumber: 'MH12AB1234',
    amount: 500.00,
    date: '2024-01-15',
    time: '14:30',
    status: 'Success',
    paymentMethod: 'UPI',
    transactionId: 'TXN123456789'
  },
  {
    id: 2,
    vehicleId: 2,
    vehicleNumber: 'MH14CD5678',
    amount: 200.00,
    date: '2024-01-10',
    time: '10:15',
    status: 'Success',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN123456790'
  },
  {
    id: 3,
    vehicleId: 1,
    vehicleNumber: 'MH12AB1234',
    amount: 300.00,
    date: '2024-01-05',
    time: '16:45',
    status: 'Success',
    paymentMethod: 'Debit Card',
    transactionId: 'TXN123456791'
  }
];

export const paymentMethods = [
  { id: 1, name: 'UPI', icon: '📱' },
  { id: 2, name: 'Credit Card', icon: '💳' },
  { id: 3, name: 'Debit Card', icon: '💳' },
  { id: 4, name: 'Net Banking', icon: '🏦' }
];