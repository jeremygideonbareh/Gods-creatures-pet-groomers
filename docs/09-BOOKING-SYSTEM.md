# Booking System — Gods Creatures Pet Groomers

## Overview
Complete appointment booking system with payment gateway integration, double-booking prevention, email receipts, and admin management.

## Booking Flow (User Perspective)
1. User clicks "Book Appointment" CTA on any section
2. If not authenticated → AuthModal opens first → after sign-in → BookingModal opens
3. If authenticated → BookingModal opens directly
4. BookingModal Step 1 (Info): Shows ₹500 booking fee disclaimer, "Proceed" button
5. BookingModal Step 2 (Form):
   a. Name and email auto-filled (readOnly) for authenticated users
   b. Phone number input
   c. Pet selection dropdown (from user's registered pets)
   d. Auto pet size detection from weight_kg:
      - Small: ≤10kg
      - Medium: 10-20kg
      - Large: 20-35kg
      - Extra Large: >35kg
   e. Manual size selector for guests/no-pet users
   f. Package picker (Basic Services + Complete Packages) with real-time price per size
   g. Add-on multi-select checkboxes with +₹ prices
   h. Live price breakdown widget (base + add-ons = total)
   i. Date picker (native type="date", min=today)
   j. Time slot selector (fetches booked slots via get-booked-slots function)
   k. Notes textarea
   l. Submit → creates booking + payment

## Payment Integration

### Cashfree (Primary)
1. Frontend calls create-booking-order Nhost function
2. Function validates JWT, checks slot availability, inserts pending_payment booking, creates Cashfree order
3. Frontend loads Cashfree JS SDK and opens payment modal
4. On payment success → frontend calls confirm-booking Nhost function
5. confirm-booking verifies payment with Cashfree server-to-server API
6. If verified → updates booking to 'confirmed', triggers email receipt
7. Cashfree webhook (cashfree-webhook.ts) provides async backup confirmation

### Manual UPI/GPay (Fallback)
1. Frontend calls create-manual-booking Nhost function
2. Function validates JWT, checks slot, inserts pending_verification booking
3. Admin manually verifies UPI payment and confirms via Admin Dashboard

### Razorpay (Legacy)
Older integration with create-razorpay-order, verify-razorpay-payment, razorpay-webhook

## Double-Booking Prevention
1. Frontend: useBookingConflict hook checks CHECK_BOOKING_CONFLICT query before submit
2. Backend: create-booking-order validates slot availability via Hasura query
3. Database: Partial unique index idx_bookings_service_date_active prevents same service+date when status is active

## Booking Statuses
| Status | Meaning | Set By |
|--------|---------|--------|
| pending_payment | Booking created, awaiting payment | create-booking-order |
| pending_verification | Manual booking awaiting admin review | create-manual-booking |
| confirmed | Payment verified, booking active | confirm-booking / webhook |
| payment_failed | Payment failed | webhook |
| cancelled | Cancelled by admin | AdminDashboard |

## Email Receipts
- Triggered by: Hasura Event Trigger on bookings insert + frontend fetch call (safety net)
- HTML email template with booking summary, price breakdown, advance payment reminder
- Via Resend API

## Admin Booking Management
- Admin Dashboard → Bookings tab
- Shows all bookings ordered by created_at DESC
- Status badges: Pending (yellow), Confirmed (green), Cancelled (red)
- Confirm button for pending bookings (calls UPDATE_BOOKING_STATUS mutation)
- Displays: customer name, email, phone, service, date, pet info, notes, advance paid, transaction ID, addons, total price

## Slot Availability
- OPENING_HOURS config in site-content.ts defines 2-hour slots per day
- get-booked-slots function returns occupied slots for a date
- BookingModal disables already-booked time slots

## Validation Rules
- Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Phone: /^\+?\d{7,15}$/
- Package selection required
- Date required (min = today)
- Time slot required
- Transaction ID: unique constraint prevents duplicates

## GraphQL Operations
Document all booking-related queries and mutations:
- CREATE_BOOKING (inline in booking-modal.tsx)
- GET_ADMIN_BOOKINGS
- UPDATE_BOOKING_STATUS
- CHECK_BOOKING_CONFLICT
- UPDATE_BOOKING_PAYMENT_STATUS
- UPDATE_BOOKING_PAYMENT_DETAILS
