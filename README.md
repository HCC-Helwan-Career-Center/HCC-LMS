# HCC Learning Management System (LMS)

![HCC LMS Banner](https://hcc-lms.vercel.app/images/hcc_logo.webp)

A modern, high-performance Learning Management System built for **Helwan Career Center (HCC)**. This platform streamlines student training, track management, and mentor-student interactions with a focus on premium user experience and real-time performance.

🚀 **Live Demo:** [hcc-lms.vercel.app](https://hcc-lms.vercel.app/)

## ✨ Key Features

- **Multi-Role Dashboards:** Tailored interfaces for Students, Mentors, and Administrators.
- **Track Management:** Structured learning paths for AI, Cybersecurity, Software Engineering, and more.
- **Resource Hub:** Centralized storage for learning materials (PDFs, Videos, Links).
- **Session Scheduling:** Real-time tracking of upcoming online and in-person sessions.
- **Announcement System:** Global and track-specific broadcast systems.
- **Progress Tracking:** Visualized student progress and milestone achievements.
- **Secure Authentication:** Robust auth powered by NextAuth.js with role-based access control.

## 🛠️ Technology Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack
- **Language:** JavaScript (ESM)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://next-auth.js.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Vanilla CSS Modules with a premium design system

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- A PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/HCC-LMS.git
   cd hcc-lms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   AUTH_SECRET="your_nextauth_secret"
   ```

4. **Database Initialization:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (Landing, Dashboard, Layout).
- `prisma/`: Database schema and seed scripts.
- `public/`: Static assets and images.

## 👥 Contributors

A big thank you to the development team who made this project possible:

- **Youssef Halawa**
- **Abdelrahman Ehab**
- **Mohamed Hassan**
- **Abdelrahman Mahmoud**
- **Hussein Elhaddad**

## 📝 License

This project is developed for the **Helwan Career Center (HCC)**. All rights reserved.

---
Built with ❤️ by the HCC Development Team.

