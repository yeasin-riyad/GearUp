# 🚀 GearUp - Outdoor Gear Rental Platform API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Render-Deployed-success?style=for-the-badge" />
</p>

<p align="center">
A secure, scalable, and production-ready REST API for an outdoor gear rental marketplace where customers can rent equipment, providers manage inventory, and administrators oversee the entire platform.
</p>

---

# 🌐 Live Demo

### 🚀 Backend API

https://gearup-1-9p45.onrender.com

### 📘 API Documentation (Swagger)

https://gearup-1-9p45.onrender.com/api/docs

---

# ✨ Features

## 👤 Authentication & Authorization

* JWT Authentication
* HTTP-only Cookie Authentication
* Role Based Access Control (RBAC)
* Customer, Provider & Admin Roles
* Secure Password Hashing (bcrypt)
* Protected Routes

---

## 🏕️ Gear Management

* Create Gear (Provider)
* Update Gear
* Delete Gear
* Get All Gears
* Get Single Gear
* Category Support
* Stock Management
* Availability Management

---

## 📂 Category Management

* Create Category
* Update Category
* Delete Category
* Get All Categories
* Get Category Details

---

## 📦 Rental System

* Create Rental Order
* Multi-item Rental
* Rental Validation
* Rental Status Management
* Customer Rental History
* Provider Rental History

### Rental Lifecycle

```
PLACED
   │
   ▼
PAID
   │
   ▼
CONFIRMED
   │
   ▼
PICKED_UP
   │
   ▼
RETURNED
```

or

```
PLACED
   │
   ▼
CANCELLED
```

---

## 💳 Stripe Payment Integration

* Stripe Checkout Session
* Secure Payment Processing
* Payment Status Tracking
* Stripe Webhook Integration
* Automatic Rental Status Update

---

## ⭐ Review System

* Create Review
* Update Review
* Delete Review
* Get All Reviews
* Get Reviews by Gear
* Get My Reviews
* Rating Statistics

---

## 📊 Provider Dashboard

* Total Gears
* Available Gears
* Unavailable Gears
* Rental Statistics
* Revenue Statistics
* Rental History

---

## 🛠️ Admin Dashboard

* User Statistics
* Provider Statistics
* Customer Statistics
* Category Statistics
* Gear Statistics
* Rental Statistics
* Payment Statistics
* Revenue Statistics

---

## 📖 API Documentation

* Complete OpenAPI 3.0 Specification
* Interactive Swagger UI
* Request Examples
* Response Examples
* Error Responses
* Authentication Documentation

---

# 🛠️ Tech Stack

| Technology  | Description               |
| ----------- | ------------------------- |
| Node.js     | Runtime                   |
| Express.js  | Web Framework             |
| TypeScript  | Programming Language      |
| PostgreSQL  | Database                  |
| Prisma ORM  | Database ORM              |
| JWT         | Authentication            |
| bcrypt      | Password Hashing          |
| Stripe      | Payment Gateway           |
| OpenAPI 3.0 | API Documentation         |
| Swagger UI  | Interactive Documentation |
| Render      | Deployment                |

---

# 🔐 Authentication

The API uses:

* JWT
* HTTP-only Cookies
* Role Based Authorization

Protected endpoints require authentication.

---

# 👨‍💼 Admin Credentials

```json
{
  "email": "admin@example.com",
  "password": "Password@123"
}
```

---

# 📁 Project Structure

```
src
│
├── app
│   ├── builder
│   ├── config
│   ├── errors
│   ├── helpers
│   ├── interfaces
│   ├── lib
│   ├── middlewares
│   ├── modules
│   │
│   ├── auth
│   ├── user
│   ├── category
│   ├── gear
│   ├── rental
│   ├── payment
│   ├── review
│   ├── provider
│   └── admin
│
├── prisma
│
├── openapi.yaml
│
└── server.ts
```

---

# 📚 Main API Modules

* Authentication
* Users
* Categories
* Gears
* Rentals
* Payments
* Reviews
* Providers
* Admin Dashboard

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yeasin-riyad/GearUp.git
```

Install dependencies

```bash
npm install
```

Create environment variables

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

COOKIE_SECRET=

CLIENT_URL=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Seed Database

```bash
npm run seed
```

Run Development Server

```bash
npm run dev
```

---

# 📖 API Documentation

After running the server locally

```
http://localhost:5000/api/docs
```

Production

```
https://gearup-1-9p45.onrender.com/api/docs
```

---

# 🌍 Base URL

Production

```
https://gearup-1-9p45.onrender.com/api
```

Local

```
http://localhost:5000/api
```

---

# 📌 Main Endpoints

## Authentication

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
GET    /auth/profile
```

## Categories

```
GET
GET/{id}
POST
PATCH/{id}
DELETE/{id}
```

## Gears

```
GET
GET/{id}
POST
PATCH/{id}
DELETE/{id}
```

## Rentals

```
POST
GET /my-rentals
GET /provider
PATCH /{id}/confirm
PATCH /{id}/pick-up
PATCH /{id}/return
PATCH /{id}/cancel
```

## Payments

```
GET /checkout-session/{rentalId}
```

## Reviews

```
GET
GET /me
GET /gear/{gearId}
POST
PATCH/{id}
DELETE/{id}
```

---

# 🔒 Security Features

* JWT Authentication
* HTTP-only Cookies
* Password Hashing
* Role Based Authorization
* Input Validation
* Secure Error Handling
* Stripe Webhook Signature Verification
* Centralized Error Handling

---

# 📈 Status Workflow

### Rental Status

```
PLACED
      │
      ▼
PAID
      │
      ▼
CONFIRMED
      │
      ▼
PICKED_UP
      │
      ▼
RETURNED
```

### Payment Status

```
PENDING
      │
      ▼
COMPLETED

or

FAILED
```

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you'd like to improve the project, feel free to fork the repository and submit a pull request.

---


<p align="center">
Made with ❤️ using Node.js, Express, TypeScript, PostgreSQL, Prisma & Stripe.
</p>
