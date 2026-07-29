# Razorpay Paywall — QA Checklist

## Prerequisites
- [ ] Local `.env` has `VITE_RAZORPAY_KEY_ID=rzp_test_TDiHngRat1qQcr`
- [ ] Nhost Dashboard has `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` set
- [ ] Razorpay Dashboard webhook configured with `RAZORPAY_WEBHOOK_SECRET`
- [ ] Dev server running: `npm run dev`

---

## Test 1: Happy Path — Successful Booking with Payment

1. [ ] Open website → click "Book Appointment"
2. [ ] Booking modal opens → click "Proceed"
3. [ ] Fill form: name, email, phone, select pet size, select service, select date, add notes
4. [ ] Click "Pay ₹500 Advance via Razorpay"
5. [ ] Razorpay checkout opens with ₹500 amount
6. [ ] **Use test card:** `4111 1111 1111 1111` | Any future expiry | Any CVV
7. [ ] Complete payment → Razorpay returns success
8. [ ] Verify endpoint called → signature validated server-side ✅
9. [ ] Booking created in Hasura with `status: "pending_verification"`
10. [ ] Success message shows with "⏳ Payment verification in progress" badge
11. [ ] Email receipt sent to customer

---

## Test 2: Happy Path — Webhook Delivery

1. [ ] After Test 1 succeeds, verify in Razorpay Dashboard → Webhooks → Logs
2. [ ] `payment.captured` event delivered to `https://{nhost-functions}/v1/razorpay-webhook`
3. [ ] Webhook signature verified successfully
4. [ ] Booking status updated from `pending_verification` → `confirmed`
5. [ ] Admin Dashboard shows `🟢 Confirmed` badge for this booking

---

## Test 3: Payment Failure — Card Declined

1. [ ] Open booking modal → fill form → click Pay
2. [ ] **Use test card:** `4000 0000 0000 0002` (declined)
3. [ ] Razorpay shows payment failed error
4. [ ] Modal shows error message (not success)
5. [ ] No booking created in Hasura

---

## Test 4: Payment Failure — Insufficient Funds

1. [ ] Open booking modal → fill form → click Pay
2. [ ] **Use test card:** `4000 0000 0000 0069` (insufficient funds)
3. [ ] Payment fails → error shown
4. [ ] No booking created

---

## Test 5: Signature Verification Failure

1. [ ] If the verify endpoint returns `{ verified: false }`:
2. [ ] Modal shows "Payment verification failed. Please contact support."
3. [ ] No booking created
4. [ ] Money is NOT deducted from customer (Razorpay test mode)

---

## Test 6: Admin Dashboard — Payment Status Display

1. [ ] Login as admin → navigate to `/admin`
2. [ ] Verify `pending_verification` bookings show yellow "Pending" badge
3. [ ] Verify `confirmed` bookings show green "Confirmed" badge
4. [ ] Verify `payment_failed` bookings show red "Payment Failed" badge
5. [ ] Verify `cancelled` bookings show gray "Cancelled" badge
6. [ ] Verify `transaction_id` column displayed for each booking
7. [ ] Verify "Confirm" button only shows for `pending_verification` bookings

---

## Test 7: Booking Conflict Prevention

1. [ ] Select same service + date as an existing `confirmed` booking
2. [ ] Conflict check should trigger (works independently of payment)

---

## Test 8: Razorpay Checkout — Cancelled Payment

1. [ ] Open booking modal → fill form → click Pay
2. [ ] Razorpay checkout opens → close/dismiss the checkout
3. [ ] Modal returns to form without creating booking
4. [ ] User can retry payment

---

## Test 9: Duplicate Payment Prevention

1. [ ] After successful payment+booking, attempt to submit same `transaction_id`
2. [ ] Hasura unique constraint on `transaction_id` should reject duplicate
3. [ ] Error shown: "This payment has already been used"

---

## Test 10: Razorpay Webhook — payment.failed

1. [ ] Trigger a `payment.failed` webhook event from Razorpay Dashboard
2. [ ] Verify booking status updates to `payment_failed`
3. [ ] Admin Dashboard shows red "Payment Failed" badge

---

## Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Happy path payment | ⬜ | |
| 2. Webhook delivery | ⬜ | Requires Razorpay Dashboard |
| 3. Card declined | ⬜ | |
| 4. Insufficient funds | ⬜ | |
| 5. Signature failure | ⬜ | |
| 6. Admin status display | ⬜ | |
| 7. Conflict prevention | ⬜ | |
| 8. Cancelled checkout | ⬜ | |
| 9. Duplicate payment | ⬜ | |
| 10. Webhook failed | ⬜ | Requires Razorpay Dashboard |
