import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { Task } from '../types';
import { formatDate, isOverdue } from '../utils';

export interface TaskFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  search?: string;
  dueDate?: Date;
}

export interface UseTasksReturn {
  // Estado
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filteredTasks: Task[];
  
  // Métodos CRUD
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompleted: (id: string) => Promise<boolean>;
  
  // Filtros
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  
  // Estatísticas
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  
  // Utilitários
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

export const useTasks = (): UseTasksReturn => {
  const { user } = useSupabaseAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  // Carregar tarefas
  const loadTasks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Converter dados do Supabase para o formato do app
      const convertedTasks: Task[] = (data || []).map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        category: task.category || 'Geral',
        location: task.location,
        image: task.image,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        userId: task.user_id,
      }));

      setTasks(convertedTasks);
    } catch (err: any) {
      console.error('Erro ao carregar tarefas:', err);
      setError(err.message || 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar tarefas na inicialização
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Escutar mudanças em tempo real
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadTasks]);

  // Aplicar filtros
  const filteredTasks = tasks.filter((task) => {
    // Filtro por status de conclusão
    if (filters.completed !== undefined && task.completed !== filters.completed) {
      return false;
    }

    // Filtro por prioridade
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Filtro por categoria
    if (filters.category && task.category !== filters.category) {
      return false;
    }

    // Filtro por busca (título e descrição)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description?.toLowerCase().includes(searchLower);
      if (!titleMatch && !descriptionMatch) {
        return false;
      }
    }

    // Filtro por data de vencimento
    if (filters.dueDate && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      const filterDate = new Date(filters.dueDate);
      if (taskDate.toDateString() !== filterDate.toDateString()) {
        return false;
      }
    }

    return true;
  });

  // Calcular estatísticas
  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
    overdue: tasks.filter((task) => task.dueDate && isOverdue(task.dueDate)).length,
  };

  // Criar tarefa
  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      setError(null);

      const newTask = {
        title: taskData.title,
        description: taskData.description,
        completed: taskData.completed || false,
        priority: taskData.priority,
        due_date: taskData.dueDate?.toISOString(),
        category: taskData.category,
        location: taskData.location,
        image: taskData.image,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('tasks')
        .insert([newTask]);

      if (insertError) {
        throw insertError;
      }

      Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao criar tarefa:', err);
      setError(err.message || 'Erro ao criar tarefa');
      Alert.alert('Erro', err.message || 'Erro ao criar tarefa');
      return false;
    }
  };

  // Atualizar tarefa
  const updateTask = async (id: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      setError(null);

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString();
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.image !== undefined) updateData.image = updates.image;

      const { error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar tarefa:', err);
      setError(err.message || 'Erro ao atualizar tarefa');
      Alert.alert('Erro', err.message || 'Erro ao atualizar tarefa');
      return false;
    }
  };

  // Deletar tarefa
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (deleteError) {
        throw deleteError;
      }

      Alert.alert('Sucesso', 'Tarefa excluída com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar tarefa:', err);
      setError(err.message || 'Erro ao deletar tarefa');
      Alert.alert('Erro', err.message || 'Erro ao deletar tarefa');
      return false;
    }
  };

  // Alternar status de conclusão da tarefa
  const toggleTaskCompleted = async (id: string): Promise<boolean> => {
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      setError('Tarefa não encontrada');
      return false;
    }

    return updateTask(id, { completed: !task.completed });
  };

  // Atualizar filtros
  const updateFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({});
  };

  // Recarregar tarefas
  const refreshTasks = async () => {
    await loadTasks();
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  return {
    // Estado
    tasks,
    loading,
    error,
    filteredTasks,
    
    // Métodos CRUD
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    
    // Filtros
    filters,
    setFilters: updateFilters,
    clearFilters,
    
    // Estatísticas
    stats,
    
    // Utilitários
    refreshTasks,
    clearError,
  };
}; 