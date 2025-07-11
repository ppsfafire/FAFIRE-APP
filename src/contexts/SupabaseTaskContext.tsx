import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { taskService, categoryService } from '../services/supabase';
import { Task, Category, TaskState } from '../types';
import { useSupabaseAuth } from './SupabaseAuthContext';

interface SupabaseTaskContextType extends TaskState {
  // Tarefas
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  
  // Categorias
  addCategory: (category: Omit<Category, 'id'> & { userId: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Filtros
  setFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

const SupabaseTaskContext = createContext<SupabaseTaskContextType | undefined>(undefined);

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_FILTERS' };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'CLEAR_FILTERS':
      return { ...state, filter: 'all', searchQuery: '' };
    default:
      return state;
  }
};

const initialState: TaskState = {
  tasks: [],
  categories: [],
  isLoading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
};

export const SupabaseTaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { user } = useSupabaseAuth();

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadInitialData();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Carregar tarefas e categorias em paralelo
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getTasks(user.id),
        categoryService.getCategories(user.id),
      ]);

      // Converter dados do Supabase para o formato do app
      const tasks: Task[] = tasksData.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        category: task.category_id,
        userId: task.user_id,
        image: task.image_url,
        location: task.location_lat && task.location_lng ? {
          latitude: task.location_lat,
          longitude: task.location_lng,
          address: task.location_address,
        } : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
      }));

      const categories: Category[] = categoriesData.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        userId: cat.user_id,
      }));

      dispatch({ type: 'SET_TASKS', payload: tasks });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    // Inscrever para mudanças em tempo real
    const subscription = taskService.subscribeToTasks(user.id, (tasksData) => {
      const tasks: Task[] = tasksData.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        category: task.category_id,
        userId: task.user_id,
        image: task.image_url,
        location: task.location_lat && task.location_lng ? {
          latitude: task.location_lat,
          longitude: task.location_lng,
          address: task.location_address,
        } : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
      }));

      dispatch({ type: 'SET_TASKS', payload: tasks });
    });

    return () => subscription.unsubscribe();
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const newTask = await taskService.createTask(taskData);
      const task: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        completed: newTask.completed,
        priority: newTask.priority,
        dueDate: newTask.due_date ? new Date(newTask.due_date) : undefined,
        category: newTask.category_id,
        userId: newTask.user_id,
        image: newTask.image_url,
        location: newTask.location_lat && newTask.location_lng ? {
          latitude: newTask.location_lat,
          longitude: newTask.location_lng,
          address: newTask.location_address,
        } : undefined,
        createdAt: new Date(newTask.created_at),
        updatedAt: new Date(newTask.updated_at),
      };
      // Não faz dispatch local, força reload do banco
      await loadInitialData();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(id, updates);
      await loadInitialData();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await loadInitialData();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  };

  const toggleTask = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    try {
      await updateTask(id, { completed: !task.completed });
    } catch (error) {
      console.error('Erro ao alternar tarefa:', error);
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'> & { userId: string }) => {
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      
      const category: Category = {
        id: newCategory.id,
        name: newCategory.name,
        color: newCategory.color,
        icon: newCategory.icon,
        userId: newCategory.user_id,
      };

      dispatch({ type: 'ADD_CATEGORY', payload: category });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  };

  const setFilter = (filter: string) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const value: SupabaseTaskContextType = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addCategory,
    deleteCategory,
    setFilter,
    setSearchQuery,
    clearFilters,
  };

  return (
    <SupabaseTaskContext.Provider value={value}>
      {children}
    </SupabaseTaskContext.Provider>
  );
};

export const useSupabaseTasks = () => {
  const context = useContext(SupabaseTaskContext);
  if (context === undefined) {
    throw new Error('useSupabaseTasks deve ser usado dentro de um SupabaseTaskProvider');
  }
  return context;
}; 