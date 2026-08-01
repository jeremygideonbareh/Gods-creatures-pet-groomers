# Environment Variables Reference

This document outlines all the environment variables required for the Gods Creatures Pet Groomers application, covering the frontend, Nhost Functions, and third-party integrations like Razorpay and Resend.

## Overview

Environment variables are managed in three primary contexts:

1.  **Frontend (.env)**: Local development variables for the React application. These are prefixed with `VITE_`.
2.  **Nhost Dashboard**: Variables for Nhost Functions (backend) and Hasura.
3.  **Cloudflare Pages**: Variables for the production frontend deployment.
4.  **Razorpay Dashboard**: Configuration for webhooks and payment integration.

## Env Var Reference Table

| Variable | Where Set | Used In | Purpose | Required | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `VITE_RAZORPAY_KEY_ID` | .env (local), Cloudflare | Frontend | Razorpay public key ID for Checkout | Yes | `rzp_test_TDiHngRat1qQcr` |
| `RAZORPAY_KEY_ID` | Nhost Dashboard | Nhost Functions | Razorpay key ID for server-side API | Yes | `rzp_test_TDiHngRat1qQcr` |
| `RAZORPAY_KEY_SECRET` | Nhost Dashboard | Nhost Functions | Razorpay key secret for API authentication | Yes | `ulrphbWteg82aTi4t5K5tEYs` |
| `RAZORPAY_WEBHOOK_SECRET` | Nhost Dashboard, Razorpay | Nhost Functions | Secret used to verify Razorpay webhook signatures | Yes | `(set in Razorpay Dashboard)` |
| `RESEND_API_KEY` | Nhost Dashboard | Nhost Functions | API key for Resend email service | Yes | `re_123456789` |
| `RESEND_FROM_EMAIL` | Nhost Dashboard | Nhost Functions | Verified sender email address in Resend | Yes | `onboarding@resend.dev` |
| `NHOST_GRAPHQL_URL` | Nhost Dashboard (auto) | Nhost Functions | Hasura GraphQL endpoint for internal mutations | Yes | `https://{subdomain}.hasura.{region}.nhost.run/v1/graphql` |
| `HASURA_GRAPHQL_ADMIN_SECRET` | Nhost Dashboard | Nhost Functions | Admin secret for authorized Hasura operations | Yes | `admin12345` |
| `VITE_NHOST_SUBDOMAIN` | .env (local), Cloudflare | Frontend | Nhost project subdomain | Yes | `ukuqslqvwovrukooziwf` |
| `VITE_NHOST_REGION` | .env (local), Cloudflare | Frontend | Nhost project region | Yes | `ap-south-1` |
| `VITE_ADMIN_EMAIL` | .env (local), Cloudflare | Frontend | Comma-separated list of admin emails | Yes | `admin@godscreatures.com,cloudlyconfusing@gmail.com` |
| `CASHFREE_APP_ID` | Nhost Dashboard | Nhost Functions | Cashfree App ID for payment API authentication | Yes (for Cashfree) | `CF12345678ABCD` |
| `CASHFREE_SECRET_KEY` | Nhost Dashboard | Nhost Functions | Cashfree Secret Key for payment API authentication | Yes (for Cashfree) | `sk_test_xxxxxxxxxxxxxxxxxxxx` |
| `CASHFREE_API_URL` | Nhost Dashboard | Nhost Functions | Cashfree PG base URL — `https://sandbox.cashfree.com/pg` (default) or `https://api.cashfree.com/pg` for live | Yes (for Cashfree) | `https://sandbox.cashfree.com/pg` |
| `VITE_CASHFREE_MODE` | .env (local), Cloudflare | Frontend | Cashfree SDK mode — `sandbox` (default) or `production` | Yes (for Cashfree) | `sandbox` |

## Setup Instructions

### 1. Frontend (.env)
Create a `.env` file in the `react-app/` directory for local development.
```bash
VITE_NHOST_SUBDOMAIN=your-subdomain
VITE_NHOST_REGION=your-region
VITE_ADMIN_EMAIL=admin@example.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
```

### 2. Nhost Dashboard
Navigate to **Settings → Environment Variables** in your Nhost project and add the following:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `HASURA_GRAPHQL_ADMIN_SECRET`

### 3. Cloudflare Pages
In the Cloudflare Dashboard, go to **Workers & Pages → [Your Project] → Settings → Variables** and add the `VITE_` variables for the production environment.

### 4. Razorpay Dashboard
- **API Keys**: Generate Test/Live keys in **Settings → API Keys**.
- **Webhooks**: Add a webhook in **Settings → Webhooks**.
  - **Webhook URL**: `https://{nhost-function-url}/v1/razorpay-webhook`
  - **Secret**: Set a strong secret and copy it to `RAZORPAY_WEBHOOK_SECRET` in Nhost.
  - **Active Events**: `payment.captured`, `order.paid`.

## Verifying Configuration

- **Frontend**: Check the browser console for any "Missing environment variable" warnings.
- **Nhost Functions**: Use `console.log` (visible in Nhost Logs) to verify variables are loaded (never log secrets in production).
- **Razorpay**: Use the "Test Webhook" feature in the Razorpay Dashboard to ensure the secret matches.

## Security Notes

- **Never commit `.env` files**: The `.env` file is included in `.gitignore` to prevent leaking secrets.
- **Use `.env.example`**: Always update `.env.example` when adding new variables so other developers know what to set.
- **Rotate Secrets**: If a secret (like `RAZORPAY_KEY_SECRET`) is accidentally exposed, rotate it immediately in the respective dashboard.
