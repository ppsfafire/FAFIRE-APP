import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskState, Category } from '../types';

interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; task: Task } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload.task : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Trabalho', color: '#FF6B6B', icon: '💼' },
  { id: '2', name: 'Pessoal', color: '#4ECDC4', icon: '👤' },
  { id: '3', name: 'Estudo', color: '#45B7D1', icon: '📚' },
  { id: '4', name: 'Saúde', color: '#96CEB4', icon: '🏥' },
  { id: '5', name: 'Lazer', color: '#FFEAA7', icon: '🎮' },
];

const initialState: TaskState = {
  tasks: [],
  categories: defaultCategories,
  isLoading: true,
  error: null,
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedTasks, storedCategories] = await Promise.all([
        AsyncStorage.getItem('@tasks'),
        AsyncStorage.getItem('@categories'),
      ]);

      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        dispatch({ type: 'SET_TASKS', payload: tasks });
      }

      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveTasks = async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const saveCategories = async (categories: Category[]) => {
    try {
      await AsyncStorage.setItem('@categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_TASK', payload: newTask });
      await saveTasks([...state.tasks, newTask]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao adicionar tarefa' });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = state.tasks.find(task => task.id === id);
      if (!updatedTask) return;

      const task = { ...updatedTask, ...updates, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_TASK', payload: { id, task } });
      
      const newTasks = state.tasks.map(t => t.id === id ? task : t);
      await saveTasks(newTasks);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar tarefa' });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_TASK', payload: id });
      const newTasks = state.tasks.filter(task => task.id !== id);
      await saveTasks(newTasks);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar tarefa' });
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return;

      const updatedTask = { ...task, completed: !task.completed, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_TASK', payload: { id, task: updatedTask } });
      
      const newTasks = state.tasks.map(t => t.id === id ? updatedTask : t);
      await saveTasks(newTasks);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao alternar tarefa' });
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
      };

      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      await saveCategories([...state.categories, newCategory]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao adicionar categoria' });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
      const newCategories = state.categories.filter(cat => cat.id !== id);
      await saveCategories(newCategories);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar categoria' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: TaskContextType = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addCategory,
    deleteCategory,
    clearError,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask deve ser usado dentro de um TaskProvider');
  }
  return context;
}; 