// Imagens do app - placeholders para imagens que serão adicionadas
export const IMAGES = {
  // Placeholders
  placeholder: require('./placeholder.png'),
  avatar: require('./avatar.png'),
  logo: require('./logo.png'),
  unifafireLogo: require('./unifafire-logo.png'),
  
  // Ilustrações
  emptyTasks: require('./empty-tasks.png'),
  emptyCategories: require('./empty-categories.png'),
  noResults: require('./no-results.png'),
  success: require('./success.png'),
  
  // Categorias
  work: require('./categories/work.png'),
  personal: require('./categories/personal.png'),
  health: require('./categories/health.png'),
  education: require('./categories/education.png'),
  finance: require('./categories/finance.png'),
  entertainment: require('./categories/entertainment.png'),
  
  // Backgrounds
  background: require('./background.png'),
  pattern: require('./pattern.png'),
  
  // Onboarding
  onboarding1: require('./onboarding/onboarding1.png'),
  onboarding2: require('./onboarding/onboarding2.png'),
  onboarding3: require('./onboarding/onboarding3.png'),
} as const;

export type ImageName = keyof typeof IMAGES; 