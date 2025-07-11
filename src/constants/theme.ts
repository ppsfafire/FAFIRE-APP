import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

export const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1A1A1A',
    border: '#E1E8ED',
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    error: '#FF3B30',
    info: '#5AC8FA',
    textSecondary: '#6C757D',
    textInverse: '#FFFFFF',
    cardShadow: '#00000010',
  },
};

export const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    card: '#1E1E1E',
    text: '#F2F2F7',
    border: '#333',
    primary: '#0A84FF',
    secondary: '#A284FF',
    success: '#30D158',
    error: '#FF453A',
    info: '#64D2FF',
    textSecondary: '#B0B3B8',
    textInverse: '#1A1A1A',
    cardShadow: '#00000040',
  },
}; 