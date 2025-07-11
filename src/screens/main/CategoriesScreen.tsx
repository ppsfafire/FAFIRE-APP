import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseTasks } from '../../contexts/SupabaseTaskContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Category } from '../../types';
import { useTheme } from '@react-navigation/native';

const CategoriesScreen = () => {
  const { categories, addCategory, deleteCategory, tasks } = useSupabaseTasks();
  const { user } = useSupabaseAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
  const [newCategoryColor, setNewCategoryColor] = useState('#007AFF');
  const { colors } = useTheme();

  const iconOptions = ['📁', '💼', '👤', '📚', '🏥', '🎮', '🏠', '🚗', '🍽️', '🎵', '🎨', '💻'];

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para a categoria');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      Alert.alert('Erro', 'Já existe uma categoria com este nome');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
      return;
    }

    try {
      await addCategory({
        name: newCategoryName.trim(),
        icon: newCategoryIcon,
        color: newCategoryColor,
        userId: user.id, // Passa o userId corretamente
      });

      setNewCategoryName('');
      setNewCategoryIcon('📁');
      setNewCategoryColor('#007AFF');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar categoria');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    const tasksInCategory = tasks.filter(task => task.category === category.name);
    
    if (tasksInCategory.length > 0) {
      Alert.alert(
        'Categoria em uso',
        `Esta categoria possui ${tasksInCategory.length} tarefa(s). Remova as tarefas primeiro ou altere suas categorias.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir a categoria "${category.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir categoria');
            }
          },
        },
      ]
    );
  };

  const getCategoryStats = (categoryName: string) => {
    const categoryTasks = tasks.filter(task => task.category === categoryName);
    const completedTasks = categoryTasks.filter(task => task.completed);
    
    return {
      total: categoryTasks.length,
      completed: completedTasks.length,
      pending: categoryTasks.length - completedTasks.length,
    };
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const stats = getCategoryStats(item.name);
    
    return (
      <View style={[styles.categoryItem, { backgroundColor: colors.card }]}>
        <View style={styles.categoryInfo}>
          <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryStats}>
              {stats.completed} concluídas, {stats.pending} pendentes
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ color: colors.text }}>Nenhuma categoria encontrada.</Text>}
      />

      {/* Add Category Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Categoria</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Nome */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome da Categoria</Text>
                <TextInput
                  style={styles.input}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Digite o nome da categoria"
                  maxLength={20}
                />
              </View>

              {/* Ícone */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ícone</Text>
                <View style={styles.iconGrid}>
                  {iconOptions.map((icon, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.iconOption,
                        newCategoryIcon === icon && styles.iconOptionSelected,
                      ]}
                      onPress={() => setNewCategoryIcon(icon)}
                    >
                      <Text style={styles.iconOptionText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cor */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cor</Text>
                <View style={styles.colorGrid}>
                  {colorOptions.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newCategoryColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setNewCategoryColor(color)}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddCategory}
              >
                <Text style={styles.saveButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 18,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  categoryStats: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    fontSize: 24,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  iconOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  iconOptionText: {
    fontSize: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#2c3e50',
    borderWidth: 3,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategoriesScreen; 