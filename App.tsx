import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SupabaseAuthProvider } from './src/contexts/SupabaseAuthContext';
import { SupabaseTaskProvider } from './src/contexts/SupabaseTaskContext';
import Navigation from './src/navigation';
import { ThemeProvider, useThemeMode } from './src/contexts/ThemeContext';
import { CustomLightTheme, CustomDarkTheme } from './src/constants/theme';

const AppContent = () => {
  const { theme } = useThemeMode();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SupabaseAuthProvider>
          <SupabaseTaskProvider>
            <NavigationContainer theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
              <Navigation />
              <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            </NavigationContainer>
          </SupabaseTaskProvider>
        </SupabaseAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
