import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

// Telas de autenticação
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Telas principais
import HomeScreen from '../screens/main/HomeScreen';
import TasksScreen from '../screens/main/TasksScreen';
import AddTaskScreen from '../screens/main/AddTaskScreen';
import TaskDetailScreen from '../screens/main/TaskDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';

// Componentes de ícones
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Tasks') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'AddTask') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Início' }}
    />
    <Tab.Screen 
      name="Tasks" 
      component={TasksScreen}
      options={{ title: 'Tarefas' }}
    />
    <Tab.Screen 
      name="AddTask" 
      component={AddTaskScreen}
      options={{ title: 'Nova Tarefa' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Perfil' }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen 
      name="TaskDetail" 
      component={TaskDetailScreen}
      options={{
        headerShown: true,
        title: 'Detalhes da Tarefa',
        headerBackTitle: 'Voltar',
      }}
    />
    <Stack.Screen 
      name="Categories" 
      component={CategoriesScreen}
      options={{
        headerShown: true,
        title: 'Categorias',
        headerBackTitle: 'Voltar',
      }}
    />
  </Stack.Navigator>
);

const Navigation = () => {
  const { isAuthenticated, isLoading } = useSupabaseAuth();

  if (isLoading) {
    // Aqui você pode adicionar uma tela de loading
    return null;
  }

  return isAuthenticated ? <MainStack /> : <AuthStack />;
};

export default Navigation; 