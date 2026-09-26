# College Management System

Express.js + EJS + MySQL + Sequelize implementation generated from the SRS.

## Features

- JWT login with cookie or bearer token support
- bcrypt password hashing
- Role-based access control for Super Admin, Principal, HOD, Staff and Student
- Sequelize models for the core SRS tables
- CRUD routes for colleges, departments, staff, students, attendance, exams, leaves, fees, study materials and assignments
- EJS login and role dashboard screens
- File upload validation for study materials and assignments

## Setup

1. Create a MySQL database named `college_management_system`.
2. Copy `.env.example` to `.env` and update database credentials.
3. Install packages:

```bash
npm install
```

4. Create tables and seed roles plus the super admin:

```bash
npm run db:sync
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

Default login comes from `.env`:

- Email: `admin@cms.local`
- Password: `Admin@12345`

## Main Folders

- `src/models` - Sequelize schema and associations
- `src/controllers` - request handlers
- `src/routes` - module routes
- `src/middlewares` - auth, validation and errors
- `src/views` - EJS pages
- `src/uploads` - uploaded material and assignment files
