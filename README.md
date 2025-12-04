# Supabase DSM Wall — December 2025 Meetup App

A community wall application built for the **Supabase Des Moines Meetup**. This teaching app demonstrates how to build a full-stack application with Next.js 15 and Supabase, featuring user authentication, file uploads, and real-time data.

## What This App Does

- **User Authentication**: Simple username/password authentication using bcrypt
- **Profile Management**: Users can set up profiles with avatars and bios
- **Community Feed**: Share photos and code files with the community
- **File Storage**: Upload images and code files to Supabase Storage
- **Member Directory**: View all registered community members

## Getting Started

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd supabase-dsm-wall
npm install
```

### Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/log in
3. Create a new project (give it a name, database password, and select a region)
4. Wait for the project to finish setting up (~2 minutes)

### Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Create a `.env` file in the root of this project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_BUCKET=public-files
```

### Step 4: Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'code')),
  file_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_users_username ON users(username);
```

### Step 5: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Name it `public-files`
4. Make it **Public** (toggle the public option)
5. Click **Create bucket**

**Set up storage policies:**

Go to the bucket policies and add these policies to allow public access:

```sql
-- Allow public uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'public-files');

-- Allow public access to files
CREATE POLICY "Allow public access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-files');
```

### Step 6: Run the App Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Workshop Exercises

Try these exercises during or after the meetup to deepen your understanding:

### Exercise 1: Add a "Likes" Feature
Add a `likes` column to the posts table and implement a like button on each post.

```sql
ALTER TABLE posts ADD COLUMN likes INTEGER DEFAULT 0;
```

### Exercise 2: Change Feed Sort Order
Modify `components/FeedList.tsx` to sort posts by different criteria (e.g., most recent first, oldest first).

### Exercise 3: Add Profile Pictures to Feed
The feed currently shows initials for users without avatars. Enhance this by showing a default avatar image instead.

### Exercise 4: Support Video Uploads
Extend the upload functionality to support video files. Update the `type` check in the posts table and modify the upload form.

### Exercise 5: Explore the Supabase Dashboard
- View your tables in the **Table Editor**
- Watch real-time changes as users sign up
- Check the **Storage** browser to see uploaded files
- Look at **Database** → **Roles** to understand permissions

### Exercise 6: Add Email Field
Add an optional email field to user profiles:

```sql
ALTER TABLE users ADD COLUMN email TEXT;
```

Then update `ProfileForm.tsx` to include an email input.

## Project Structure

```
supabase-dsm-wall/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (login/signup)
│   ├── feed/              # Community feed
│   ├── upload/            # Upload photos/code
│   ├── profile/           # User profile editor
│   ├── members/           # Member directory
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AuthForm.tsx       # Login/signup form
│   ├── ProfileForm.tsx    # Profile editor
│   ├── UploadForm.tsx     # File upload form
│   ├── FeedList.tsx       # Display posts
│   ├── MemberList.tsx     # Display members
│   └── Navigation.tsx     # Nav bar
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── session.ts        # Session management
├── types/                 # TypeScript types
│   └── database.ts       # Database type definitions
└── package.json          # Dependencies
```

## Key Concepts Demonstrated

### 1. Supabase Client Setup
The `lib/supabase.ts` file shows how to initialize the Supabase client with environment variables.

### 2. Database Queries
Components demonstrate various Supabase query patterns:
- `select()` - Fetch data
- `insert()` - Create records
- `update()` - Modify records
- `eq()` - Filter by equality
- `order()` - Sort results

### 3. File Storage
The upload form shows how to:
- Upload files to Supabase Storage
- Get public URLs for uploaded files
- Organize files in folders (avatars/, photos/, code/)

### 4. Authentication (Simplified)
This demo uses a simplified auth system with bcrypt for educational purposes. The auth flow:
1. User signs up → password is hashed and stored
2. User logs in → password is compared to hash
3. Session stored in localStorage with user ID

## Upgrading After the Workshop

This app uses a simplified authentication system for teaching purposes. For a production app, you should:

### Enable Supabase Auth

Replace the custom auth system with Supabase's built-in authentication:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Log in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Enable Row Level Security (RLS)

Add RLS policies to secure your data:

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Anyone can view posts
CREATE POLICY "Anyone can view posts"
ON posts FOR SELECT
USING (true);

-- Users can create their own posts
CREATE POLICY "Users can create own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Additional Security Improvements

1. **Environment Variables**: Never commit `.env` files to git
2. **Input Validation**: Add server-side validation for all inputs
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **HTTPS Only**: Always use HTTPS in production
5. **Content Security Policy**: Add CSP headers to prevent XSS

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Troubleshooting

**Error: "Invalid API key"**
- Double-check your `.env` file has the correct credentials
- Make sure environment variable names start with `NEXT_PUBLIC_`
- Restart the dev server after changing `.env`

**Error: "relation 'users' does not exist"**
- Run the SQL from Step 4 in your Supabase dashboard
- Verify the tables were created in the Table Editor

**Images not uploading**
- Verify the storage bucket exists and is public
- Check the storage policies allow inserts
- Ensure `NEXT_PUBLIC_SUPABASE_BUCKET` matches your bucket name

**App showing blank page**
- Check the browser console for errors
- Verify all dependencies installed: `npm install`
- Try deleting `.next` folder and restart: `rm -rf .next && npm run dev`

## License

MIT - Feel free to use this project for learning and teaching!
