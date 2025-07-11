import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseTasks } from '../../contexts/SupabaseTaskContext';
import { Task } from '../../types';
import TaskItem from '../../components/TaskItem';
import FilterModal from '../../components/FilterModal';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

const TasksScreen = ({ navigation }: any) => {
  const { tasks, categories, toggleTask, deleteTask, isLoading } = useSupabaseTasks();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all', // 'all', 'completed', 'pending'
    priority: 'all', // 'all', 'low', 'medium', 'high'
    category: 'all',
  });
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.status !== 'all') {
      if (filter.status === 'completed' && !task.completed) return false;
      if (filter.status === 'pending' && task.completed) return false;
    }
    
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false;
    }
    
    if (filter.category !== 'all' && task.category !== filter.category) {
      return false;
    }
    
    return true;
  });

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir tarefa');
            }
          },
        },
      ]
    );
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const getFilterText = () => {
    const filters = [];
    if (filter.status !== 'all') {
      filters.push(filter.status === 'completed' ? 'Concluídas' : 'Pendentes');
    }
    if (filter.priority !== 'all') {
      filters.push(filter.priority === 'high' ? 'Alta' : filter.priority === 'medium' ? 'Média' : 'Baixa');
    }
    if (filter.category !== 'all') {
      filters.push(filter.category);
    }
    return filters.length > 0 ? filters.join(', ') : 'Todas as tarefas';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, { backgroundColor: colors.card, shadowColor: '#00000010' }]}> 
      <View style={styles.taskHeader}>
        <TouchableOpacity onPress={() => handleToggleTask(item.id)} style={styles.toggleButton}>
          <View style={[styles.checkbox, { borderColor: item.completed ? COLORS.success : colors.primary, backgroundColor: item.completed ? COLORS.success : 'transparent' }]}> 
            {item.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
        </TouchableOpacity>
        <Text style={[styles.taskTitle, { color: colors.text, textDecorationLine: item.completed ? 'line-through' : 'none' }]}>{item.title}</Text>
        {item.priority && (
          <View style={[styles.badge, { backgroundColor: item.priority === 'high' ? COLORS.error : item.priority === 'medium' ? COLORS.info : COLORS.success }]}> 
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
              {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.taskDescription, { color: COLORS.textSecondary, textDecorationLine: item.completed ? 'line-through' : 'none' }]}>{item.description}</Text>
      <View style={styles.taskFooter}>
        <View style={[styles.categoryBadge, { backgroundColor: COLORS.info }]}> 
          <Text style={{ color: '#fff', fontSize: 12 }}>{getCategoryName(item.category)}</Text>
        </View>
        <Text style={[styles.taskDate, { color: COLORS.textSecondary }]}>{item.dueDate ? new Date(item.dueDate).toLocaleDateString('pt-BR') : ''}</Text>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {filteredTasks.length === 0 && tasks.length > 0
          ? 'Nenhuma tarefa encontrada com os filtros aplicados'
          : 'Nenhuma tarefa criada ainda'}
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.emptyStateButtonText}>Criar primeira tarefa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}> 
        <Text style={[styles.headerTitle, { color: colors.text }]}>Minhas Tarefas</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary }]} onPress={() => setFilterModalVisible(true)}>
          <Text style={[styles.filterButtonText, { color: colors.textInverse }]}>Filtrar</Text>
        </TouchableOpacity>
      </View>
      {/* Subheader */}
      <View style={[styles.subHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}> 
        <Text style={[styles.subHeaderText, { color: colors.textSecondary }]}>Todas as tarefas</Text>
        <Text style={[styles.subHeaderText, { color: colors.textSecondary }]}>{filteredTasks.length} tarefa(s)</Text>
      </View>
      {/* Task List */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text style={{ color: colors.text }}>Nenhuma tarefa encontrada.</Text>}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        filter={filter}
        onFilterChange={setFilter}
        onClose={() => setFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  subHeaderText: {
    fontSize: 14,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  filterInfoText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  listContainer: {
    flexGrow: 1,
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  taskCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  taskDate: {
    fontSize: 12,
  },
  toggleButton: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TasksScreen; 