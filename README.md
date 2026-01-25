# Wedding Guest Manager

A web application for managing wedding guests, invitations, and RSVPs.

## Features

- **Guest Management**: Add, edit, and delete wedding guests
- **Invitation System**: Send email invitations with unique RSVP links
- **RSVP Tracking**: Track invitation status (sent, opened, responded)
- **Guest Responses**: Collect attendance confirmation, party size, dietary restrictions
- **Dashboard**: Overview of guests, invitations, and response statistics

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Email**: Resend API
- **Deployment**: AWS Amplify

## Setup

### Prerequisites

- Node.js 18+
- A Supabase account
- A Resend account (for sending emails)
- AWS account (for deployment)

### 1. Clone and Install

```bash
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the migration in `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and anon key from Settings > API

### 3. Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

### 4. Deploy Edge Function (for emails)

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref your-project-ref`
3. Set the Resend API key: `supabase secrets set RESEND_API_KEY=your-resend-key`
4. Deploy the function: `supabase functions deploy send-invitation`

### 5. Run Locally

```bash
npm run dev
```

Visit http://localhost:5173

## Deployment to AWS Amplify

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to AWS Amplify Console
3. Click "New app" > "Host web app"
4. Connect your repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` (your Amplify domain)
6. Deploy

The `amplify.yml` file is already configured for the build.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/          # Navbar, Layout
│   ├── guests/          # Guest list, form
│   ├── invitations/     # Invitation status
│   └── ui/              # Button, Input, Modal, Badge
├── pages/               # Route components
│   ├── Dashboard.tsx    # Stats overview
│   ├── Guests.tsx       # Guest management
│   ├── Invitations.tsx  # Invitation tracking
│   ├── Login.tsx        # Auth login
│   ├── Register.tsx     # Auth register
│   └── Rsvp.tsx         # Public RSVP page
├── hooks/               # Custom React hooks
├── contexts/            # React context (Auth)
├── lib/                 # Supabase client, utilities
└── types/               # TypeScript types

supabase/
├── migrations/          # Database schema
└── functions/           # Edge Functions (email sending)
```

## License

MIT
