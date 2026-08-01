# Database Schema — Gods Creatures Pet Groomers

## Overview
The app uses PostgreSQL managed by Nhost with Hasura GraphQL engine. 3 custom tables + auth schema managed by Nhost.

## Tables

### bookings
| Column | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| id | UUID | gen_random_uuid() | PRIMARY KEY | Unique booking ID |
| user_id | UUID | — | NOT NULL, FK→auth.users | Booking owner |
| pet_id | UUID | — | FK→pets(id) | Associated pet |
| customer_name | TEXT | — | NOT NULL | Customer full name |
| email | TEXT | — | NOT NULL | Customer email |
| phone | TEXT | — | NOT NULL | Customer phone |
| service | TEXT | — | NOT NULL | Package label + size |
| preferred_date | DATE | — | NOT NULL | Requested date |
| notes | TEXT | '' | — | Customer notes |
| advance_paid | INTEGER | 500 | — | Advance payment amount (₹) |
| transaction_id | TEXT | — | NOT NULL, UNIQUE | Payment reference ID |
| status | TEXT | 'pending_verification' | CHECK constraint | pending_verification, confirmed, cancelled |
| addons | JSONB | '[]' | — | Selected add-on services |
| total_price | INTEGER | — | — | Calculated total (package + addons) |
| created_at | TIMESTAMPTZ | now() | — | Creation timestamp |

CHECK constraint on status: `IN ('pending_verification', 'confirmed', 'cancelled')`
Partial unique index: `idx_bookings_service_date_active` ON `(service, preferred_date)` WHERE status IN ('pending_verification', 'confirmed') — prevents double booking

### pets
| Column | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| id | UUID | gen_random_uuid() | PRIMARY KEY | Pet ID |
| user_id | UUID | — | NOT NULL | Pet owner |
| name | TEXT | — | NOT NULL | Pet name |
| species | TEXT | 'Dog' | — | Dog/Cat |
| breed | TEXT | — | — | Breed |
| age_years | INTEGER | — | — | Age in years |
| weight_kg | NUMERIC | — | — | Weight in kg |
| coat_condition | TEXT | — | — | Coat condition |
| medical_history | TEXT | — | — | Medical notes |
| behavioral_notes | TEXT | — | — | Behavioral notes |
| vet_contact | TEXT | — | — | Vet contact info |
| created_at | TIMESTAMPTZ | now() | — | Creation timestamp |

### site_content
| Column | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| id | UUID | gen_random_uuid() | PRIMARY KEY | Row ID |
| section | TEXT | — | NOT NULL, UNIQUE | Section key |
| content | JSONB | '{}' | NOT NULL | Section content data |
| updated_at | TIMESTAMPTZ | now() | — | Last update (auto-trigger) |

Sections: `hero`, `why_choose_us`, `services`, `reviews`, `booking`, `page_backgrounds`, `pricing_menu`, `social_proof`, `gallery`, `team`, `process`, `faq`, `blog`, `store`, `store_catalog`

## Helper Functions
- `current_user_uuid()` — extracts user ID from Hasura JWT session as UUID
- `current_user_id()` — backward-compat wrapper returning text
- `update_site_content_timestamp()` — trigger to auto-update `updated_at`

## RLS Policies

**`bookings` table:**
- **Select:** Users can select rows where `user_id = current_user_uuid()`.
- **Insert:** Users can insert rows where `user_id = current_user_uuid()`.
- **Update:** Users can update specific fields (e.g., notes, status to 'cancelled') where `user_id = current_user_uuid()`.
- **Delete:** Users cannot delete bookings; they should set status to 'cancelled'.

**`pets` table:**
- **Select:** Users can view their own pets (`user_id = current_user_uuid()`).
- **Insert:** Users can add pets where `user_id = current_user_uuid()`.
- **Update:** Users can update their own pets.
- **Delete:** Users can delete their own pets.

**`site_content` table:**
- **Select:** Publicly accessible (anon and user roles).
- **Insert/Update/Delete:** Restricted to admin role only.

## Indexes
The following 7 indexes are defined to optimize database performance:
1. `idx_bookings_user_id` - Speeds up retrieving bookings for a specific user.
2. `idx_bookings_pet_id` - Speeds up queries joining or filtering by pet.
3. `idx_bookings_status` - Enhances performance when filtering bookings by active/pending/cancelled status.
4. `idx_bookings_created_at` (DESC) - Optimizes fetching the most recent bookings.
5. `idx_bookings_transaction_id` - Facilitates quick lookups by payment transaction reference.
6. `idx_pets_user_id` - Optimizes retrieving all pets belonging to a specific user.
7. `idx_bookings_service_date_active` - A partial unique index on `(service, preferred_date) WHERE status IN ('pending_verification', 'confirmed')` to prevent double booking.

## Hasura Permissions

### Role: `public` / `anonymous`
- **site_content:** `select` access to all rows.
- **bookings:** `insert` access (for guest checkout flow, if applicable).

### Role: `user`
- **bookings:**
  - `select`: Own rows (`user_id = X-Hasura-User-Id`).
  - `insert`: Allowed with `user_id` mapped to session variable.
  - `update`: Limited fields (status, notes).
- **pets:**
  - `select`: Own rows (`user_id = X-Hasura-User-Id`).
  - `insert`, `update`, `delete`: Allowed with session variable constraints.
- **site_content:** `select` access to all rows.

### Role: `admin`
- Full `select`, `insert`, `update`, `delete` access to all tables (`bookings`, `pets`, `site_content`).

## Seed Data
Seed data is provided for the `site_content` table to populate the CMS on initial launch. Key entries include:
- **`hero`**: Main heading, subheading, and CTA text.
- **`why_choose_us`**: Array of selling points (e.g., Certified Groomers, Premium Products).
- **`services`**: Overview of main service categories.
- **`reviews`**: Handpicked initial customer testimonials.
- **`booking`**: Configuration for the booking widget (available times, slot duration).
- **`pricing_menu`**: JSON structure defining standard packages and add-ons.
