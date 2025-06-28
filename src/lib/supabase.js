import { createClient } from '@supabase/supabase-js'

// Supabase credentials for prompter project
const SUPABASE_URL = 'https://bavhspjvbkxzwvzwmgqv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdmhzcGp2Ymt4end2endtZ3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTU3MzEsImV4cCI6MjA2NjY5MTczMX0.2CRjWFubLUjZCNjoJaqOMkVtXXnzM5IkAH3FY50eeQs'

if (SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

// Detect the current environment and set the correct redirect URL
const getRedirectURL = () => {
  // Check if we're in production (Netlify)
  if (window.location.hostname.includes('netlify.app')) {
    return window.location.origin;
  }
  
  // Check for custom domain
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  
  // Default to localhost for development
  return 'http://localhost:5173';
};

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-prompt-studio@1.0.0'
    }
  }
})

// Check if we have valid Supabase credentials
const hasValidCredentials = SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.includes('supabase.co')

console.log('✅ Supabase connected successfully to prompter project')
console.log('🌐 Redirect URL:', getRedirectURL())

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('prompts_ai_studio')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database connection test failed:', error.message);
    } else {
      console.log('✅ Database connection test successful');
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
};

// Test connection when module loads
testConnection();

export default supabase
export { hasValidCredentials, getRedirectURL }