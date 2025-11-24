Cool Tech Credential Manager
============================

A simple internal web app for managing login credentials across multiple divisions and organisational units.
Built with React, Express, MongoDB, and JWT authentication.

Users can log in, view their assigned divisions, and manage credentials based on their role:
- Normal users: view + add credentials
- Management: view + add + edit credentials
- Admin: full access (assign users, change roles, manage divisions/OUs)

-----------------------------------
Features
-----------------------------------
- User registration & login
- JWT authentication
- Role-based access control
- CRUD operations for credentials
- Admin panel for:
  • Assigning users to divisions
  • Assigning users to organisational units
  • Updating user roles

-----------------------------------
Tech Stack
-----------------------------------
Frontend: React + Bootstrap
Backend: Express + Node.js
Database: MongoDB + Mongoose
Auth: JWT

-----------------------------------
Getting Started
-----------------------------------

1) Clone the repository
-----------------------
git clone 
cd cool-tech-app

2) Install dependencies
-----------------------
Backend:
cd server
npm install

Frontend:
cd ../client
npm install

3) Add environment variables
----------------------------
Create a .env file in the server folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

4) Start the backend
--------------------
cd server
npm start
(Backend runs on http://localhost:5000)

5) Start the frontend
---------------------
cd client
npm start
(Frontend runs on http://localhost:3000)

-----------------------------------
Seed the Database (Optional)
-----------------------------------
To insert sample users, divisions, and OUs:
node seed.js

-----------------------------------
Done!
-----------------------------------
Open your browser and log in using one of the seeded users or register a new account.
