import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useSupabaseTasks } from '../../contexts/SupabaseTaskContext';
import { WeatherData } from '../../types';
import { getWeatherData } from '../../services/weatherService';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../../constants';

const HomeScreen = ({ navigation }: any) => {
  const { user } = useSupabaseAuth();
  const { tasks, categories } = useSupabaseTasks();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      const weatherData = await getWeatherData();
      setWeather(weatherData);
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const totalTasks = tasks.length;

  // Corrigir cálculo do progresso para nunca ser NaN
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getPriorityTasks = () => {
    return tasks
      .filter(task => !task.completed && task.priority === 'high')
      .slice(0, 3);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View>
            <Text style={[styles.greeting, { color: COLORS.textSecondary }]}>{getGreeting()},</Text>
            <Text style={[styles.userName, { color: colors.text, fontWeight: 'bold' }]}>{user?.name || 'Usuário'}!</Text>
          </View>
          {weather && (
            <View style={styles.weatherContainer}>
              <Text style={[styles.weatherTemp, { color: colors.text }]}>{weather.temperature}ºC</Text>
              <Text style={[styles.weatherLocation, { color: COLORS.textSecondary }]}>{weather.location}</Text>
            </View>
          )}
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: '#00000010' }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{totalTasks}</Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: '#00000010' }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{pendingTasks}</Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>Pendentes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: '#00000010' }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{completedTasks}</Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>Concluídas</Text>
          </View>
        </View>

        {/* Progresso */}
        {totalTasks > 0 && (
          <View style={[styles.progressContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Progresso Geral</Text>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%`, backgroundColor: COLORS.success },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: COLORS.textSecondary }]}>
              {completedTasks} de {totalTasks} tarefas concluídas
            </Text>
          </View>
        )}

        {/* Tarefas Prioritárias */}
        {getPriorityTasks().length > 0 && (
          <View style={[styles.priorityContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tarefas Prioritárias</Text>
            {getPriorityTasks().map(task => (
              <TouchableOpacity
                key={task.id}
                style={styles.priorityTask}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              >
                <View style={[styles.priorityIndicator, { backgroundColor: COLORS.error }]} />
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
                  <Text style={[styles.taskCategory, { color: COLORS.textSecondary }]}>{getCategoryName(task.category)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ações Rápidas */}
        <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ações Rápidas</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddTask')}
            >
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>Nova Tarefa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.info }]}
              onPress={() => navigation.navigate('Categories')}
            >
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>Categorias</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherContainer: {
    alignItems: 'flex-end',
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherLocation: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  progressContainer: {
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
  progressBar: {
    height: 8,
    backgroundColor: '#e1e8ed',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  priorityContainer: {
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
  priorityTask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  priorityIndicator: {
    width: 4,
    height: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    marginRight: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  taskCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  quickActions: {
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen; 