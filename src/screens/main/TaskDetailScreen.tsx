import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseTasks } from '../../contexts/SupabaseTaskContext';
import { Task } from '../../types';
import { useTheme } from '@react-navigation/native';

const TaskDetailScreen = ({ route, navigation }: any) => {
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask } = useSupabaseTasks();
  const [task, setTask] = useState<Task | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === taskId);
    setTask(foundTask || null);
  }, [taskId, tasks]);

  const handleToggleComplete = async () => {
    if (!task) return;

    try {
      await updateTask(task.id, { completed: !task.completed });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar tarefa');
    }
  };

  const handleDelete = () => {
    if (!task) return;

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
              await deleteTask(task.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir tarefa');
            }
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFA726';
      case 'low':
        return '#66BB6A';
      default:
        return '#7f8c8d';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Tarefa não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
            <View
              style={[
                styles.statusBadge,
                task.completed && styles.statusBadgeCompleted,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  task.completed && styles.statusTextCompleted,
                ]}
              >
                {task.completed ? 'Concluída' : 'Pendente'}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Descrição */}
          {task.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{task.description}</Text>
            </View>
          )}

          {/* Informações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoria:</Text>
              <Text style={styles.infoValue}>{task.category}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prioridade:</Text>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(task.priority) },
                ]}
              >
                <Text style={styles.priorityText}>
                  {getPriorityText(task.priority)}
                </Text>
              </View>
            </View>

            {task.dueDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data de vencimento:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(task.dueDate)}
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Criada em:</Text>
              <Text style={styles.infoValue}>
                {formatDate(task.createdAt)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Atualizada em:</Text>
              <Text style={styles.infoValue}>
                {formatDate(task.updatedAt)}
              </Text>
            </View>
          </View>

          {/* Localização */}
          {task.location && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localização</Text>
              {task.location.address && (
                <Text style={styles.locationText}>{task.location.address}</Text>
              )}
              <Text style={styles.coordinatesText}>
                {task.location.latitude.toFixed(6)}, {task.location.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          {/* Imagem */}
          {task.image && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Imagem</Text>
              <Image source={{ uri: task.image }} style={styles.taskImage} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.toggleButton,
            task.completed && styles.toggleButtonCompleted,
          ]}
          onPress={handleToggleComplete}
        >
          <Text
            style={[
              styles.actionButtonText,
              task.completed && styles.actionButtonTextCompleted,
            ]}
          >
            {task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Excluir Tarefa
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: 'white',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
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
  description: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  locationText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  taskImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  actions: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
  },
  toggleButtonCompleted: {
    backgroundColor: '#FFA726',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextCompleted: {
    color: 'white',
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default TaskDetailScreen; 