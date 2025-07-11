export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface TaskState {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  filter: string;
  searchQuery: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
} 