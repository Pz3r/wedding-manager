# bodaliliyjose.com - Wedding Guest Management App

## Overview

Wedding website and guest management platform for **Lili & Jos's** wedding (June 15, 2026, Hacienda Los Sueños, Mexico City). Combines a public-facing landing page with a private dashboard for managing guests, sending invitations (email + WhatsApp), and tracking RSVP responses.

**Domain:** bodaliliyjose.com
**Contact email:** liliyjose@bodaliliyjose.com
**Invitation sender:** invitaciones@bodaliliyjose.com

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React 19 + TypeScript 5.9           |
| Build        | Vite 7                              |
| Styling      | Tailwind CSS v4 (via PostCSS)       |
| Icons        | Heroicons React v2                  |
| Routing      | React Router DOM v7                 |
| Backend/DB   | Supabase (PostgreSQL + Auth + RLS)  |
| Edge Funcs   | Supabase Edge Functions (Deno)      |
| Email        | Resend API                          |
| WhatsApp     | `wa.me` deep links (client-side)    |
| Hosting      | AWS Amplify                         |
| Utilities    | clsx (class merging)                |

---

## Environment Variables

Defined in `.env` (see `.env.example`):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

Supabase Edge Function secrets (set via Supabase dashboard):
- `RESEND_API_KEY` - Resend API key for sending emails

---

## Architecture

### Frontend (React SPA)

```
src/
├── App.tsx                          # Router setup
├── main.tsx                         # Entry point
├── lib/
│   ├── supabase.ts                  # Supabase client (typed with Database)
│   └── utils.ts                     # Helpers: cn, generateToken, getRsvpUrl,
│                                    #   getWhatsAppUrl, formatDate, formatDateTime,
│                                    #   getStatusColor
├── types/
│   ├── database.ts                  # Supabase-generated DB types
│   └── index.ts                     # App-level types (Guest, Invitation,
│                                    #   InvitationWithRsvp, RsvpFormData, etc.)
├── contexts/
│   └── AuthContext.tsx               # Supabase Auth context provider
├── hooks/
│   ├── useGuests.ts                 # CRUD operations for guests
│   └── useInvitations.ts           # Invitation management:
│                                    #   createAndSendInvitation (email)
│                                    #   getOrCreateInvitation (WhatsApp)
│                                    #   resendInvitation (re-email)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Layout.tsx               # Protected layout with auth guard
│   │   └── Navbar.tsx
│   ├── guests/
│   │   ├── GuestList.tsx            # Table with email + WhatsApp buttons
│   │   └── GuestForm.tsx            # Add/edit guest modal form
│   └── invitations/
│       └── InvitationStatus.tsx     # Status badge component
└── pages/
    ├── Landing.tsx                   # Public wedding landing page
    ├── Login.tsx                     # Auth: login
    ├── Register.tsx                  # Auth: register
    ├── Rsvp.tsx                      # Public RSVP form (token-based)
    ├── Dashboard.tsx                 # Stats overview + progress bars
    ├── Guests.tsx                    # Guest management + send invitations
    ├── Invitations.tsx              # Invitation tracking table
    └── Responses.tsx                # RSVP response details + dietary summary
```

### Routes

| Path              | Access    | Component    | Description                        |
| ----------------- | --------- | ------------ | ---------------------------------- |
| `/`               | Public    | Landing      | Wedding info landing page          |
| `/login`          | Public    | Login        | Authentication                     |
| `/register`       | Public    | Register     | Account creation                   |
| `/rsvp/:token`    | Public    | Rsvp         | Guest RSVP form (unique per invite)|
| `/dashboard`      | Protected | Dashboard    | Stats overview                     |
| `/guests`         | Protected | Guests       | Guest CRUD + send invitations      |
| `/invitations`    | Protected | Invitations  | Track invitation statuses          |
| `/responses`      | Protected | Responses    | View RSVP details + dietary needs  |

### Backend (Supabase)

#### Database Tables

**guests**
- `id` (UUID, PK), `user_id` (FK → auth.users), `name`, `email`, `phone`, `group_name`, `expected_attendees` (default 1), `created_at`

**invitations**
- `id` (UUID, PK), `guest_id` (FK → guests), `token` (UNIQUE), `status` (enum: pending → sent → opened → responded), `sent_at`, `opened_at`, `created_at`

**rsvp_responses**
- `id` (UUID, PK), `invitation_id` (FK → invitations, UNIQUE), `attending` (boolean), `party_size`, `dietary_restrictions`, `message`, `notes`, `responded_at`, `updated_at`

#### RLS (Row Level Security) Policies

- **guests:** Users can CRUD only their own guests (`user_id = auth.uid()`)
- **invitations:** Users can manage invitations for their own guests. Public can SELECT/UPDATE any invitation (for RSVP tracking)
- **rsvp_responses:** Users can SELECT responses for their own guests. Public can INSERT (submit RSVP) and UPDATE (modify RSVP) any response

#### Database Function

- `get_invitation_by_token(invitation_token TEXT)` — SECURITY DEFINER function that returns invitation details + existing RSVP response for the public RSVP page

#### Edge Functions

- `send-invitation` — Sends email invitation via Resend API. Validates auth, verifies ownership, sends HTML email with RSVP link.

#### Migrations

```
supabase/migrations/
├── 001_initial_schema.sql           # Tables, RLS, get_invitation_by_token
├── 002_add_attendees_and_notes.sql  # expected_attendees, notes column, updated function
├── 003_create_rsvp_views.sql        # (views)
├── 004_allow_public_update_rsvp.sql # UPDATE RLS policy for rsvp_responses
└── 005_add_updated_at_to_rsvp.sql   # updated_at column on rsvp_responses
```

---

## Deployment

### AWS Amplify

- Config: `amplify.yml` in project root
- Build command: `npm ci && npm run build`
- Output directory: `dist/`
- Security headers: HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- Environment variables are set in the Amplify console (same as `.env`)

### Supabase

- Hosted Supabase project (cloud)
- Edge Functions deployed via `supabase functions deploy`
- Secrets set via `supabase secrets set RESEND_API_KEY=xxx`

---

## Key Flows

### Sending an Invitation (Email)

1. User clicks email icon on Guests page
2. Confirmation modal appears
3. On confirm: creates invitation record in DB with unique token → calls `send-invitation` Edge Function → Edge Function sends HTML email via Resend → updates status to "sent"
4. Guest receives email with RSVP link (`/rsvp/:token`)

### Sending an Invitation (WhatsApp)

1. User clicks WhatsApp icon (only visible if guest has phone number)
2. Confirmation modal appears
3. On confirm: opens blank window synchronously (to avoid popup blockers) → creates/reuses invitation record → redirects window to `wa.me` deep link with pre-composed Spanish message
4. WhatsApp opens with message containing RSVP link

### RSVP Flow

1. Guest opens `/rsvp/:token` link
2. Invitation status updated to "opened"
3. Guest fills form (attending?, party size, dietary restrictions, message, notes)
4. On submit: inserts into `rsvp_responses` (or updates if duplicate key 23505)
5. Invitation status updated to "responded"
6. If guest revisits, form is pre-filled with existing response

---

## External Services

| Service     | Purpose             | Config Location                   |
| ----------- | ------------------- | --------------------------------- |
| Supabase    | DB, Auth, Functions | `.env` + Supabase dashboard       |
| Resend      | Transactional email | Edge Function secret              |
| ImprovMX    | Email forwarding    | ImprovMX dashboard                |
| AWS Amplify | Frontend hosting    | `amplify.yml` + Amplify console   |

**Email forwarding:** ImprovMX handles email forwarding for the `bodaliliyjose.com` domain. Replies to `liliyjose@bodaliliyjose.com` (the `reply_to` on invitation emails) are forwarded to your personal inbox.

---

## Running Locally

```bash
npm install
npm run dev          # Starts Vite dev server on localhost:5173
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
```

For Supabase Edge Functions:
```bash
supabase functions serve send-invitation --env-file .env
```

---

## Gotchas and Lessons Learned

- **PostgREST schema cache:** After running `ALTER TABLE ADD COLUMN`, PostgREST's cached schema won't include the new column. The `(*)` selector only expands to columns PostgREST knows about. Fix by running `NOTIFY pgrst, 'reload schema'` in the Supabase SQL Editor.
- **Supabase UNIQUE FK = single object, not array:** When a foreign key has a UNIQUE constraint (like `rsvp_responses.invitation_id`), PostgREST returns a single object instead of an array in joins. Code must handle both cases.
- **WhatsApp popup blockers:** The WhatsApp window must be opened synchronously (`window.open('', '_blank')`) BEFORE any async operation, then the URL is set after the DB call completes.
- **RLS for public RSVP updates:** The `rsvp_responses` table needs an explicit UPDATE policy (`USING (true)`) for guests to modify their responses from the public RSVP page.
- **Email content is in Spanish** (matching the couple's preference), with the sender address being `invitaciones@bodaliliyjose.com` and reply-to `liliyjose@bodaliliyjose.com`.
- **CHECK constraint:** `rsvp_responses.party_size` has `CHECK (party_size >= 1)` — when a guest declines, the code sets `party_size: 0` which could violate this constraint.
