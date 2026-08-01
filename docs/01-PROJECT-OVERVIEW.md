# Project Overview — Gods Creatures Pet Groomers

## Business Context
**Gods Creatures Pet Groomers** is a luxury pet grooming salon dedicated to providing premium care for pets.

- **Location:** Malki, Nongshiliang, Shillong - 793001
- **Business Hours:** Mon–Sat 8:00 AM – 4:00 PM, Sunday Closed
- **Phone:** +91 8798897732
- **UPI:** 9089196235@axisbank
- **Tagline:** *"where every tail wags brighter"*
- **Client Admin:** vivecablah@gmail.com
- **Developer Admin:** cloudlyconfusing@gmail.com
- **Live URL:** [https://godscreaturespet.in](https://godscreaturespet.in)
- **GitHub Repository:** [jeremygideonbareh/Gods-creatures-pet-groomers](https://github.com/jeremygideonbareh/Gods-creatures-pet-groomers)

## Tech Stack
The application is built on a modern, robust stack, utilizing the following technologies:

| Layer | Technology | Version |
|---|---|---|
| **Framework** | React | 19 |
| **Language** | TypeScript | 6 |
| **Build Tool** | Vite | 8 |
| **Styling** | Tailwind CSS | 4 (via @tailwindcss/vite) |
| **Animations** | motion (Framer Motion), animejs | v4 |
| **Icons** | lucide-react | - |
| **Auth** | Nhost (@nhost/nhost-js) | v4 |
| **GraphQL** | Apollo Client, Hasura | v4 |
| **Payment** | Cashfree Payments SDK, Razorpay (legacy) | - |
| **Email** | Resend API | - |
| **Hosting** | Cloudflare Pages | - |
| **Backend** | Nhost (Auth + Hasura GraphQL + Serverless Functions + PostgreSQL) | - |
| **CI/CD** | GitHub Actions → Cloudflare Pages | - |
| **Testing** | Vitest | - |

## What the Website Does
The website is a fully-featured, single-page scrollable React application designed to offer a seamless experience for both clients and administrators. It includes several key sections: Hero, Why Choose Us, Services, Reviews, Book Now, along with additional features like Gallery, Team, Process, FAQ, Blog, and Store.

### Key Features:
- **Content Management System (CMS):** Full content editing capabilities via a secure admin panel.
- **User Authentication:** Comprehensive user management including sign in, sign up, and password reset functionalities.
- **Pet Profile Management:** Users can create and manage profiles for their pets.
- **Online Appointment Booking:** Integrated with payment gateways (Cashfree/Razorpay) for a smooth checkout process.
- **Dynamic Pricing:** Calculates costs based on the pet's size and weight.
- **Double-Booking Prevention:** Ensures appointment slots are accurately managed and never double-booked.
- **Automated Email Receipts:** Sends instant booking confirmations and receipts via email.
- **Admin Dashboard:** A dedicated dashboard for administrators to oversee and manage all bookings.

## Key URLs & Accounts
- **Production Environment:** [https://godscreaturespet.in](https://godscreaturespet.in)
- **Nhost Dashboard (Backend):** Hasura engine at `ukuqslqvwovrukooziwf.hasura.ap-south-1.nhost.run`
- **Cloudflare Pages Project:** `gods-creatures-pet-groomers`
- **Developer Email:** `cloudlyconfusing@gmail.com` (Hardcoded as permanent admin for system access)
- **Client Email:** `vivecablah@gmail.com` (Configured via `VITE_ADMIN_EMAIL` environment variable)
