import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = () => {
      const isValid = pb.authStore.isValid;
      const model = pb.authStore.model;
      
      // Ensure we only authenticate if the logged-in user is actually an admin
      if (isValid && model?.collectionName === 'admin_users') {
        setCurrentAdmin(model);
        setIsAdminAuthenticated(true);
      } else {
        setCurrentAdmin(null);
        setIsAdminAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Subscribe to PocketBase auth store changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (pb.authStore.isValid && model?.collectionName === 'admin_users') {
        setCurrentAdmin(model);
        setIsAdminAuthenticated(true);
      } else {
        setCurrentAdmin(null);
        setIsAdminAuthenticated(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('admin_users').authWithPassword(email, password, { $autoCancel: false });
      
      // Verify collection name just in case
      if (authData.record.collectionName !== 'admin_users') {
        pb.authStore.clear();
        throw new Error('Unauthorized collection access');
      }

      setCurrentAdmin(authData.record);
      setIsAdminAuthenticated(true);
      return { success: true, record: authData.record };
    } catch (error) {
      console.error('Admin login error:', error);
      pb.authStore.clear();
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentAdmin(null);
    setIsAdminAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, currentAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};