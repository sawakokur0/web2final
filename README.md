# Celery Body — Fitness Studio Management System

The **Celery Body** project is a comprehensive full-stack management system designed for modern fitness studios. It streamlines user registration, class scheduling, and booking management through a secure and scalable Node.js backend.


## Overview

Celery Body provides a seamless interface for fitness enthusiasts to manage their training journey. Built with the **MERN** (MongoDB, Express, Node) stack logic, the application ensures data integrity, secure authentication, and real-time email notifications for a premium user experience.


## Key Features

 **Secure Authentication**: Advanced Sign Up/Sign In flow with Bcrypt password hashing and JWT-based session management.
 
 **Profile Control**: Personal dashboard for users to monitor and update their profile information.
 
 **Dynamic Booking**: Integrated system to browse fitness classes and manage personal training schedules.
 
 **RBAC (Role-Based Access Control)**: Granular permissions for `user` and `admin` roles to protect sensitive studio data.
 
 **Automated Notifications**: Professional email triggers via Nodemailer for user onboarding and confirmations.
 
 **Cloud Infrastructure**: Fully deployed on Railway with a persistent MongoDB Atlas cluster.

## Technical Stack

| Layer | Technology |
| --- | --- |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB & Mongoose ODM |
| **Security** | JSON Web Tokens & Bcrypt.js |
| **Mail Service** | Nodemailer (SMTP) |
| **Deployment** | Railway |

## API Reference

### Auth Service (Public)

 `POST /api/auth/signup` — Create a new user account.
 `POST /api/auth/signin` — Authenticate and receive access token.

### User Service (Private)

 `GET /api/users/profile` — Fetch current user's profile.
 `PUT /api/users/profile` — Update account details.

### Studio Service (Private)

 `GET /api/classes` — Retrieve full list of available sessions.
 `POST /api/bookings` — Register for a specific class.
 `GET /api/bookings/user/:userId` — View personal booking history.

## Getting Started

### Prerequisites

 Node.js (v16.0.0 or higher)
 
 MongoDB Atlas account

### Installation

1. **Clone the repository**
```bash
git clone <your-github-repo-link>
cd finalproject

```


2. **Install dependencies**
```bash
npm install

```


3. **Configure Environment**
Create a `.env` file in the root directory:
```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

```


4. **Run Server**
```bash
node server.js

```


## Documentation & Visuals

### Screenshots

 **Home Page**: Overview of the fitness studio interface.
 <img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/7c81e47f-2b2d-4759-8ded-a93b7caa8f05" />

 **Registration**: Secure multi-step onboarding form.
 <img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/280086e4-c7e0-4138-8038-69a5918419ee" />

 **Schedule**: Interactive calendar for class selection.
 <img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/83eb3bee-447c-44b2-945c-f8885d904304" />

### Author

**Amina Sergazina, Aldiyar Tagishev** 
### Academic Group
**SE-2402**
