import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Whitelisted admin email from project setup
export const MASTER_ADMIN_EMAIL = 'socialacc718@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const isEmailAdmin = currentUser.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

          // Check if admin document exists in Firestore
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          let adminDoc;
          try {
            adminDoc = await getDoc(adminDocRef);
          } catch (err) {
            console.warn('Admin check lookup note:', err);
          }

          if (isEmailAdmin) {
            setIsAdmin(true);
            // Ensure record in admins collection exists for rule check
            if (!adminDoc?.exists()) {
              try {
                await setDoc(adminDocRef, {
                  email: currentUser.email,
                  role: 'superadmin',
                  createdAt: new Date().toISOString()
                });
              } catch (writeErr) {
                console.warn('Could not auto-write admin doc:', writeErr);
              }
            }
          } else if (adminDoc?.exists()) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          console.error('Error verifying admin authorization:', e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
