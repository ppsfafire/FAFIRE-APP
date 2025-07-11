import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { Category } from '../types';

export interface UseCategoriesReturn {
  // Estado
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Métodos CRUD
  createCategory: (categoryData: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Utilitários
  refreshCategories: () => Promise<void>;
  clearError: () => void;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryByName: (name: string) => Category | undefined;
}

export const useCategories = (): UseCategoriesReturn => {
  const { user } = useSupabaseAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar categorias
  const loadCategories = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Converter dados do Supabase para o formato do app
      const convertedCategories: Category[] = (data || []).map((category: any) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        userId: category.user_id,
      }));

      setCategories(convertedCategories);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err);
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar categorias na inicialização
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Escutar mudanças em tempo real
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('categories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadCategories();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadCategories]);

  // Criar categoria
  const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      setError(null);

      // Verificar se já existe uma categoria com o mesmo nome
      const existingCategory = categories.find(
        (cat) => cat.name.toLowerCase() === categoryData.name.toLowerCase()
      );

      if (existingCategory) {
        setError('Já existe uma categoria com este nome');
        Alert.alert('Erro', 'Já existe uma categoria com este nome');
        return false;
      }

      const newCategory = {
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('categories')
        .insert([newCategory]);

      if (insertError) {
        throw insertError;
      }

      Alert.alert('Sucesso', 'Categoria criada com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao criar categoria:', err);
      setError(err.message || 'Erro ao criar categoria');
      Alert.alert('Erro', err.message || 'Erro ao criar categoria');
      return false;
    }
  };

  // Atualizar categoria
  const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
    try {
      setError(null);

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.icon !== undefined) updateData.icon = updates.icon;

      const { error: updateError } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar categoria:', err);
      setError(err.message || 'Erro ao atualizar categoria');
      Alert.alert('Erro', err.message || 'Erro ao atualizar categoria');
      return false;
    }
  };

  // Deletar categoria
  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      // Verificar se há tarefas usando esta categoria
      const { data: tasksUsingCategory, error: checkError } = await supabase
        .from('tasks')
        .select('id')
        .eq('category', id)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (tasksUsingCategory && tasksUsingCategory.length > 0) {
        setError('Não é possível excluir uma categoria que possui tarefas');
        Alert.alert('Erro', 'Não é possível excluir uma categoria que possui tarefas');
        return false;
      }

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (deleteError) {
        throw deleteError;
      }

      Alert.alert('Sucesso', 'Categoria excluída com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar categoria:', err);
      setError(err.message || 'Erro ao deletar categoria');
      Alert.alert('Erro', err.message || 'Erro ao deletar categoria');
      return false;
    }
  };

  // Buscar categoria por ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find((category) => category.id === id);
  };

  // Buscar categoria por nome
  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Recarregar categorias
  const refreshCategories = async () => {
    await loadCategories();
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  return {
    // Estado
    categories,
    loading,
    error,
    
    // Métodos CRUD
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Utilitários
    refreshCategories,
    clearError,
    getCategoryById,
    getCategoryByName,
  };
}; 