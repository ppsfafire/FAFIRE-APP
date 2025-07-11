import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useSupabaseTasks } from '../../contexts/SupabaseTaskContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useTheme } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useSupabaseAuth();
  const { tasks, categories } = useSupabaseTasks();
  const { theme, toggleTheme } = useThemeMode();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao fazer logout');
            }
          },
        },
      ]
    );
  };

  const getStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      completionRate,
    };
  };

  const stats = getStats();

  const menuItems = [
    {
      title: 'Notificações',
      icon: '🔔',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
    },
    {
      title: 'Modo Escuro',
      icon: '🌙',
      type: 'switch',
      value: theme === 'dark',
      onValueChange: toggleTheme,
    },
    {
      title: 'Sobre o App',
      icon: 'ℹ️',
      onPress: () => Alert.alert('Sobre', 'FAFIRE Task Manager v1.0.0\n\nDesenvolvido com React Native e Expo'),
    },
    {
      title: 'Ajuda',
      icon: '❓',
      onPress: () => Alert.alert('Ajuda', 'Entre em contato conosco para suporte'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Taxa de Conclusão</Text>
            </View>
          </View>
        </View>

        {/* Categorias */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Suas Categorias</Text>
          <View style={styles.categoriesList}>
            {categories.map(category => {
              const categoryTasks = tasks.filter(task => task.category === category.name);
              const completedCategoryTasks = categoryTasks.filter(task => task.completed);
              
              return (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <View style={styles.categoryStats}>
                    <Text style={styles.categoryTaskCount}>
                      {completedCategoryTasks.length}/{categoryTasks.length}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              disabled={item.type === 'switch'}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              {item.type === 'switch' ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onValueChange}
                  trackColor={{ false: '#e1e8ed', true: '#007AFF' }}
                  thumbColor={item.value ? '#ffffff' : '#f4f3f4'}
                />
              ) : (
                <Text style={styles.menuArrow}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: '1%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoriesList: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryTaskCount: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#2c3e50',
  },
  menuArrow: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 