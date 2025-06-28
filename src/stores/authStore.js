import { create } from 'zustand';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "ai-prompt-studio.firebaseapp.com",
  projectId: "ai-prompt-studio",
  storageBucket: "ai-prompt-studio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  subscription: null,

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...userData
          },
          loading: false
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        subscription: 'free'
      }, { merge: true });
      
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error('Failed to sign in with Google');
      console.error(error);
    }
  },

  signInWithGithub: async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        subscription: 'free'
      }, { merge: true });
      
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error('Failed to sign in with GitHub');
      console.error(error);
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      set({ user: null, subscription: null });
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
    }
  }
}));