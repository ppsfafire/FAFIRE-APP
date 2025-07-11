import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
            onPress={onToggle}
          >
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.title,
                task.completed && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            
            {task.description && (
              <Text
                style={[
                  styles.description,
                  task.completed && styles.descriptionCompleted,
                ]}
                numberOfLines={1}
              >
                {task.description}
              </Text>
            )}
            
            <View style={styles.metaInfo}>
              <Text style={styles.category}>{task.category}</Text>
              {task.dueDate && (
                <Text style={styles.dueDate}>
                  {formatDate(task.dueDate)}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.rightSection}>
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
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 5,
    marginHorizontal: 10,
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
  content: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#7f8c8d',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  descriptionCompleted: {
    color: '#bdc3c7',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  dueDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default TaskItem; 