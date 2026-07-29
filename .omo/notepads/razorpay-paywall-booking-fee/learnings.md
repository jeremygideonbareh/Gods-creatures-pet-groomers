# Razorpay Paywall / Booking Fee — Learnings

## verify-razorpay-payment.ts — 2026-07-15

- Created react-app/functions/verify-razorpay-payment.ts — server-side Razorpay HMAC SHA256 signature verification
- Uses import { createHmac, timingSafeEqual } from "crypto" (Node.js built-in, no new deps)
- Payload signed: razorpay_order_id + "|" + razorpay_payment_id => HMAC SHA256 with RAZORPAY_KEY_SECRET
- Constant-time comparison via timingSafeEqual to prevent timing attacks
- Follows same pattern as create-razorpay-order.ts:
  - Export default async function handler(req, res)
  - 405 for non-POST
  - 500 if env var missing
  - 400 with { verified: false, error: "Invalid signature" } on mismatch
  - 200 with { verified: true, order_id, payment_id } on success
  - try/catch with console.error logging
- Input validation: all three fields (razorpay_order_id, razorpay_payment_id, razorpay_signature) required
- Edge case: if expectedBuffer and receivedBuffer have different lengths, timingSafeEqual would throw — guarded by length check first

## 2026-07-15 - Idempotency and Payment Status Mutations

### Part A: functions/create-razorpay-order.ts
- Added optional receipt and notes to CreateOrderBody interface
- Changed receipt from hardcoded to body.receipt fallback pattern
- Added notes to the razorpay.orders.create() call
- Backward compatible - existing callers continue to work unchanged

### Part B: src/lib/graphql.ts
- Added UPDATE_BOOKING_PAYMENT_STATUS mutation after UPDATE_BOOKING_STATUS
- Added UPDATE_BOOKING_PAYMENT_DETAILS mutation
- No existing queries/mutations modified - additive only
- File grew from 107 to 127 lines
