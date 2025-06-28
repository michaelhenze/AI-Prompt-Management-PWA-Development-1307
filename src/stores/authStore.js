import { create } from 'zustand';
import supabase, { hasValidCredentials, getRedirectURL } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  subscription: null,

  initialize: async () => {
    try {
      console.log('🚀 Initializing authentication with Supabase...');
      
      // Get initial session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        set({ user: null, loading: false });
        return;
      }

      if (session?.user) {
        console.log('✅ Found existing session for:', session.user.email);
        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.email,
            photoURL: session.user.user_metadata?.avatar_url,
            ...session.user.user_metadata
          },
          loading: false
        });
      } else {
        console.log('👤 No existing session found');
        set({ user: null, loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth event:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Try to create user profile if it doesn't exist
          try {
            const { data: profile } = await supabase
              .from('profiles_ai_prompt')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!profile) {
              console.log('🆕 Creating user profile...');
              await supabase
                .from('profiles_ai_prompt')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  display_name: session.user.user_metadata?.full_name || session.user.email,
                  avatar_url: session.user.user_metadata?.avatar_url,
                  subscription: 'free'
                });
            }
          } catch (error) {
            console.log('Profile creation skipped:', error.message);
          }

          set({
            user: {
              id: session.user.id,
              email: session.user.email,
              displayName: session.user.user_metadata?.full_name || session.user.email,
              photoURL: session.user.user_metadata?.avatar_url,
              ...session.user.user_metadata
            },
            loading: false
          });
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, loading: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      console.log('🔑 Attempting Google sign-in...');
      const redirectURL = getRedirectURL();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectURL}/#/dashboard`
        }
      });
      
      if (error) throw error;
      toast.success('Redirecting to Google...');
    } catch (error) {
      toast.error('Failed to sign in with Google: ' + error.message);
      console.error(error);
    }
  },

  signInWithGithub: async () => {
    try {
      console.log('🔑 Attempting GitHub sign-in...');
      const redirectURL = getRedirectURL();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${redirectURL}/#/dashboard`
        }
      });
      
      if (error) throw error;
      toast.success('Redirecting to GitHub...');
    } catch (error) {
      toast.error('Failed to sign in with GitHub: ' + error.message);
      console.error(error);
    }
  },

  signInWithEmail: async (email, password) => {
    try {
      console.log('📧 Attempting email sign-in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      toast.success('Successfully signed in!');
      return data;
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
      console.error(error);
      throw error;
    }
  },

  signUpWithEmail: async (email, password, displayName) => {
    try {
      console.log('📧 Attempting email sign-up for:', email);
      const redirectURL = getRedirectURL();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName
          },
          emailRedirectTo: `${redirectURL}/#/dashboard`
        }
      });
      
      if (error) throw error;
      
      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account!');
      } else {
        toast.success('Account created successfully!');
      }
      return data;
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      console.error(error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      console.log('👋 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, subscription: null });
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
    }
  }
}));