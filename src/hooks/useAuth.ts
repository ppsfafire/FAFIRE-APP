import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { User } from '../types';

/**
 * Hook customizado que estende o contexto de autenticação do Supabase
 * com funcionalidades adicionais como reset de senha e validações
 */
export const useAuth = () => {
  const authContext = useSupabaseAuth();
  const [error, setError] = useState<string | null>(null);

  // Redefinir senha
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'fafire-app://reset-password',
      });

      if (resetError) {
        setError(resetError.message);
        Alert.alert('Erro', resetError.message);
        return false;
      }

      Alert.alert(
        'Sucesso',
        'Email de redefinição de senha enviado! Verifique sua caixa de entrada.'
      );
      return true;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError('Erro interno ao redefinir senha');
      Alert.alert('Erro', 'Erro interno ao redefinir senha');
      return false;
    }
  };

  // Login com validação
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      await authContext.login(email, password);
      return true;
    } catch (error: any) {
      setError(error.message);
      Alert.alert('Erro', error.message);
      return false;
    }
  };

  // Registro com validação
  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setError(null);
      await authContext.register(name, email, password);
      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Verifique seu email para confirmar a conta.'
      );
      return true;
    } catch (error: any) {
      setError(error.message);
      Alert.alert('Erro', error.message);
      return false;
    }
  };

  // Logout com limpeza
  const signOut = async (): Promise<void> => {
    try {
      await authContext.logout();
      setError(null);
    } catch (error: any) {
      setError(error.message);
      Alert.alert('Erro', error.message);
    }
  };

  return {
    // Estado do contexto
    user: authContext.user,
    loading: authContext.isLoading,
    isAuthenticated: authContext.isAuthenticated,
    
    // Erro local
    error,
    
    // Métodos do contexto
    login: authContext.login,
    register: authContext.register,
    logout: authContext.logout,
    updateProfile: authContext.updateProfile,
    
    // Métodos estendidos
    signIn,
    signUp,
    signOut,
    resetPassword,
    
    // Utilitários
    clearError: () => setError(null),
  };
}; 