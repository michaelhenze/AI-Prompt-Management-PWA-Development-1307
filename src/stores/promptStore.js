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

      if (error) throw error;

      set(state => ({
        prompts: [...state.prompts, data],
        currentPrompt: data,
        loading: false
      }));

      toast.success('Prompt created successfully!');
      return data;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to create prompt: ' + error.message);
      console.error(error);
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

      if (error) throw error;

      set(state => ({
        prompts: state.prompts.map(p => p.id === promptId ? data : p),
        currentPrompt: state.currentPrompt?.id === promptId ? data : state.currentPrompt,
        loading: false
      }));

      toast.success('Prompt updated successfully!');
      return data;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to update prompt: ' + error.message);
      console.error(error);
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

      if (error) throw error;

      set(state => ({
        prompts: state.prompts.filter(p => p.id !== promptId),
        currentPrompt: state.currentPrompt?.id === promptId ? null : state.currentPrompt
      }));

      toast.success('Prompt deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete prompt: ' + error.message);
      console.error(error);
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

      if (error) throw error;

      set({ prompts: data || [], loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch prompts:', error);
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

      if (error) throw error;

      set({ prompts: data || [], loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch public prompts:', error);
      return [];
    }
  },

  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

  enhancePrompt: async (content) => {
    try {
      set({ enhancing: true });
      console.log('🤖 Enhancing prompt with OpenAI...');

      const result = await openaiService.enhancePrompt(content);
      
      set({ enhancing: false });
      toast.success('Prompt enhanced successfully!');
      
      return result;
    } catch (error) {
      set({ enhancing: false });
      
      if (error.message.includes('API key not configured')) {
        toast.error('AI enhancement requires OpenAI API key. Please add VITE_OPENAI_API_KEY to your environment variables.');
      } else {
        toast.error('Failed to enhance prompt: ' + error.message);
      }
      
      console.error('Enhancement error:', error);
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