import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from './authStore';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const usePromptStore = create((set, get) => ({
  prompts: [],
  currentPrompt: null,
  loading: false,
  
  createPrompt: async (promptData, userId) => {
    try {
      set({ loading: true });
      
      const newPrompt = {
        ...promptData,
        id: uuidv4(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0,
        shares: 0,
        isPublic: false,
        tags: promptData.tags || [],
        versions: [{ ...promptData, version: 1, createdAt: new Date() }]
      };
      
      const docRef = await addDoc(collection(db, 'prompts'), newPrompt);
      newPrompt.firestoreId = docRef.id;
      
      set(state => ({
        prompts: [...state.prompts, newPrompt],
        currentPrompt: newPrompt,
        loading: false
      }));
      
      toast.success('Prompt created successfully!');
      return newPrompt;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to create prompt');
      console.error(error);
    }
  },
  
  updatePrompt: async (promptId, updates) => {
    try {
      set({ loading: true });
      
      const promptRef = doc(db, 'prompts', promptId);
      await updateDoc(promptRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      set(state => ({
        prompts: state.prompts.map(p => 
          p.firestoreId === promptId ? { ...p, ...updates } : p
        ),
        currentPrompt: state.currentPrompt?.firestoreId === promptId 
          ? { ...state.currentPrompt, ...updates } 
          : state.currentPrompt,
        loading: false
      }));
      
      toast.success('Prompt updated successfully!');
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to update prompt');
      console.error(error);
    }
  },
  
  deletePrompt: async (promptId) => {
    try {
      await deleteDoc(doc(db, 'prompts', promptId));
      
      set(state => ({
        prompts: state.prompts.filter(p => p.firestoreId !== promptId),
        currentPrompt: state.currentPrompt?.firestoreId === promptId ? null : state.currentPrompt
      }));
      
      toast.success('Prompt deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete prompt');
      console.error(error);
    }
  },
  
  fetchUserPrompts: async (userId) => {
    try {
      set({ loading: true });
      
      const q = query(
        collection(db, 'prompts'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const prompts = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id
      }));
      
      set({ prompts, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch prompts');
      console.error(error);
    }
  },
  
  fetchPublicPrompts: async () => {
    try {
      set({ loading: true });
      
      const q = query(
        collection(db, 'prompts'),
        where('isPublic', '==', true),
        orderBy('views', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const prompts = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id
      }));
      
      set({ prompts, loading: false });
      return prompts;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch public prompts');
      console.error(error);
      return [];
    }
  },
  
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  
  enhancePrompt: async (content) => {
    try {
      // Simulate AI enhancement - replace with actual OpenAI API call
      const enhancedContent = `Enhanced: ${content}\n\nThis prompt has been optimized for better clarity and effectiveness.`;
      
      return {
        enhanced: enhancedContent,
        suggestions: [
          'Consider adding more specific context',
          'Include examples for better results',
          'Specify the desired output format'
        ]
      };
    } catch (error) {
      toast.error('Failed to enhance prompt');
      console.error(error);
    }
  }
}));