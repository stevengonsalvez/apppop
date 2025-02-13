import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id?: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  date_of_birth?: string;
  marketing_email?: boolean;
  marketing_notifications?: boolean;
}

interface UserContextType {
  profile: UserProfile | null;
  user: User | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  updateUserInContext: (updatedProfile: UserProfile) => void;
  fetchUserProfile: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserInContext = (updatedProfile: UserProfile) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const fetchUserProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, date_of_birth, marketing_email, marketing_notifications')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== '406') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
      setUser(currentUser);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ 
      profile, 
      user,
      setProfile, 
      fetchUserProfile,
      updateUserInContext,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};