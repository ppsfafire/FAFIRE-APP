import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/supabase';
import { User, AuthState } from '../types';

interface SupabaseAuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Verificar usuário atual ao inicializar
    checkCurrentUser();
    
    // Escutar mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (user) {
        const userData: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
          avatar: user.user_metadata?.avatar_url,
          createdAt: new Date(user.created_at),
        };
        dispatch({ type: 'SET_USER', payload: userData });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const userData: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
          avatar: user.user_metadata?.avatar_url,
          createdAt: new Date(user.created_at),
        };
        dispatch({ type: 'SET_USER', payload: userData });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    } catch (error: any) {
      // Se for erro de sessão ausente, apenas defina usuário como null
      if (error.name === 'AuthSessionMissingError' || error.message?.includes('Auth session missing')) {
        dispatch({ type: 'SET_USER', payload: null });
      } else {
        console.error('Erro ao verificar usuário atual:', error);
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.signIn(email, password);
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.signUp(email, password, name);
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updates: any = {};
      if (userData.name) updates.name = userData.name;
      if (userData.avatar) updates.avatar_url = userData.avatar;
      
      await authService.updateProfile(updates);
      dispatch({ type: 'UPDATE_USER', payload: userData });
    } catch (error) {
      throw new Error('Erro ao atualizar perfil');
    }
  };

  const value: SupabaseAuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth deve ser usado dentro de um SupabaseAuthProvider');
  }
  return context;
}; 