# FASTag Recharge App

A modern, responsive FASTag recharge platform built with React.js and CSS.

## 🚀 Features

- **User Authentication** - Login/Signup with demo credentials
- **Dashboard** - Overview of wallet balance, vehicles, and transactions
- **Vehicle Management** - Add, edit, and manage multiple vehicles
- **Recharge System** - Multi-step recharge process with payment methods
- **Transaction History** - View and filter past transactions
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Updates** - Wallet balance and transaction updates

## 🛠️ Tech Stack

- **Frontend:** React.js 18
- **Styling:** Pure CSS (no external libraries)
- **Icons:** React Icons
- **Routing:** React Router DOM
- **State Management:** Custom data manager

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 14.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

## 🏃♂️ Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/fasttag-recharge.git
cd fasttag-recharge
```

### Step 2: Install Dependencies
```bash
npm install
```
*This will install all required packages including React, React Router, and React Icons*

### Step 3: Start Development Server
```bash
npm start
```
*The app will automatically open in your browser at `http://localhost:3000`*

### Step 4: Login with Demo Credentials
- **Email:** test@example.com
- **Password:** password123

## 🔧 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## 📱 Demo Credentials

- **Email:** test@example.com
- **Password:** password123
- **Initial Wallet Balance:** ₹2,500
- **Pre-loaded Vehicles:** 2 (Car & Bike)
- **Sample Transactions:** 3 completed recharges

## 📁 Project Structure

```
fasttag-recharge/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── InputField.js
│   │   ├── Navbar.js
│   │   ├── VehicleCard.js
│   │   ├── StatCard.js
│   │   ├── EmptyState.js
│   │   ├── TransactionItem.js
│   │   └── Modal.js
│   ├── pages/              # Application pages
│   │   ├── Login.js
│   │   ├── SignUp.js
│   │   ├── Dashboard.js
│   │   ├── VehicleManagement.js
│   │   ├── Recharge.js
│   │   ├── PaymentSuccess.js
│   │   ├── RechargeHistory.js
│   │   └── Profile.js
│   ├── styles/             # Global CSS styles
│   ├── data/               # Dummy data
│   ├── utils/              # Utility functions
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
├── package.json
└── README.md
```

## 🎯 How to Use

1. **Login** with demo credentials
2. **Dashboard** - View wallet balance and vehicle stats
3. **Recharge** - Select vehicle → Enter amount → Choose payment method
4. **History** - View all transactions with filters
5. **Vehicles** - Manage your registered vehicles
6. **Profile** - Update account information

## 💳 Payment Flow

1. Select vehicle from dashboard or recharge page
2. Enter recharge amount (or use quick select buttons)
3. Choose payment method (UPI, Credit Card, Debit Card, Net Banking)
4. Confirm payment (2-second simulation)
5. View success page with transaction details
6. Updated balances reflect immediately

## 🔄 State Management

- **Wallet Balance** - Decreases when recharging vehicles
- **Vehicle Balance** - Increases with successful recharges
- **Transaction History** - New transactions appear immediately
- **Real-time Updates** - All components sync automatically

## 📱 Mobile Responsive

- Fully responsive design for all screen sizes
- Touch-friendly interface
- Collapsible navigation menu
- Optimized layouts for mobile devices

## 🚀 Deployment Options

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Your app is live!

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json: `"homepage": "https://yourusername.github.io/fasttag-recharge"`
3. Add scripts: `"predeploy": "npm run build", "deploy": "gh-pages -d build"`
4. Run: `npm run deploy`

## 🛠️ Troubleshooting

### Port 3000 already in use?
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
set PORT=3001 && npm start
```

### Node modules issues?
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
# Clear npm cache
npm cache clean --force
npm install
```

## 📄 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Verify Node.js version: `node --version`
4. Check npm version: `npm --version`

---

**Happy Coding! 🚀**