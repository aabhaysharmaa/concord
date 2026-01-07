# Concord  – Build a Discord‑Inspired Community Platform

This repository contains the source code for **Concord**, a modern real‑time communication platform inspired by Discord.

The project is built as a full‑stack learning and portfolio project, focusing on real‑time systems, scalable architecture, and production‑grade features used in modern community platforms.

> **Note:** This project is actively under development. Some features may be incomplete or subject to change.

---

## What We’re Building

Concord Community is a community‑centric chat application that enables users to create servers, manage members, and communicate through text, voice, and video channels.

Core goals of the project:

* Real‑time communication at scale
* Clean and responsive user experience
* Secure authentication and role‑based access
* Production‑ready backend architecture

---

## Features

### Messaging

* Real‑time messaging using Socket.IO
* Edit and delete messages in real time for all users
* Send file attachments as messages using UploadThing
* Infinite message loading in batches of 10 using @tanstack/query
* WebSocket fallback with polling and alerts

### Voice and Video

* Text, audio, and video call channels
* One‑to‑one private conversations between members
* One‑to‑one video calls between members

### Community and Member Management

* Server creation and customization
* Role‑based member management (Guest, Moderator)
* Kick members from servers
* Unique invite link generation
* Fully functional invite system

### UI and UX

* Modern UI built with TailwindCSS and shadcn/ui
* Fully responsive design for desktop and mobile
* Light and dark mode support

### Authentication

* Authentication and user management using Clerk

### Backend and Database

* ORM using Prisma
* MySQL database powered by PlanetScale
* Scalable and production‑ready architecture

---

## Tech Stack

| Category       | Technologies                            |
| -------------- | --------------------------------------- |
| Frontend       | Next.js, React, TypeScript, TailwindCSS |
| UI             | shadcn/ui                               |
| Real‑Time      | Socket.IO                               |
| State & Data   | @tanstack/query                         |
| Backend        | Node.js                                 |
| ORM            | Prisma                                  |
| Database       | MySQL (PlanetScale)                     |
| Authentication | Clerk                                   |
| File Uploads   | UploadThing                             |

---

## Getting Started

### Prerequisites

* Node.js (version to be added)
* npm / pnpm / yarn
* Accounts required:

  * Clerk (Authentication)
  * PlanetScale (Database)
  * UploadThing (File uploads)

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/concord-community.git
cd concord-community
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Socket
NEXT_PUBLIC_SOCKET_URL=
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                 # Application routes
├── components/          # Shared UI components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
├── server/              # Backend logic
├── styles/              # Global styles
└── types/               # TypeScript types

prisma/
├── schema.prisma        # Database schema
```

---

## Inspiration

This project is inspired by Discord and other modern community platforms. The goal is to understand how real‑time communication systems are designed and built at scale.

---

## Roadmap

Planned improvements and features:

* Advanced moderation tools
* Message reactions and threads
* Server analytics
* Performance optimizations
* Mobile app support

---

## License

This project is licensed under the MIT License.
