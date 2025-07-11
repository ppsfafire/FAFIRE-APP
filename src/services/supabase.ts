import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Task, Category } from '../types';

// Configuração do Supabase
// Credenciais do projeto acadêmico
const supabaseUrl = 'https://jqrjcnxwdsrojflxtiii.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxcmpjbnh3ZHNyb2pmbHh0aWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTcwMjEsImV4cCI6MjA2NjY3MzAyMX0.wXxAc1aVH_xF3rbhbGXo2bOy2M5jmmXQnZgEyLcb50U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tipos para o Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description?: string;
          completed: boolean;
          priority: 'low' | 'medium' | 'high';
          due_date?: string;
          category_id: string;
          user_id: string;
          image_url?: string;
          location_lat?: number;
          location_lng?: number;
          location_address?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string;
          category_id: string;
          user_id: string;
          image_url?: string;
          location_lat?: number;
          location_lng?: number;
          location_address?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string;
          category_id?: string;
          user_id?: string;
          image_url?: string;
          location_lat?: number;
          location_lng?: number;
          location_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          icon: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          icon: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          icon?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Serviços de Autenticação
export const authService = {
  // Login com email e senha
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    // Log da sessão após login
    const session = await supabase.auth.getSession();
    console.log('Sessão após login:', session);
    return data.user;
  },

  // Registro com email e senha
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) throw error;
    return data.user;
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Atualizar perfil
  async updateProfile(updates: { name?: string; avatar_url?: string }) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });
    
    if (error) throw error;
    return data.user;
  },

  // Escutar mudanças de autenticação
  onAuthStateChange(callback: (user: any | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  },
};

// Serviços de Tarefas
export const taskService = {
  // Buscar todas as tarefas do usuário
  async getTasks(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Criar nova tarefa
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    // Log da sessão antes do insert
    const session = await supabase.auth.getSession();
    console.log('Sessão antes do insert:', session);
    const token = session.data.session?.access_token;
    console.log('Token JWT:', token);
    const insertObj = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      due_date: task.dueDate?.toISOString(),
      category_id: task.category,
      user_id: task.userId,
      image_url: task.image,
      location_lat: task.location?.latitude,
      location_lng: task.location?.longitude,
      location_address: task.location?.address,
    };
    console.log('user_id enviado:', task.userId);
    console.log('Objeto enviado para o insert:', insertObj);
    // Forçar envio do token JWT
    const supabaseWithToken = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
    const { data, error } = await supabaseWithToken
      .from('tasks')
      .insert(insertObj)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Atualizar tarefa
  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        completed: updates.completed,
        priority: updates.priority,
        due_date: updates.dueDate?.toISOString(),
        category_id: updates.category,
        image_url: updates.image,
        location_lat: updates.location?.latitude,
        location_lng: updates.location?.longitude,
        location_address: updates.location?.address,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar tarefa
  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Escutar mudanças em tempo real
  subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
    return supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Recarregar tarefas quando houver mudanças
          this.getTasks(userId).then(callback);
        }
      )
      .subscribe();
  },
};

// Serviços de Categorias
export const categoryService = {
  // Buscar categorias do usuário
  async getCategories(userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Criar categoria
  async createCategory(category: Omit<Category, 'id'> & { userId: string }) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        color: category.color,
        icon: category.icon,
        user_id: category.userId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar categoria
  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Serviços de Storage
export const storageService = {
  // Upload de imagem
  async uploadImage(file: File, userId: string): Promise<string> {
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('task-images')
      .upload(fileName, file);
    
    if (error) throw error;
    
    // Retornar URL pública
    const { data: urlData } = supabase.storage
      .from('task-images')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  },

  // Deletar imagem
  async deleteImage(fileName: string) {
    const { error } = await supabase.storage
      .from('task-images')
      .remove([fileName]);
    
    if (error) throw error;
  },
};

// Serviços de Notificações (preparado para implementação futura)
export const notificationService = {
  // Enviar notificação push
  async sendNotification(userId: string, title: string, body: string) {
    // Implementar com serviço de notificações push
    console.log('Enviando notificação:', { userId, title, body });
  },

  // Agendar notificação
  async scheduleNotification(userId: string, title: string, body: string, scheduledAt: Date) {
    // Implementar agendamento de notificações
    console.log('Agendando notificação:', { userId, title, body, scheduledAt });
  },
}; 