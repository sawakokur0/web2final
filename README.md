# Celery Body - Fitness Studio Management System

This is a full-stack web application for the **Celery Body** fitness studio. The system allows users to register, book fitness classes, and manage their profiles. It also includes administrative features for class management.

**Live Demo:** [https://web2final-production-2f92.up.railway.app](https://web2final-production-2f92.up.railway.app)

## Features

- **User Authentication:** Secure Sign Up and Sign In using JWT and Bcrypt encryption.
- **Profile Management:** Users can view and update their personal information.
- **Class Booking:** Browse available fitness classes and book sessions.
- **RBAC (Role-Based Access Control):** Different access levels for 'user' and 'admin' roles.
- **Email Notifications:** Automated welcome emails sent via Nodemailer.
- **Database:** Persistent storage using MongoDB Atlas.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** Bcrypt.js for password hashing
- **Deployment:** Railway / Render
- **Other Tools:** Nodemailer, CORS, Dotenv

## Setup Instructions

1. **Clone the repository:**
   git clone <your-github-repo-link>
   cd finalproject
