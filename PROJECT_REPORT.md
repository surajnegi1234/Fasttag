# FASTag Recharge System: A Web Application Project Report

**Submitted by:** [Your Name]  
**Roll Number:** [Your Roll Number]  
**Course:** [Your Course, e.g., Bachelor of Technology in Computer Science]  
**Semester:** [Your Semester]  
**Date of Submission:** [Current Date]

---

## 1. 📘 Abstract

The FASTag Recharge System is a web-based application designed to simulate the digital recharge and management of FASTag devices used for toll payments in India. FASTag is an electronic toll collection system that allows vehicles to pass through toll plazas without stopping, making travel faster and more convenient. This project provides users with a platform to manage their vehicle details, recharge their FASTag balance, view transaction history, and handle their profiles securely.

In the real world, FASTag is widely used across Indian highways, reducing traffic congestion at toll booths and promoting cashless transactions. This application mimics the core functionalities of such systems, helping users understand how digital payment systems work. By building this project, we demonstrate the integration of frontend and backend technologies to create a user-friendly web application that handles authentication, data management, and secure transactions.

---

## 2. 🎯 Objectives

The main objectives of this project are:

- **To solve the problem of manual toll collection:** Traditional toll systems require vehicles to stop, leading to delays. This application simulates a digital alternative where users can recharge their FASTag online.
- **To provide a secure platform for vehicle and transaction management:** Users can add vehicles, recharge balances, and track history without worrying about data security.
- **To demonstrate full-stack web development skills:** The project showcases the use of modern web technologies like React.js for the frontend and Node.js for the backend.
- **To educate users about digital payment systems:** It helps in understanding how real-world applications like FASTag work, including authentication and data handling.

This project is useful because it simplifies the recharge process, reduces the need for physical visits to toll plazas, and promotes digital literacy in financial transactions.

---

## 3. 🧠 System Overview

The FASTag Recharge System is a web application that allows users to manage their FASTag accounts digitally. It works like an online banking app but focused on toll recharges. Users can create an account, log in, add their vehicles, recharge their FASTag balance using various payment methods, and view their transaction history.

### User Flow:

1. **Registration/Login:** New users sign up with their details. Existing users log in.
2. **Dashboard:** After login, users see an overview of their vehicles and balance.
3. **Vehicle Management:** Users add, edit, or remove vehicle details.
4. **Recharge:** Users select a vehicle, choose an amount, and complete payment.
5. **History:** Users view past recharges and transactions.
6. **Profile:** Users update their personal information.

The application ensures that only logged-in users can access sensitive features, and all data is stored securely in a database.

---

## 4. 🏗️ System Architecture

The system follows a client-server architecture with three main components: Frontend, Backend, and Database.

- **Frontend (Client-Side):** Built with React.js, this is what users see and interact with in their web browser. It handles user interfaces, form submissions, and displays data.
- **Backend (Server-Side):** Implemented using Node.js and Express.js, this handles business logic, processes requests from the frontend, and communicates with the database.
- **Database:** Uses MongoDB, a NoSQL database, to store user data, vehicle information, and transaction records.

### API Flow:

1. User interacts with the frontend (e.g., clicks "Login").
2. Frontend sends a request to the backend API (e.g., POST /api/auth/login).
3. Backend validates the request, queries the database if needed, and sends a response.
4. Frontend updates the UI based on the response.

### Diagram Description (Text-Based):

```
[User Browser] <--> [React Frontend] <--> [Express Backend] <--> [MongoDB Database]
       |                |                      |                      |
   User Interface   API Calls (HTTP)     Business Logic       Data Storage
```

This architecture ensures separation of concerns: the frontend focuses on user experience, the backend on logic and security, and the database on data persistence.

---

## 5. ⚙️ Technologies Used

- **React.js:** A JavaScript library for building user interfaces. It allows creating reusable components and manages the application's state efficiently.
- **Node.js and Express.js:** Node.js is a runtime for running JavaScript on the server. Express.js is a framework that simplifies building web servers and APIs.
- **MongoDB:** A NoSQL database that stores data in flexible, JSON-like documents. It's ideal for applications with varying data structures.
- **JWT (JSON Web Tokens):** Used for authentication. It's a secure way to transmit information between parties as a JSON object.
- **CSS:** For styling the application, making it visually appealing and responsive.

These technologies were chosen because they are popular, easy to learn, and work well together for full-stack web development.

---

## 6. 🔐 Authentication & Security

Authentication ensures that only authorized users can access the application. Here's how it works in simple terms:

- **Login/Signup Process:** Users enter their email and password. The backend checks if the credentials match those stored in the database. Passwords are never stored as plain text; they are hashed using bcrypt, which scrambles them into a secure format.
- **JWT Tokens:** When a user logs in successfully, the server creates a JWT token—a digital "passport" that proves the user's identity. This token is sent back to the frontend.
- **Token Storage:** The token is stored in the browser's localStorage (or sessionStorage for temporary sessions). It's included in every API request to the backend.
- **Protected Routes:** Certain pages (like Dashboard) require a valid token. The backend checks the token before allowing access. If invalid, the user is redirected to the login page.
- **Password Hashing:** Using bcrypt, passwords are converted into a hash before saving. This way, even if the database is compromised, passwords remain secure.

This setup prevents unauthorized access and protects user data.

---

## 7. 💻 Frontend Explanation

The frontend is built with React.js and consists of several pages and components.

### Pages:

- **Login Page:** Users enter email and password to log in. On success, they are redirected to the Dashboard.
- **Signup Page:** New users create an account by providing name, email, phone, password, and optional vehicle details.
- **Dashboard:** Shows an overview with wallet balance, recent transactions, and quick actions like recharge.
- **Vehicle Management:** Users can add new vehicles (with number and type), edit existing ones, or delete them.
- **Recharge Page:** Step-by-step flow: Select vehicle, enter amount, choose payment method (UPI, Card, etc.), confirm payment, and redirect to success page.
- **Transaction History:** Lists all past recharges with details like date, amount, and status.
- **Profile Page:** Users can update their name, phone, and change password.

### Components:

- **Button:** Reusable button for actions like "Submit" or "Add Vehicle."
- **Card:** Displays information in a neat box, e.g., vehicle details or transaction items.
- **Navbar:** Navigation bar at the top with links to pages and a logout button.
- **InputField:** Form fields for entering data like email or vehicle number.
- **Modal:** Pop-up windows for confirmations or additional forms.

### Routing:

React Router manages navigation between pages. For example, "/login" loads the Login component, and "/dashboard" loads the Dashboard. Private routes check if the user is logged in before allowing access.

---

## 8. 🖥️ Backend Explanation

The backend is implemented using Node.js and Express.js, handling all server-side logic.

### API Routes:

- **Authentication:** /api/auth/login (POST), /api/auth/register (POST), /api/auth/me (GET for user info).
- **Vehicles:** /api/vehicles (GET all, POST to add, PUT to update, DELETE to remove).
- **Transactions:** /api/transactions (GET history, POST /recharge for recharges).
- Other routes for notifications and admin functions.

### Request/Response Flow:

1. Frontend sends a request (e.g., login data).
2. Backend validates input, processes it (e.g., checks password), and queries the database.
3. Sends back a response (success with data or error message).

### Middleware:

- **Auth Verification:** Checks JWT tokens on protected routes. If invalid, returns an error.
- **Error Handling:** Catches and logs errors, sending user-friendly messages.

This ensures secure and reliable communication between frontend and database.

---

## 9. 🗄️ Database Design

The database uses MongoDB with three main collections:

- **Users Collection:**
  - Fields: \_id, name, email, phone, password (hashed), walletBalance, role, notifications, isActive, timestamps.
  - Stores user account information.

- **Vehicles Collection:**
  - Fields: \_id, userId (references Users), vehicleNumber, vehicleType, tagId, balance, status.
  - Linked to users; each user can have multiple vehicles.

- **Transactions Collection:**
  - Fields: \_id, vehicleId (references Vehicles), amount, date, time, status, paymentMethod, transactionId.
  - Records all recharge activities.

Relationships: Users have many Vehicles, Vehicles have many Transactions. This structure allows efficient querying and data integrity.

---

## 10. 🔄 Application Workflow

1. **User Registers:** Provides details; account created with initial wallet balance.
2. **Logs In:** Enters credentials; JWT token issued.
3. **Adds Vehicle:** Enters vehicle number and type; stored in database.
4. **Recharges FASTag:** Selects vehicle, enters amount, chooses payment; balance updated, transaction recorded.
5. **Views History:** Sees all past transactions.

This workflow ensures a smooth user experience from start to finish.

---

## 11. 🔑 Sample Login Credentials

For testing purposes, use these demo credentials:

- **Regular User:** Email: demo@example.com, Password: 123456
- **Admin User:** Email: admin@fasttag.com, Password: admin123

To create an admin user:

1. Sign up normally.
2. In MongoDB (via Compass), find the user document and change the `role` field from "user" to "admin".
3. Log in with that account to access admin features (e.g., user management).

Users can create new accounts via the Signup page by entering their details. The system will validate inputs and create a new user in the database.

---

## 12. 📊 Features

- **Authentication:** Secure login and signup with JWT.
- **Vehicle Management:** Add, edit, and delete vehicles.
- **Recharge System:** Recharge FASTag balance with multiple payment options.
- **Transaction History:** View detailed history of all recharges.
- **Dashboard Stats:** Overview of balance, vehicles, and recent activity.
- **Profile Management:** Update personal information and change passwords.

---

## 13. 🚀 How to Run the Project

Follow these step-by-step instructions to set up and run the FASTag Recharge System on your computer. This guide is designed for beginners.

### Prerequisites:

- **Node.js:** Download and install from [nodejs.org](https://nodejs.org). Choose the LTS version. This includes npm (Node Package Manager).
- **MongoDB:** Download and install from [mongodb.com](https://www.mongodb.com). Start the MongoDB service (usually via MongoDB Compass or command line).
- **Code Editor:** Use Visual Studio Code (VS Code) for editing files.

### Step-by-Step Setup:

1. **Download the Project:**
   - Download the project ZIP file from your source (e.g., GitHub) and extract it to a folder, e.g., `C:\Users\YourName\Desktop\Fasttag-main`.

2. **Install Frontend Dependencies:**
   - Open a terminal (Command Prompt or PowerShell on Windows).
   - Navigate to the project folder: `cd C:\Users\YourName\Desktop\Fasttag-main`.
   - Run: `npm install` (this installs React and other frontend libraries. It may take a few minutes).

3. **Install Backend Dependencies:**
   - In the terminal, go to the backend folder: `cd backend`.
   - Run: `npm install` (installs Express, MongoDB driver, etc.).

4. **Set Up Environment Variables:**
   - In the `backend` folder, create a file named `.env` (if it doesn't exist).
   - Add these lines (replace with your values):
     ```
     MONGO_URI=mongodb://localhost:27017/fasttag
     JWT_SECRET=your_secret_key_here (use a random string like 'myjwtsecret123')
     JWT_EXPIRE=30d
     ```
   - Save the file.

5. **Start MongoDB:**
   - Open MongoDB Compass or run `mongod` in a terminal to start the database server.

6. **Start the Backend Server:**
   - In the terminal (still in `backend` folder), run: `npm run dev` (for development mode) or `npm start` (for production).
   - You should see "Server running on port 5000" or similar.

7. **Start the Frontend:**
   - Open a new terminal.
   - Navigate back to the main project folder: `cd C:\Users\YourName\Desktop\Fasttag-main`.
   - Run: `npm start`.
   - The app will open in your browser at `http://localhost:3000`.

8. **Test the Application:**
   - Go to `http://localhost:3000` in your browser.
   - Sign up with new credentials.
   - Log in and explore the features.

### Troubleshooting:

- If "npm install" fails, ensure Node.js is installed (run `node -v` to check).
- If MongoDB connection fails, check the MONGO_URI in .env.
- For port issues, ensure ports 3000 and 5000 are free.

---

## 14. 📈 Future Enhancements

- **Payment Gateway Integration:** Connect to real payment providers like Razorpay.
- **Notifications:** Send SMS or email alerts for low balance.
- **Admin Panel:** Allow admins to manage users and view analytics.
- **Mobile App:** Extend to React Native for mobile users.

---

## 15. 🧾 Conclusion

This project successfully demonstrates a complete web application for FASTag recharge management. It integrates frontend and backend technologies to provide a secure, user-friendly platform. Through this, I learned about full-stack development, authentication, and database management. The application solves real-world problems and can be expanded for commercial use.

---

## 16. ❓ Viva Questions & Answers

1. **What is JWT?**  
   JWT stands for JSON Web Token. It's a secure way to send information between parties as a JSON object. In this project, it's used for user authentication.

2. **What is React?**  
   React is a JavaScript library for building user interfaces. It allows creating reusable components and manages the application's state.

3. **What is a REST API?**  
   REST API is a set of rules for building web services. It uses HTTP methods like GET, POST to communicate between frontend and backend.

4. **Difference between frontend and backend?**  
   Frontend is the user interface (what users see), built with React. Backend handles logic and data, built with Node.js.

5. **What is MongoDB?**  
   MongoDB is a NoSQL database that stores data in flexible documents. It's used here to store user, vehicle, and transaction data.

6. **How does authentication work?**  
   Users log in with email and password. The backend verifies it and issues a JWT token, which is stored and used for protected routes.

7. **What is bcrypt?**  
   Bcrypt is a library for hashing passwords. It scrambles passwords so they can't be read if the database is hacked.

8. **What is Express.js?**  
   Express.js is a framework for Node.js that simplifies building web servers and APIs.

9. **How are routes protected?**  
   Protected routes check for a valid JWT token in the request headers. If missing or invalid, access is denied.

10. **What is the purpose of this project?**  
    To simulate a FASTag recharge system, demonstrating web development skills and solving real-world toll management issues.

---

**End of Report**  
_Prepared for college submission. Ensure to add any required appendices, code snippets, or screenshots as per guidelines._
