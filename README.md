# AI Prompt Studio

A powerful Progressive Web App for creating, enhancing, and sharing AI prompts with intelligent assistance.

## Features

- 🔐 **Authentication**: Google & GitHub OAuth + Email/Password
- 🤖 **AI Enhancement**: Improve prompts with AI-powered suggestions
- 📝 **Rich Editor**: Advanced prompt editing with real-time preview
- 🏷️ **Organization**: Tags, categories, and search functionality
- 🔄 **Collaboration**: Share prompts and collaborate with teams
- 📊 **Analytics**: Track views, likes, and performance
- 🌙 **Dark Mode**: Beautiful dark/light theme toggle
- 📱 **PWA**: Works offline with service worker caching

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase (Required for authentication)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your credentials
3. Create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up Database Tables

Run this SQL in your Supabase SQL editor:

```sql
-- Create profiles table for user data
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

-- Enable Row Level Security
ALTER TABLE profiles_ai_prompt ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_ai_studio ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles_ai_prompt
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles_ai_prompt
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles_ai_prompt
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for prompts
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

### 4. Configure OAuth Providers (Optional)

In your Supabase dashboard:
1. Go to Authentication > Providers
2. Enable Google and/or GitHub
3. Add your OAuth app credentials

### 5. Run the Development Server

```bash
npm run dev
```

## Demo Mode

The app includes a demo mode that works without Supabase configuration:
- Uses localStorage for data persistence
- Simulated authentication (demo purposes only)
- All features work except real OAuth providers

## Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: React Icons
- **PWA**: Service Worker, Web App Manifest

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details