import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Contextos do Supabase
import { SupabaseAuthProvider } from './src/contexts/SupabaseAuthContext';
import { SupabaseTaskProvider } from './src/contexts/SupabaseTaskContext';

// Navegação
import Navigation from './src/navigation';

export default function AppWithSupabase() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Provedor de Autenticação do Supabase */}
        <SupabaseAuthProvider>
          {/* Provedor de Tarefas do Supabase */}
          <SupabaseTaskProvider>
            <NavigationContainer>
              <Navigation />
              <StatusBar style="auto" />
            </NavigationContainer>
          </SupabaseTaskProvider>
        </SupabaseAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 