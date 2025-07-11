// Fontes do app - configuração para fontes customizadas
export const FONTS = {
  // Fontes principais
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  
  // Fontes alternativas
  light: 'Inter-Light',
  thin: 'Inter-Thin',
  extraBold: 'Inter-ExtraBold',
  black: 'Inter-Black',
  
  // Fontes para ícones
  icon: 'MaterialIcons',
  iconOutlined: 'MaterialIcons-Outlined',
  iconRound: 'MaterialIcons-Round',
  iconSharp: 'MaterialIcons-Sharp',
  iconTwoTone: 'MaterialIcons-TwoTone',
} as const;

export type FontName = keyof typeof FONTS;

// Configuração de carregamento de fontes
export const FONT_CONFIG = {
  // Fontes que serão carregadas
  fontsToLoad: [
    { 'Inter-Regular': require('./Inter-Regular.ttf') },
    { 'Inter-Medium': require('./Inter-Medium.ttf') },
    { 'Inter-SemiBold': require('./Inter-SemiBold.ttf') },
    { 'Inter-Bold': require('./Inter-Bold.ttf') },
    { 'Inter-Light': require('./Inter-Light.ttf') },
    { 'Inter-Thin': require('./Inter-Thin.ttf') },
    { 'Inter-ExtraBold': require('./Inter-ExtraBold.ttf') },
    { 'Inter-Black': require('./Inter-Black.ttf') },
  ],
  
  // Fallback fonts
  fallback: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
} as const; 