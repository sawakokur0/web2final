Celery Body — Fitness Studio Management SystemThis is a full-stack web application developed for the Celery Body fitness studio. The system enables users to register, book fitness classes, and manage their personal profiles. It also includes administrative functionality for managing studio classes.Live Link: https://web2final-production-2f92.up.railway.app🚀 Project FeaturesUser Authentication Secure Sign Up and Sign In processes using JWT (JSON Web Tokens) and Bcrypt password encryption.Profile Management Users can view and update their personal information through a private dashboard.Class Booking System Functionality to browse the current studio schedule and book specific fitness sessions.Role-Based Access Control (RBAC) Different permission levels for user and admin roles to ensure system security.Email Notifications Automated welcome emails sent to new users via Nodemailer integration.Persistent Storage Cloud database management using MongoDB Atlas.🛠 Technical StackCategoryTechnology UsedBackendNode.js, Express.jsDatabaseMongoDB with Mongoose ODMAuthJSON Web Tokens (JWT)SecurityBcrypt.js (Hashing)DeploymentRailwayServicesNodemailer (SMTP)

Backend: Node.js and Express.js.

Database: MongoDB with Mongoose ODM.

Authentication: JSON Web Tokens (JWT).

Security: Bcrypt.js for password hashing.

Deployment: Railway / Render.

Additional Tools: Nodemailer, CORS, Dotenv.

Installation and Setup
Clone the repository:

git clone <your-github-repo-link>
cd finalproject

Install dependencies:
npm install

Configure Environment Variables: Create a .env file in the root directory and include the following parameters:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

Database Seeding (Optional):
npm run seed

Start the application:
npm start

API Documentation
Authentication Endpoints (Public)

POST /api/auth/signup: Registers a new user account.

POST /api/auth/signin: Authenticates credentials and returns a JWT.

User Management Endpoints (Private)

GET /api/users/profile: Retrieves the authenticated user's profile information.

PUT /api/users/profile: Updates the authenticated user's profile data.

Classes and Bookings Endpoints (Private)

GET /api/classes: Lists all available fitness classes.

POST /api/bookings: Creates a new class booking for the user.

GET /api/bookings/user/:userId: Retrieves all bookings associated with a specific user ID.

Application Screenshots
Please refer to the screenshots folder in the repository for visual documentation of the following features:

Home Page: Overview of the fitness studio interface.
<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/031fa5d9-2157-4a3c-8252-7f6a8ab14ab9" />

Registration: User registration and sign-up forms.
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/837cfb44-493e-4cc5-b963-bf3b07899e1e" />

User Profile: Personal dashboard and profile management.
<img width="1919" height="936" alt="image" src="https://github.com/user-attachments/assets/325e0f5e-a309-42e3-80b1-c63708fc410f" />

Schedule: Interface for viewing and booking available classes.
<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/71986048-4499-4bc0-996b-9969ecb9fb93" />

Author: Amina Sergazina, Aldiyar Tagishev

Academic Group: SE-2402
