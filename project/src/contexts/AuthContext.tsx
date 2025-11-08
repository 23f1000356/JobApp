import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../lib/api';
import { Profile } from '../lib/supabase';

type AuthContextType = {
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check for stored token and userId
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      loadProfile(userId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const res = await api.get(`/users/${userId}`);
      // backend returns { user, posts }
      const user = res.data.user || res.data;
      
      // Map _id to id if needed (backend uses MongoDB _id)
      if (user._id && !user.id) {
        user.id = user._id;
      }
      
      setProfile(user);
      return user;
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
      return null;
    }
  };

  const signUp = async (email: string, password: string, name: string, username: string) => {
    try {
      console.log('Attempting registration:', { email, name, username });
      
      // Basic client-side validation
      if (!email || !password || !name || !username) {
        return { error: { message: 'All fields are required' } };
      }

      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters long' } };
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return { error: { message: 'Username can only contain letters, numbers, and underscores' } };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: { message: 'Please provide a valid email address' } };
      }

      const res = await api.post('/auth/register', { 
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password
      });
      
      console.log('Registration response:', res.data);
      
      const data = res.data;
      
      if (data && data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data._id || data.id);
        
        // Load the user profile
        const profile = await loadProfile(data._id || data.id);
        if (!profile) {
          console.error('Profile not found after registration');
          return { 
            error: { 
              message: 'Registration successful, but there was an issue loading your profile. Please log in.' 
            } 
          };
        }
        
        return { error: null };
      }
      
      // Handle case where server returns success: false
      if (data && data.success === false) {
        return { error: { message: data.message || 'Registration failed. Please try again.' } };
      }
      
      throw new Error('Unexpected response from server');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An error occurred during registration. Please try again.';
      
      return { 
        error: { 
          message: errorMessage,
          details: error.response?.data?.details
        } 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      
      const data = res.data;
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data._id || data.id);
        const profile = await loadProfile(data._id || data.id);
        
        if (!profile) {
          throw new Error('Failed to load user profile');
        }
        
        return { error: null };
      }
      throw new Error('Invalid response from server');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return { 
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return { error: new Error('No user logged in') };

    try {
      const res = await api.put(`/users/${userId}`, updates);
      setProfile(res.data);
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
