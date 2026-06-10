# Hasura Metadata — Gods Creatures Pet Groomers

## Setup

1. Install Hasura CLI: `npm install -g hasura-cli` or `curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | sh`
2. Set admin secret in `config.yaml` (get from Nhost Dashboard → Settings → Hasura → Admin Secret)
3. Run from this directory: `hasura metadata apply`

## Roles

| Role | Description |
|------|-------------|
| `public` | Unauthenticated users — can SELECT site_content only |
| `user` | Regular authenticated users — own bookings/pets only (user_id filter) |
| `admin` | Admin users — can see all bookings, update status |

## Before Applying

Disable the SQL RLS policies on `bookings`, `pets`, and `site_content` tables (from `nhost-setup.sql`) since Hasura metadata permissions will replace them. Run in Hasura SQL console:

```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE pets DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bookings_insert_own ON bookings;
DROP POLICY IF EXISTS bookings_select_own ON bookings;
DROP POLICY IF EXISTS pets_insert_own ON pets;
DROP POLICY IF EXISTS pets_select_own ON pets;
DROP POLICY IF EXISTS pets_update_own ON pets;
DROP POLICY IF EXISTS site_content_select_public ON site_content;
DROP POLICY IF EXISTS site_content_insert_auth ON site_content;
DROP POLICY IF EXISTS site_content_update_auth ON site_content;
```

## Admin Role Setup

The `admin` role is defined in metadata but Nhost doesn't assign it by default. To use it:
- **Option A:** Set custom JWT claims in Nhost Dashboard → Users → Edit user → Add role `admin` → then the Apollo client `x-hasura-role` header will need to send `admin` for the admin user
- **Option B:** Admins use the Hasura console directly with the admin secret (ignores role-based permissions)
