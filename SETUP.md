# 🚀 Complete Setup Guide for AI Prompt Studio

## Current Status
✅ **Demo Mode Active** - The app works with email authentication using local storage
❌ **Supabase Not Connected** - OAuth providers (Google/GitHub) require Supabase setup

## 🎯 Quick Start (Demo Mode)
Your app is already working in demo mode! Try these credentials:
- **Email**: demo@example.com
- **Password**: password123

## 🔧 Full Setup (Production Ready)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
5. Wait for setup to complete (~2 minutes)

### Step 2: Get Credentials
1. Go to Settings → API in your Supabase dashboard
2. Copy your **Project URL** and **anon public key**

### Step 3: Set Environment Variables

#### For Local Development:
Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### For Vercel/Netlify Deployment:
Add these environment variables in your hosting dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Step 4: Set Up Database
Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles_ai_prompt (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts_ai_studio (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles_ai_prompt ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_ai_studio ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles_ai_prompt
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles_ai_prompt
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles_ai_prompt
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for prompts
CREATE POLICY "Users can view own prompts" ON prompts_ai_studio
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public prompts" ON prompts_ai_studio
  FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert own prompts" ON prompts_ai_studio
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prompts" ON prompts_ai_studio
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prompts" ON prompts_ai_studio
  FOR DELETE USING (auth.uid() = user_id);
```

### Step 5: Enable OAuth (Optional)
1. Go to Authentication → Providers in Supabase
2. Enable Google and/or GitHub
3. Configure OAuth apps:

#### Google OAuth:
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create OAuth 2.0 credentials
- Add your domain to authorized origins
- Add Supabase callback URL

#### GitHub OAuth:
- Go to GitHub Settings → Developer settings → OAuth Apps
- Create new OAuth app
- Add Supabase callback URL

### Step 6: Deploy with Environment Variables
Redeploy your app with the environment variables set.

## 🎉 Success Indicators
When setup is complete, you'll see:
- ✅ "Supabase connected successfully" in browser console
- ✅ Google/GitHub buttons become active
- ✅ Real user authentication
- ✅ Data persistence across sessions

## 🆘 Troubleshooting

### Issue: OAuth buttons are disabled
**Solution**: Set up Supabase environment variables

### Issue: "Failed to sign in"
**Solution**: Check your environment variables and database setup

### Issue: User data not persisting
**Solution**: Verify RLS policies are correctly set up

## 📞 Need Help?
The app works in demo mode right now! For production setup, follow the steps above or contact support.