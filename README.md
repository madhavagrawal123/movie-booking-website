<img width="1288" height="603" alt="image" src="https://github.com/user-attachments/assets/b325ca00-6b9f-4e60-92d1-7022b320febd" /># 🎬 Showly

A full-stack movie ticket booking platform built to handle the concurrency and payment problems that arise in real booking systems—not just CRUD operations. Showly prevents double booking using atomic MongoDB transactions and time-limited seat holds, keeps seat availability synchronized across users in real time via Socket.IO, and only confirms bookings after server-side Razorpay payment verification.
**Live Demo:** https://movie-booking-website-azure.vercel.app/

---

## Table of Contents

- [Screenshots](#-screenshots)
- [Features](#-features)
- [Architecture](#-architecture)
- [Core Booking Flow](#-core-booking-flow)
- [Key Design Decisions](#-key-design-decisions)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Engineering Challenges Solved](#-engineering-challenges-solved)
- [Known Limitations & Future Work](#-known-limitations--future-work)
- [Author](#-author)

---

## 📸 Screenshots

### 🏠 Home Page
<img width="1302" height="610" alt="image" src="https://github.com/user-attachments/assets/e5e27237-2038-474c-9cc7-cd65d62c0a3b" />


### 🎬 Movie Details
<img width="1328" height="619" alt="image" src="https://github.com/user-attachments/assets/621c0668-8282-4048-a531-28b721c3b3b4" />


### 💺 Seat Selection
<img width="1285" height="611" alt="image" src="https://github.com/user-attachments/assets/1a6d85a6-96de-4e99-b7db-e7677e23b0ff" />


### 💳 Payment
<img width="1303" height="587" alt="image" src="https://github.com/user-attachments/assets/9937ec59-fb4b-407f-ab1d-eacdb88a8c1f" />


### 📖 My Bookings
<img width="1288" height="626" alt="image" src="https://github.com/user-attachments/assets/1ccf69f9-c941-45bf-bb76-90ceb267ff61" />


### 📊 Admin Dashboard
<img width="1347" height="626" alt="image" src="https://github.com/user-attachments/assets/94605105-ee4b-4d77-bd4b-6dec0ccf3301" />


## ✨ Features

**Authentication**
- JWT-based auth with role-based authorization (user / theatre admin)
- Passwords hashed with bcrypt
- Persistent login via HTTP-only cookies
- Protected routes on both client and server

**Movie Discovery**
- Live movie catalog via the TMDB API
- Search by city, browse by theatre and showtime

**Booking System**
- Real-time seat availability per show
- Time-limited seat holds that prevent double booking
- Automatic release of expired holds
- Booking history per user

**Real-Time Updates**
- Socket.IO rooms scoped per show, broadcasting seat status changes instantly to every connected client viewing that show

**Payments**
- Razorpay Checkout integration
- Server-side signature verification before a booking is ever persisted

**Admin**
- Theatre, screen, show, and seat configuration management

---

## 🏗 Architecture

```
                        ┌───────────────────────────┐
                        │       React Frontend       │
                        │  (Axios + Socket.IO client)│
                        └──────────────┬──────────────┘
                                       │
                          REST API  +  WebSocket (Socket.IO)
                                       │
                        ┌──────────────▼──────────────┐
                        │       Express Backend        │
                        │  (Auth, Booking, Socket hub) │
                        └───┬──────────┬───────────┬───┘
                            │          │           │
                     ┌──────▼───┐ ┌────▼─────┐ ┌───▼────────┐
                     │ JWT Auth │ │ Razorpay │ │  TMDB API  │
                     │  + bcrypt│ │   API    │ │ (movie data)│
                     └──────────┘ └──────────┘ └────────────┘
                            │
                        ┌───▼────┐
                        │MongoDB │
                        │ Atlas  │
                        └────────┘
```

---

## 🔄 Core Booking Flow

```
User selects seats
        │
        ▼
Backend validates seat status (transaction begins)
        │
        ▼
Seats matching {status: "available"} → marked HELD
with heldUntil = now + N minutes            ──────┐
        │                                          │
        │ (transaction fails / retried if          ▼
        │  another request already holds     Socket.IO broadcasts
        │  or booked the seat)               updated seat map to
        ▼                                     all clients in that
Hold confirmed to user                        show's room
        │
        ▼
User proceeds to Razorpay Checkout
        │
        ▼
Razorpay order created (backend) → Checkout completed (frontend)
        │
        ▼
Backend verifies payment signature (HMAC SHA256, server-side only)
        │
        ├── Invalid / failed ──► Held seats released, Socket.IO notifies all users
        │
        ▼ Valid
Seats updated to BOOKED, booking record persisted
        │
        ▼
Confirmation returned to user, Socket.IO broadcasts final seat state

---

Expired holds are not actively pushed on a timer. Instead, whenever seat
availability is requested for a show, the backend lazily checks each held
seat's `heldUntil` timestamp and releases any that have expired before
returning the current layout. This avoids running a background job/cron
purely to expire holds.
```

---

## 🧠 Key Design Decisions

- **Seat holds via `heldUntil` timestamp, checked lazily on read** — rather than a scheduled job or Redis TTL, expiry is resolved on-demand whenever seat availability is fetched. Simpler to reason about and deploy for a single-instance app; the tradeoff is that a seat won't visibly "unlock" for other users until someone next requests that show's layout (in practice, near-instant given normal traffic and the periodic re-fetch on the seat-selection screen).

- **Atomicity via MongoDB transactions + conditional updates** — holding or booking a seat is a conditional write (`status: "available"`) inside a transaction. If a concurrent request has already changed that seat's status, the transaction fails and the request is rejected rather than silently overwriting another user's hold. This is what actually prevents double booking — Socket.IO only handles *informing* other clients, it isn't relied on for correctness.

- **Socket.IO rooms scoped per show** rather than a global broadcast — reduces irrelevant traffic to clients who aren't viewing that show and avoids unnecessary re-renders on the frontend.

- **Payment confirmation is server-authoritative** — the booking is only written to the database after the backend independently verifies the Razorpay signature. The frontend's checkout "success" callback is never trusted on its own, which closes off a common way client-only integrations get exploited to fake a paid booking.

---

## ⚙ Tech Stack

**Frontend:** React, React Router, Axios, Tailwind CSS, Socket.IO Client
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Socket.IO
**External APIs:** TMDB API, Razorpay API
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## 📂 Project Structure

```
Showly/
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI (seat map, nav, modals)
│   │   ├── pages/          # Route-level views (Home, MovieDetails, Booking, Admin)
│   │   ├── services/       # Axios API clients, socket connection setup
│   │   └── assets/
│
├── server/
│   ├── controllers/        # Route handlers (auth, bookings, shows, admin)
│   ├── models/              # Mongoose schemas (User, Booking, Show, Seat)
│   ├── routes/
│   ├── middleware/          # JWT auth guard, role checks
│   ├── socket/               # Socket.IO room/event handlers
│   └── utils/                 # Razorpay signature verification, helpers
│
└── README.md
```

---

## 🚀 Installation & Setup

```bash
# Clone
git clone [https://github.com/yourusername/showly.git](https://github.com/madhavagrawal123/movie-booking-website.git)

# Backend
cd showly/server
npm install
npm run dev

# Frontend (in a separate terminal)
cd showly/client
npm install
npm run dev
```

**Prerequisites:**
- Node.js 18+
- A MongoDB instance (local or MongoDB Atlas connection string)
- A Razorpay account (test mode keys are sufficient for local development)
- A TMDB API key

---

## 🔑 Environment Variables

**Server (`server/.env`)**
```env
PORT=
MONGO_URI=
JWT_SECRET=
TMDB_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
CLIENT_URL=
```

**Client (`client/.env`)**
```env
VITE_API_URL=
VITE_RAZORPAY_KEY=
```

---

## 🧠 Engineering Challenges Solved

- Prevented double booking using MongoDB transactions and conditional updates (`status: "available"`), ensuring only one concurrent request can successfully hold or book a seat.
- Built real-time seat synchronization scoped to per-show Socket.IO rooms to avoid unnecessary broadcast traffic.
- Implemented lazy expiry of seat holds based on a stored `heldUntil` timestamp, avoiding a dedicated background job.
- Verified Razorpay payment signatures server-side (HMAC SHA256) so bookings can never be confirmed from a spoofed client-side success event.
- Designed role-based authentication separating user and theatre-admin permissions across protected routes.

---

## 📈 Known Limitations & Future Work

- **No automated tests yet** — unit tests for booking/transaction logic and integration tests for the payment verification flow are the next priority.
- Planned: email ticket confirmation, QR code generation, booking cancellation/refunds, seat pricing by category.

---

## 👨‍💻 Author

**Madhav Agrawal**
LinkedIn: https://www.linkedin.com/in/madhav-agrawal-88a0902a3/

Email: madhavagrawal2023@gmail.com

---

⭐ If you found this project useful, consider giving it a star!
