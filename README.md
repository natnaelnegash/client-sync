<div align="center">
  <img src="https://i.imgur.com/K3wYV1d.png" alt="ClientSync Logo" width="120" />
  <h1>ClientSync ⚡</h1>
  <p><strong>The Ultimate Client Portal & Project Management OS for Freelancers and Agencies</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

<br />

**ClientSync** is a modern, lightweight, and incredibly fast client portal generator designed for independent creators, freelancers, and design agencies. It completely replaces messy email threads, scattered Slack channels, and fragmented Google Drive folders by giving each of your clients a dedicated, branded, password-protected portal to track their project's progress, review deliverables, pay invoices, and chat directly with you.

---

## ✨ Features

- **🚀 Instant Client Portals:** Spin up a dedicated client portal with a unique URL (`/p/[slug]`) in seconds.
- **🔐 Secure Access:** Magic links and 4-digit PIN codes ensure clients easily and securely access their workspace without needing to remember complex passwords.
- **📅 Visual Timeline:** Clients can see exactly what stage their project is at (Awaiting Signature, Collecting Assets, In Progress, In Review, Delivery, Completed).
- **📂 Deliverables & Feedback:** 
  - Upload previews and final deliverables.
  - Require payments *before* high-res final files can be downloaded (Payment-gated deliverables).
  - Built-in feedback loop (Clients can "Approve" or "Request Revisions" directly on the deliverable).
- **💳 Built-in Invoicing:** Create invoices (e.g., 50% deposit, milestone payments) and track paid/unpaid statuses seamlessly.
- **💬 Real-Time Chat:** Integrated Pusher-powered live chat right inside the portal so you can discuss feedback synchronously without leaving the app.
- **🪄 Smart Scope of Work:** Rich text editor with formatting and an "Enhance" AI-simulation tool to build structured scope-of-work documents instantly.
- **💅 Beautiful UI:** Built using Shadcn UI and Tailwind CSS, prioritizing an ultra-premium aesthetic with micro-animations, glassmorphism, and a clean grid-layout dashboard.

## 🛠️ Tech Stack

ClientSync is built using cutting-edge web technologies to ensure a scalable, fast, and delightful experience.

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js (Auth.js)
- **Real-Time Subscriptions:** Pusher
- **File Uploads:** UploadThing
- **Emails:** Nodemailer

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (e.g., Neon, Supabase, or local)
- Pusher Account
- UploadThing Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/client-sync.git
   cd client-sync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Database
   DATABASE_URL="postgres://user:pass@host:5432/db"

   # Authentication
   AUTH_SECRET="your-auth-secret-key"

   # File Uploads (UploadThing)
   UPLOADTHING_SECRET="sk_live_..."
   UPLOADTHING_APP_ID="..."

   # Real-Time (Pusher)
   NEXT_PUBLIC_PUSHER_APP_KEY="..."
   PUSHER_APP_ID="..."
   PUSHER_SECRET="..."
   NEXT_PUBLIC_PUSHER_CLUSTER="..."

   # Application
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database:**
   ```bash
   npm run db:push
   # or
   npx drizzle-kit push:pg
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📸 Screenshots


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/client-sync/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <p>Built with ❤️ by a developer who hates chasing clients for payments.</p>
</div>
