# FASTag Recharge — Full-Stack Fintech App

A production-ready full-stack FASTag recharge application built with React.js, Node.js/Express, and MongoDB.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, React Router, Recharts    |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT + bcryptjs                      |
| Charts     | Recharts                            |

---

## Folder Structure

```
Fasttag-main/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── transactionController.js
│   │   ├── adminController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + adminOnly
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vehicles.js
│   │   ├── transactions.js
│   │   ├── admin.js
│   │   └── notifications.js
│   ├── .env
│   └── server.js
│
├── src/                        # React frontend
│   ├── context/
│   │   └── AuthContext.js      # Global JWT auth state
│   ├── utils/
│   │   └── api.js              # Centralized API service
│   ├── pages/
│   │   ├── Login.js
│   │   ├── SignUp.js
│   │   ├── Dashboard.js        # With Recharts area chart
│   │   ├── VehicleManagement.js
│   │   ├── Recharge.js
│   │   ├── RechargeHistory.js  # Search, filter, pagination, PDF invoice
│   │   ├── Profile.js          # Edit profile + change password
│   │   ├── PaymentSuccess.js
│   │   └── admin/
│   │       └── AdminDashboard.js  # Analytics + user/tx management
│   └── components/
│       ├── Navbar.js           # With notifications bell
│       └── ...
│
├── .env                        # REACT_APP_API_URL
└── package.json
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

---

## Setup — Step by Step

### 1. Clone & navigate

```bash
cd Fasttag-main
```

### 2. Setup Backend

```bash
cd backend
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fasttag
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
LOW_BALANCE_THRESHOLD=100
```

Install and start:
```bash
npm install
npm run dev       # development (nodemon)
# or
npm start         # production
```

Backend runs at: `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ..             # back to project root
```

Edit `.env` (already created):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Install and start:
```bash
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## MongoDB Atlas (Cloud) Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGO_URI` in `backend/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fasttag
```

---

## Creating an Admin User

After registering a normal user, open MongoDB shell or Compass and run:

```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

The Admin Dashboard will then be accessible at `/admin`.

---

## API Reference

### Auth
| Method | Endpoint                  | Auth | Description          |
|--------|---------------------------|------|----------------------|
| POST   | /api/auth/register        | No   | Register new user    |
| POST   | /api/auth/login           | No   | Login, returns JWT   |
| GET    | /api/auth/me              | Yes  | Get current user     |
| PUT    | /api/auth/profile         | Yes  | Update name/phone    |
| PUT    | /api/auth/change-password | Yes  | Change password      |

### Vehicles
| Method | Endpoint           | Auth | Description       |
|--------|--------------------|------|-------------------|
| GET    | /api/vehicles      | Yes  | Get user vehicles |
| POST   | /api/vehicles      | Yes  | Add vehicle       |
| PUT    | /api/vehicles/:id  | Yes  | Update vehicle    |
| DELETE | /api/vehicles/:id  | Yes  | Delete vehicle    |

### Transactions
| Method | Endpoint                        | Auth | Description              |
|--------|---------------------------------|------|--------------------------|
| GET    | /api/transactions               | Yes  | Get transactions (paged) |
| POST   | /api/transactions/recharge      | Yes  | Process recharge         |
| GET    | /api/transactions/:id/invoice   | Yes  | Get invoice data         |

Query params for GET /api/transactions: `search`, `status`, `page`, `limit`

### Notifications
| Method | Endpoint                      | Auth | Description          |
|--------|-------------------------------|------|----------------------|
| GET    | /api/notifications            | Yes  | Get notifications    |
| PUT    | /api/notifications/read-all   | Yes  | Mark all as read     |

### Admin (role: admin only)
| Method | Endpoint                        | Auth  | Description              |
|--------|---------------------------------|-------|--------------------------|
| GET    | /api/admin/users                | Admin | List all users           |
| PUT    | /api/admin/users/:id/toggle     | Admin | Activate/deactivate user |
| GET    | /api/admin/transactions         | Admin | All transactions         |
| GET    | /api/admin/analytics            | Admin | Revenue + user analytics |

---

## Database Schema

### User
```
name, email (unique), phone, password (hashed),
walletBalance (default: 1000), role (user|admin),
notifications: [{ message, type, read, createdAt }],
isActive, timestamps
```

### Vehicle
```
userId (ref: User), vehicleNumber, vehicleType (Car|Bike|Truck|Bus),
tagId (unique), balance (default: 0), status (Active|Inactive), timestamps
```

### Transaction
```
userId (ref: User), vehicleId (ref: Vehicle), vehicleNumber,
amount, paymentMethod, transactionId (auto-generated),
status (Success|Pending|Failed), balanceBefore, balanceAfter, timestamps
```

---

## Features Implemented

- JWT authentication (login / signup / logout / persist on refresh)
- Password hashing with bcrypt
- Wallet balance deduction on recharge
- Low balance notifications (wallet < ₹100, FASTag < ₹100)
- Transaction invoice download (text format)
- Search + filter + pagination on transaction history
- Admin dashboard with bar/line charts (Recharts)
- Admin: view all users, activate/deactivate, view all transactions
- Analytics: daily revenue, monthly revenue, 30-day chart
- Notification bell in navbar with unread count
- Admin route guard (role-based)
- Centralized error handling
- Environment variable configuration

---

## Running Both Servers

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm start
```
