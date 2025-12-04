# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a teaching application for the **Supabase Des Moines (DSM) Meetup**. It's a community wall where users can share photos and code files. The app demonstrates Next.js 15 App Router integration with Supabase for database, storage, and authentication.

**Key Purpose**: Educational demo for live workshop sessions with clear, simple architecture.

## Architecture

### Technology Stack
- **Frontend**: Next.js 15 (App Router, TypeScript, React 18)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage)
- **Auth**: Simplified bcrypt-based auth (localStorage sessions) - educational only
- **Package Manager**: npm

### Database Schema

```sql
users {
  id: UUID (PK)
  username: TEXT (unique)
  password_hash: TEXT
  bio: TEXT?
  avatar_url: TEXT?
  created_at: TIMESTAMPTZ
}

posts {
  id: UUID (PK)
  user_id: UUID (FK -> users)
  type: 'photo' | 'code'
  file_url: TEXT
  caption: TEXT?
  created_at: TIMESTAMPTZ
}
```

### Project Structure

```
app/                    # Next.js App Router pages
├── page.tsx           # Home/auth page
├── feed/page.tsx      # Community feed
├── upload/page.tsx    # Upload form
├── profile/page.tsx   # Profile editor
├── members/page.tsx   # Member directory
├── layout.tsx         # Root layout
└── globals.css        # Tailwind imports

components/            # React components
├── AuthForm.tsx       # Login/signup
├── Navigation.tsx     # Nav bar
├── ProfileForm.tsx    # Profile editor
├── UploadForm.tsx     # File uploader
├── FeedList.tsx       # Posts display
└── MemberList.tsx     # Members grid

lib/
├── supabase.ts        # Supabase client init
└── session.ts         # localStorage session helpers

types/
└── database.ts        # TypeScript types for DB
```

### Authentication Flow

**Note**: This uses simplified auth for teaching. Production apps should use Supabase Auth + RLS.

1. **Signup**: Username + password → bcrypt hash → store in `users` table
2. **Login**: Compare password with hash → store user ID in localStorage
3. **Session**: `lib/session.ts` manages localStorage read/write
4. **Logout**: Clear localStorage and redirect to home

### File Upload Flow

1. User selects file (image or code)
2. Determine type based on MIME type
3. Upload to Supabase Storage bucket: `public-files/{folder}/{userId-timestamp.ext}`
4. Get public URL from storage
5. Create post record in `posts` table with URL

## Development Commands

### Setup

```bash
# Install dependencies
npm install

# Create .env from template
cp .env.example .env
# Then add your Supabase credentials
```

### Development Server

```bash
# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Supabase Setup

**Note**: This project uses hosted Supabase, not local development.

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL from README Step 4 to create tables
3. Create storage bucket named `public-files` (must be public)
4. Add credentials to `.env`

**Important SQL snippets** (see README.md for full setup):

```sql
-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'code')),
  file_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Storage policies for public-files bucket
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'public-files');

CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'public-files');
```

## Key Configuration Files

- `.env` - Supabase credentials (not committed)
- `.env.example` - Template for environment variables
- `next.config.js` - Next.js config (includes Supabase image domains)
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript config with path aliases (@/*)
- `package.json` - Dependencies and scripts

## Important Implementation Notes

### Client Components
All interactive components use `'use client'` directive since they use hooks (useState, useEffect) or browser APIs (localStorage).

### Session Management
**Critical**: This uses localStorage for demo purposes only. Real apps should:
- Use Supabase Auth with JWTs
- Implement Row Level Security (RLS)
- Use httpOnly cookies for tokens

### File Storage Organization
```
public-files/
├── avatars/     # User profile pictures
├── photos/      # Photo posts
└── code/        # Code file posts
```

### Environment Variables
All Supabase config uses `NEXT_PUBLIC_*` prefix to be available in browser (required for client components).

## Common Development Tasks

### Adding a New Page
1. Create `app/your-page/page.tsx`
2. Import and use `<Navigation />` component
3. Add link to `components/Navigation.tsx` if needed

### Modifying Database Schema
1. Run SQL in Supabase dashboard SQL Editor
2. Update TypeScript types in `types/database.ts`
3. Update affected components

### Debugging Supabase Queries
```typescript
const { data, error } = await supabase.from('table').select();
if (error) console.error('Supabase error:', error);
```

### Testing File Uploads
1. Verify bucket exists and is public in Supabase dashboard
2. Check storage policies allow inserts
3. Test with small files first
4. Check browser console for errors

## Workshop Context

This app is designed for:
- Live coding demos at meetups
- Students forking and connecting their own Supabase
- Teaching basic full-stack patterns
- Demonstrating Supabase features (DB, Storage, queries)

**Teaching focus areas**:
- Supabase client setup and queries
- File storage and public URLs  
- Simple database relationships (users → posts)
- Next.js App Router patterns
- TypeScript with Supabase

**Not covered** (intentionally simplified):
- Supabase Auth (uses custom auth)
- Row Level Security (tables are open)
- Server components (all client components)
- Error boundaries
- Loading states
- Form validation
- Testing

## Upgrade Path (Post-Workshop)

See README.md section "Upgrading After the Workshop" for:
- Migrating to Supabase Auth
- Implementing Row Level Security
- Security best practices
- Production considerations
