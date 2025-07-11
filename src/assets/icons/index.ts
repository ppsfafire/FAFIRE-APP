// Ícones do app - usando nomes descritivos para facilitar o uso
export const ICONS = {
  // Navegação
  home: 'home',
  tasks: 'list',
  categories: 'folder',
  profile: 'person',
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  close: 'close',
  back: 'arrow-back',
  
  // Status de tarefas
  pending: 'schedule',
  inProgress: 'play-arrow',
  completed: 'check-circle',
  cancelled: 'cancel',
  
  // Prioridades
  low: 'low-priority',
  medium: 'medium-priority',
  high: 'high-priority',
  urgent: 'priority-high',
  
  // Categorias
  work: 'work',
  personal: 'person',
  health: 'favorite',
  education: 'school',
  finance: 'account-balance-wallet',
  entertainment: 'movie',
  
  // Ações
  camera: 'camera-alt',
  gallery: 'photo-library',
  location: 'location-on',
  calendar: 'calendar-today',
  search: 'search',
  filter: 'filter-list',
  sort: 'sort',
  refresh: 'refresh',
  share: 'share',
  download: 'download',
  upload: 'upload',
  
  // Interface
  menu: 'menu',
  settings: 'settings',
  notifications: 'notifications',
  help: 'help',
  info: 'info',
  warning: 'warning',
  error: 'error',
  success: 'check-circle',
  
  // Autenticação
  login: 'login',
  logout: 'logout',
  register: 'person-add',
  password: 'lock',
  email: 'email',
  visibility: 'visibility',
  visibilityOff: 'visibility-off',
  
  // Utilitários
  clock: 'access-time',
  date: 'event',
  time: 'schedule',
  description: 'description',
  title: 'title',
  category: 'category',
  priority: 'priority-high',
  status: 'flag',
  image: 'image',
  attachment: 'attach-file',
  link: 'link',
  star: 'star',
  favorite: 'favorite',
  bookmark: 'bookmark',
  archive: 'archive',
  restore: 'restore-from-trash',
  duplicate: 'content-copy',
  export: 'file-download',
  import: 'file-upload',
  sync: 'sync',
  cloud: 'cloud',
  offline: 'cloud-off',
  online: 'cloud-done',
} as const;

export type IconName = keyof typeof ICONS; 