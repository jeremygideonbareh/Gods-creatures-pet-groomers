# Backend Functions — Gods Creatures Pet Groomers

## Overview
There are 11 Nhost serverless functions in the `functions/` directory. These are deployed to Nhost automatically on push. They handle payment processing, booking management, email delivery, and slot availability.

---

## Function Reference

### Active Functions

#### 1. create-booking-order
1. **File path**: `functions/v1/create-booking-order.ts`
2. **HTTP method and route**: `POST /v1/create-booking-order`
3. **Purpose**: Main booking endpoint. Validates JWT, checks slot availability, inserts `pending_payment` booking into Hasura, and creates a Cashfree payment order.
4. **Request payload**: 
   ```typescript
   {
     service_id: string;
     booking_date: string; // YYYY-MM-DD
     time_slot: string; // HH:mm
     pet_details: object;
     amount: number;
   }
   ```
5. **Response format**: 
   ```typescript
   {
     payment_session_id: string;
     booking_id: string;
   }
   ```
6. **Authentication requirements**: Valid Nhost JWT required (Bearer token)
7. **External API integrations**: Nhost Hasura GraphQL, Cashfree Orders API
8. **Environment variables needed**: `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_API_URL`, `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`
9. **Error handling**: Returns 400 on missing payload/slot taken, 401 on unauthorized, 500 on Cashfree API error.
10. **Flow diagram**:
    `Client -> Auth -> Slot Check -> DB Insert (pending) -> Cashfree API -> Return Session ID`

#### 2. confirm-booking
1. **File path**: `functions/v1/confirm-booking.ts`
2. **HTTP method and route**: `POST /v1/confirm-booking`
3. **Purpose**: Verifies payment with Cashfree server-to-server API, updates booking to confirmed, triggers email receipt.
4. **Request payload**: 
   ```typescript
   {
     booking_id: string;
     order_id: string;
   }
   ```
5. **Response format**: 
   ```typescript
   {
     success: boolean;
     status: string;
   }
   ```
6. **Authentication requirements**: Valid Nhost JWT required
7. **External API integrations**: Cashfree Payments API, Hasura GraphQL, `send-booking-receipt` function
8. **Environment variables needed**: `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_API_URL`, `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`
9. **Error handling**: Returns 400 on invalid payment status, 404 on booking not found.
10. **Flow diagram**:
    `Client -> Auth -> Verify Cashfree Order -> DB Update (confirmed) -> Trigger Receipt`

#### 3. create-manual-booking
1. **File path**: `functions/v1/create-manual-booking.ts`
2. **HTTP method and route**: `POST /v1/create-manual-booking`
3. **Purpose**: Manual UPI/GPay booking fallback. Validates JWT, checks slot, inserts `pending_verification` booking.
4. **Request payload**: 
   ```typescript
   {
     service_id: string;
     booking_date: string;
     time_slot: string;
     pet_details: object;
     transaction_ref?: string;
   }
   ```
5. **Response format**: 
   ```typescript
   {
     booking_id: string;
     status: string;
   }
   ```
6. **Authentication requirements**: Valid Nhost JWT required
7. **External API integrations**: Hasura GraphQL
8. **Environment variables needed**: `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`
9. **Error handling**: Returns 400 on slot taken, 500 on database error.
10. **Flow diagram**:
    `Client -> Auth -> Slot Check -> DB Insert (pending_verification)`

#### 4. get-booked-slots
1. **File path**: `functions/v1/get-booked-slots.ts`
2. **HTTP method and route**: `POST /v1/get-booked-slots`
3. **Purpose**: Public endpoint to return booked time slots for a given date. Used by the booking modal to show availability.
4. **Request payload**: 
   ```typescript
   {
     date: string; // YYYY-MM-DD
   }
   ```
5. **Response format**: 
   ```typescript
   {
     booked_slots: string[]; // e.g. ["10:00", "14:30"]
   }
   ```
6. **Authentication requirements**: None (Public)
7. **External API integrations**: Hasura GraphQL
8. **Environment variables needed**: `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`
9. **Error handling**: Returns 400 for invalid date format.
10. **Flow diagram**:
    `Client -> Query DB for active bookings -> Return array of times`

#### 5. cashfree-webhook
1. **File path**: `functions/v1/cashfree-webhook.ts`
2. **HTTP method and route**: `POST /v1/cashfree-webhook`
3. **Purpose**: Webhook handler. Verifies HMAC-SHA256 signature, maps payment events to booking status updates.
4. **Request payload**: Cashfree Event Payload (JSON)
5. **Response format**: `200 OK`
6. **Authentication requirements**: HMAC-SHA256 Signature Header Verification
7. **External API integrations**: Hasura GraphQL
8. **Environment variables needed**: `CASHFREE_WEBHOOK_SECRET`, `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`
9. **Error handling**: Returns 401 on signature mismatch.
10. **Flow diagram**:
    `Cashfree -> Verify HMAC -> Map Event (success/failed) -> DB Update`

#### 6. razorpay-webhook
1. **File path**: `functions/v1/razorpay-webhook.ts`
2. **HTTP method and route**: `POST /v1/razorpay-webhook`
3. **Purpose**: Legacy Razorpay webhook handler. Verifies HMAC-SHA256 signature, updates booking status.
4. **Request payload**: Razorpay Event Payload (JSON)
5. **Response format**: `200 OK`
6. **Authentication requirements**: HMAC-SHA256 Signature Header Verification
7. **External API integrations**: Hasura GraphQL
8. **Environment variables needed**: `RAZORPAY_WEBHOOK_SECRET`, `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`
9. **Error handling**: Returns 401 on signature mismatch.
10. **Flow diagram**:
    `Razorpay -> Verify HMAC -> Map Event (captured/failed) -> DB Update`

#### 7. send-booking-receipt
1. **File path**: `functions/v1/send-booking-receipt.ts`
2. **HTTP method and route**: `POST /v1/send-booking-receipt`
3. **Purpose**: Email receipt via Resend API. Accepts Hasura Event Trigger payload or direct API call. HTML template with booking details.
4. **Request payload**: Hasura Event Payload or Custom Payload mapping to booking ID
5. **Response format**: 
   ```typescript
   {
     success: boolean;
     email_id?: string;
   }
   ```
6. **Authentication requirements**: Hasura webhook secret or Nhost admin secret
7. **External API integrations**: Resend API, Hasura GraphQL
8. **Environment variables needed**: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `FROM_EMAIL`, `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`
9. **Error handling**: Returns 500 on Resend delivery failure.
10. **Flow diagram**:
    `Hasura Trigger -> Fetch Booking Details -> Render HTML -> Send via Resend`

#### 8. verify-razorpay-payment
1. **File path**: `functions/v1/verify-razorpay-payment.ts`
2. **HTTP method and route**: `POST /v1/verify-razorpay-payment`
3. **Purpose**: Razorpay checkout signature verification using HMAC-SHA256 with `timingSafeEqual`.
4. **Request payload**: 
   ```typescript
   {
     razorpay_order_id: string;
     razorpay_payment_id: string;
     razorpay_signature: string;
   }
   ```
5. **Response format**: 
   ```typescript
   {
     verified: boolean;
   }
   ```
6. **Authentication requirements**: Valid Nhost JWT required
7. **External API integrations**: None
8. **Environment variables needed**: `RAZORPAY_KEY_SECRET`
9. **Error handling**: Returns 400 on missing parameters, 401 on invalid signature.
10. **Flow diagram**:
    `Client -> Generate HMAC -> timingSafeEqual -> Return boolean`

---

### Deprecated Functions

#### 9. create-cashfree-order
- **File path**: `functions/v1/create-cashfree-order.ts`
- **Status**: Deprecated. Superseded by `create-booking-order.ts`.

#### 10. verify-cashfree-payment
- **File path**: `functions/v1/verify-cashfree-payment.ts`
- **Status**: Deprecated. Verification logic is now handled in `confirm-booking.ts`.

#### 11. create-razorpay-order
- **File path**: `functions/v1/create-razorpay-order.ts`
- **Status**: Deprecated. Retained only for legacy Razorpay support.

---

## Payment Flow Diagrams

### 1. Cashfree Payment Flow (Main)
```text
[User] 
  │
  ├─(Selects slot & fills details)─> [booking-modal]
                                         │
                                         ├─(Calls API)─> [create-booking-order]
                                                               │
                                                               ├─(Calls Cashfree)─> [Cashfree SDK]
                                                               │
                                                         (Returns Session)
                                                               │
                                                         [Cashfree UI Checkout]
                                                               │
                                                         [confirm-booking]
                                                               │
                                                           [Hasura DB] (Status: Confirmed)
```

### 2. Cashfree Webhook Flow
```text
[Cashfree Server] 
       │
       ├─(Sends Event)─> [cashfree-webhook]
                               │
                       (Verifies HMAC-SHA256)
                               │
                       (Maps payment events)
                               │
                           [Hasura DB]
                    (payment.success -> confirmed)
                 (payment.failed -> payment_failed)
```

### 3. Manual UPI Flow
```text
[User] 
  │
  ├─(Selects Manual UPI)─> [booking-modal]
                               │
                       [create-manual-booking]
                               │
                           [Hasura DB] 
                  (Status: pending_verification)
```

### 4. Email Receipt Flow
```text
[Hasura DB] 
     │
     ├─(Booking insert/update triggered)─> [Hasura Event Trigger]
                                                  │
                                       [send-booking-receipt]
                                                  │
                                            (Renders HTML)
                                                  │
                                            [Resend API] 
                                                  │
                                          (Delivers Email)
```

---

## Security

*   **JWT Verification**: Enforced on all authenticated endpoints to ensure the user is logged in.
*   **HMAC-SHA256 Webhook Signature Verification**: Verifies payload authenticity from payment gateways (Cashfree & Razorpay).
*   **`timingSafeEqual`**: Used for constant-time comparison during signature verification to prevent timing attacks.
*   **HTML Escaping**: Used in email templates to prevent injection vulnerabilities.
*   **CORS Headers**: Implemented on all endpoints to strictly control origins.
