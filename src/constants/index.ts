// Cores do tema
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Cores de fundo
  background: '#F2F2F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Cores de texto
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  
  // Cores de status
  pending: '#FF9500',
  inProgress: '#007AFF',
  completed: '#34C759',
  cancelled: '#FF3B30',
  
  // Cores de categoria
  work: '#FF9500',
  personal: '#34C759',
  health: '#FF3B30',
  education: '#5856D6',
  finance: '#FF9500',
  entertainment: '#AF52DE',
};

// Tamanhos e espaçamentos
export const SIZES = {
  // Tamanhos de fonte
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Espaçamentos
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Bordas
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  
  // Sombras
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

// Strings do app
export const STRINGS = {
  // Títulos
  appName: 'FAFIRE Task Manager',
  home: 'Início',
  tasks: 'Tarefas',
  categories: 'Categorias',
  profile: 'Perfil',
  addTask: 'Nova Tarefa',
  taskDetail: 'Detalhes da Tarefa',
  
  // Autenticação
  login: 'Entrar',
  register: 'Cadastrar',
  logout: 'Sair',
  email: 'E-mail',
  password: 'Senha',
  confirmPassword: 'Confirmar Senha',
  forgotPassword: 'Esqueci minha senha',
  
  // Tarefas
  taskTitle: 'Título da Tarefa',
  taskDescription: 'Descrição',
  taskCategory: 'Categoria',
  taskPriority: 'Prioridade',
  taskDueDate: 'Data de Vencimento',
  taskStatus: 'Status',
  taskLocation: 'Localização',
  taskImage: 'Imagem',
  
  // Status
  pending: 'Pendente',
  inProgress: 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
  
  // Prioridades
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
  
  // Categorias
  work: 'Trabalho',
  personal: 'Pessoal',
  health: 'Saúde',
  education: 'Educação',
  finance: 'Finanças',
  entertainment: 'Entretenimento',
  
  // Mensagens
  noTasks: 'Nenhuma tarefa encontrada',
  noCategories: 'Nenhuma categoria encontrada',
  loading: 'Carregando...',
  error: 'Erro',
  success: 'Sucesso',
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  save: 'Salvar',
  delete: 'Excluir',
  edit: 'Editar',
  
  // Validações
  required: 'Campo obrigatório',
  invalidEmail: 'E-mail inválido',
  passwordMismatch: 'Senhas não coincidem',
  minLength: 'Mínimo de caracteres não atingido',
};

// Configurações da API
export const API_CONFIG = {
  // Weather API
  weatherApiKey: 'YOUR_WEATHER_API_KEY',
  weatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
  
  // Supabase
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  
  // Timeouts
  timeout: 10000,
  retryAttempts: 3,
};

// Configurações do app
export const APP_CONFIG = {
  // Storage keys
  storageKeys: {
    userToken: 'user_token',
    userData: 'user_data',
    settings: 'app_settings',
    theme: 'app_theme',
  },
  
  // Limites
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxTasksPerUser: 1000,
  maxCategoriesPerUser: 50,
  
  // Cache
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 horas
  
  // Geolocalização
  locationTimeout: 10000,
  locationAccuracy: 10, // metros
};

// Configurações de notificações
export const NOTIFICATION_CONFIG = {
  // IDs de canais
  channels: {
    taskReminder: 'task-reminder',
    taskDue: 'task-due',
    general: 'general',
  },
  
  // Configurações de som
  sounds: {
    taskReminder: 'task_reminder.wav',
    taskDue: 'task_due.wav',
  },
  
  // Configurações de vibração
  vibration: {
    short: 100,
    medium: 300,
    long: 500,
  },
}; 