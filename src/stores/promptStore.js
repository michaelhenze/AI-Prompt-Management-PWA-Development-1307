import { create } from 'zustand';
import supabase from '../lib/supabase';
import openaiService from '../lib/openai';
import toast from 'react-hot-toast';

export const usePromptStore = create((set, get) => ({
  prompts: [],
  currentPrompt: null,
  loading: false,
  enhancing: false,

  createPrompt: async (promptData, userId) => {
    try {
      set({ loading: true });
      console.log('🆕 Creating new prompt...');

      const newPrompt = {
        ...promptData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        likes: 0,
        shares: 0,
        tags: promptData.tags || []
      };

      const { data, error } = await supabase
        .from('prompts_ai_studio')
        .insert(newPrompt)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create prompt: ${error.message}`);
      }

      set(state => ({
        prompts: [...state.prompts, data],
        currentPrompt: data,
        loading: false
      }));

      toast.success('Prompt created successfully!');
      return data;
    } catch (error) {
      set({ loading: false });
      console.error('Create prompt error:', error);
      toast.error(error.message || 'Failed to create prompt');
      throw error;
    }
  },

  updatePrompt: async (promptId, updates) => {
    try {
      set({ loading: true });
      console.log('✏️ Updating prompt:', promptId);

      const { data, error } = await supabase
        .from('prompts_ai_studio')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', promptId)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to update prompt: ${error.message}`);
      }

      set(state => ({
        prompts: state.prompts.map(p => p.id === promptId ? data : p),
        currentPrompt: state.currentPrompt?.id === promptId ? data : state.currentPrompt,
        loading: false
      }));

      toast.success('Prompt updated successfully!');
      return data;
    } catch (error) {
      set({ loading: false });
      console.error('Update prompt error:', error);
      toast.error(error.message || 'Failed to update prompt');
      throw error;
    }
  },

  deletePrompt: async (promptId) => {
    try {
      console.log('🗑️ Deleting prompt:', promptId);

      const { error } = await supabase
        .from('prompts_ai_studio')
        .delete()
        .eq('id', promptId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to delete prompt: ${error.message}`);
      }

      set(state => ({
        prompts: state.prompts.filter(p => p.id !== promptId),
        currentPrompt: state.currentPrompt?.id === promptId ? null : state.currentPrompt
      }));

      toast.success('Prompt deleted successfully!');
    } catch (error) {
      console.error('Delete prompt error:', error);
      toast.error(error.message || 'Failed to delete prompt');
      throw error;
    }
  },

  fetchUserPrompts: async (userId) => {
    try {
      set({ loading: true });
      console.log('📋 Fetching user prompts for:', userId);

      const { data, error } = await supabase
        .from('prompts_ai_studio')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        // Don't throw error, just log it and return empty array
        console.log('Failed to fetch user prompts:', error.message);
        set({ prompts: [], loading: false });
        return [];
      }

      set({ prompts: data || [], loading: false });
      return data || [];
    } catch (error) {
      set({ loading: false });
      console.error('Fetch user prompts error:', error);
      return [];
    }
  },

  fetchPublicPrompts: async () => {
    try {
      set({ loading: true });
      console.log('🌐 Fetching public prompts...');

      const { data, error } = await supabase
        .from('prompts_ai_studio')
        .select('*')
        .eq('is_public', true)
        .order('views', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        // Don't throw error, just log it and return empty array
        console.log('Failed to fetch public prompts:', error.message);
        set({ prompts: [], loading: false });
        return [];
      }

      set({ prompts: data || [], loading: false });
      return data || [];
    } catch (error) {
      set({ loading: false });
      console.error('Fetch public prompts error:', error);
      return [];
    }
  },

  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

  enhancePrompt: async (content) => {
    try {
      set({ enhancing: true });
      console.log('🤖 Starting prompt enhancement...');
      console.log('Content to enhance:', content.substring(0, 100) + '...');

      const result = await openaiService.enhancePrompt(content);
      
      set({ enhancing: false });
      console.log('✅ Enhancement completed successfully');
      toast.success('Prompt enhanced successfully!');
      
      return result;
    } catch (error) {
      set({ enhancing: false });
      console.error('❌ Enhancement failed:', error);
      
      // Provide specific error messages
      if (error.message.includes('API key not configured')) {
        toast.error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your environment variables.');
      } else if (error.message.includes('Invalid OpenAI API key')) {
        toast.error('Invalid OpenAI API key. Please check your VITE_OPENAI_API_KEY.');
      } else if (error.message.includes('rate limit')) {
        toast.error('OpenAI API rate limit exceeded. Please try again in a few minutes.');
      } else if (error.message.includes('Network error')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error('Failed to enhance prompt: ' + error.message);
      }
      
      throw error;
    }
  },

  generatePromptIdeas: async (topic, category) => {
    try {
      console.log('💡 Generating prompt ideas for:', topic);
      return await openaiService.generatePromptIdeas(topic, category);
    } catch (error) {
      toast.error('Failed to generate ideas: ' + error.message);
      console.error(error);
      throw error;
    }
  }
}));