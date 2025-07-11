import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { COLORS, STRINGS } from '../constants';

// ===== FUNÇÕES DE FORMATAÇÃO =====

/**
 * Formata uma data para exibição
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formata uma data e hora para exibição
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formata uma data relativa (ex: "há 2 dias")
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
  return `Há ${Math.floor(diffDays / 365)} anos`;
};

/**
 * Formata um número de telefone
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Formata um valor monetário
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ===== FUNÇÕES DE VALIDAÇÃO =====

/**
 * Valida se um email é válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se uma senha é forte
 */
export const isStrongPassword = (password: string): boolean => {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Valida se um campo está preenchido
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida se um valor está dentro de um intervalo
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// ===== FUNÇÕES DE STORAGE =====

/**
 * Salva dados no AsyncStorage
 */
export const saveToStorage = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar no storage:', error);
    throw error;
  }
};

/**
 * Recupera dados do AsyncStorage
 */
export const getFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Erro ao recuperar do storage:', error);
    return null;
  }
};

/**
 * Remove dados do AsyncStorage
 */
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Erro ao remover do storage:', error);
    throw error;
  }
};

/**
 * Limpa todo o AsyncStorage
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Erro ao limpar storage:', error);
    throw error;
  }
};

// ===== FUNÇÕES DE IMAGEM =====

/**
 * Seleciona uma imagem da galeria
 */
export const pickImage = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Erro ao selecionar imagem:', error);
    return null;
  }
};

/**
 * Tira uma foto com a câmera
 */
export const takePhoto = async (): Promise<string | null> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para câmera é necessária!');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Erro ao tirar foto:', error);
    return null;
  }
};

// ===== FUNÇÕES DE LOCALIZAÇÃO =====

/**
 * Obtém a localização atual do usuário
 */
export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
  address?: string;
} | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para localização é necessária!');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;

    // Tenta obter o endereço
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const addressString = [
          address.street,
          address.streetNumber,
          address.district,
          address.city,
          address.region,
        ]
          .filter(Boolean)
          .join(', ');

        return { latitude, longitude, address: addressString };
      }
    } catch (error) {
      console.warn('Erro ao obter endereço:', error);
    }

    return { latitude, longitude };
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    return null;
  }
};

// ===== FUNÇÕES DE COR =====

/**
 * Obtém a cor baseada no status da tarefa
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'pendente':
      return COLORS.pending;
    case 'inprogress':
    case 'em andamento':
      return COLORS.inProgress;
    case 'completed':
    case 'concluída':
      return COLORS.completed;
    case 'cancelled':
    case 'cancelada':
      return COLORS.cancelled;
    default:
      return COLORS.textSecondary;
  }
};

/**
 * Obtém a cor baseada na prioridade da tarefa
 */
export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'low':
    case 'baixa':
      return COLORS.success;
    case 'medium':
    case 'média':
      return COLORS.warning;
    case 'high':
    case 'alta':
      return COLORS.error;
    case 'urgent':
    case 'urgente':
      return '#FF0000';
    default:
      return COLORS.textSecondary;
  }
};

/**
 * Obtém a cor baseada na categoria
 */
export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'work':
    case 'trabalho':
      return COLORS.work;
    case 'personal':
    case 'pessoal':
      return COLORS.personal;
    case 'health':
    case 'saúde':
      return COLORS.health;
    case 'education':
    case 'educação':
      return COLORS.education;
    case 'finance':
    case 'finanças':
      return COLORS.finance;
    case 'entertainment':
    case 'entretenimento':
      return COLORS.entertainment;
    default:
      return COLORS.primary;
  }
};

// ===== FUNÇÕES DE PLATAFORMA =====

/**
 * Verifica se está rodando no iOS
 */
export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * Verifica se está rodando no Android
 */
export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

/**
 * Obtém o padding seguro para a plataforma
 */
export const getSafeAreaPadding = (): number => {
  return isIOS() ? 44 : 24;
};

// ===== FUNÇÕES DE DEBOUNCE =====

/**
 * Cria uma função com debounce
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ===== FUNÇÕES DE THROTTLE =====

/**
 * Cria uma função com throttle
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ===== FUNÇÕES DE ARRAY =====

/**
 * Agrupa um array por uma propriedade
 */
export const groupBy = <T>(
  array: T[],
  key: keyof T
): { [key: string]: T[] } => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as { [key: string]: T[] });
};

/**
 * Remove duplicatas de um array
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Ordena um array por uma propriedade
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// ===== FUNÇÕES DE STRING =====

/**
 * Capitaliza a primeira letra de uma string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca uma string se for muito longa
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Remove acentos de uma string
 */
export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// ===== FUNÇÕES DE DATA =====

/**
 * Verifica se uma data é hoje
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Verifica se uma data é amanhã
 */
export const isTomorrow = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    dateObj.getDate() === tomorrow.getDate() &&
    dateObj.getMonth() === tomorrow.getMonth() &&
    dateObj.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Verifica se uma data está atrasada
 */
export const isOverdue = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return dateObj < now;
}; 