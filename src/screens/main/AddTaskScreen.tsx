import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useSupabaseTasks } from '../../contexts/SupabaseTaskContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddTaskScreen = ({ navigation }: any) => {
  const { addTask, categories } = useSupabaseTasks();
  const { user } = useSupabaseAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (cameraStatus !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a câmera');
    }
    
    if (locationStatus !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a localização');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar imagem');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tirar foto');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a localização');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      // Obter endereço
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0]
        ? `${addressResponse[0].street}, ${addressResponse[0].city}`
        : undefined;

      setLocation({ latitude, longitude, address });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao obter localização');
    }
  };

  const handleSave = async () => {
    if (categories.length === 0) {
      Alert.alert('Erro', 'Cadastre ao menos uma categoria antes de criar uma tarefa.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a tarefa');
      return;
    }
    if (!category) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria');
      return;
    }
    // Buscar o id da categoria selecionada
    const selectedCategory = categories.find(cat => cat.name === category);
    if (!selectedCategory) {
      Alert.alert('Erro', 'Categoria selecionada não encontrada.');
      return;
    }

    setIsLoading(true);

    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        category: selectedCategory.id, // Passa o id da categoria
        dueDate,
        image,
        location,
        completed: false,
        userId: user?.id || '',
      });

      Alert.alert('Sucesso', 'Tarefa criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Adicionar Imagem',
      'Escolha uma opção',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tirar Foto', onPress: takePhoto },
        { text: 'Escolher da Galeria', onPress: pickImage },
      ]
    );
  };

  const priorityOptions = [
    { value: 'low', label: 'Baixa', color: '#66BB6A' },
    { value: 'medium', label: 'Média', color: '#FFA726' },
    { value: 'high', label: 'Alta', color: '#FF6B6B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Tarefa</Text>
          </View>

          <View style={styles.form}>
            {/* Título */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título da tarefa"
                maxLength={100}
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Digite uma descrição (opcional)"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            {/* Categoria */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Categoria *</Text>
              <View style={styles.categoryContainer}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryOption,
                      category === cat.name && styles.categoryOptionSelected,
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat.name && styles.categoryTextSelected,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Prioridade */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.priorityContainer}>
                {priorityOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.priorityOption,
                      { borderColor: option.color },
                      priority === option.value && {
                        backgroundColor: option.color,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setPriority(option.value as any)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: priority === option.value ? '#fff' : option.color, fontWeight: priority === option.value ? 'bold' : 'normal' },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Data de Vencimento */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Vencimento</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {dueDate
                    ? dueDate.toLocaleDateString('pt-BR')
                    : 'Selecionar data'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Imagem */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Imagem</Text>
              <TouchableOpacity style={styles.imageButton} onPress={showImageOptions}>
                <Text style={styles.imageButtonText}>Adicionar Imagem</Text>
              </TouchableOpacity>
              {image && (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              )}
            </View>

            {/* Localização */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Localização</Text>
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <Text style={styles.locationButtonText}>
                  {location ? 'Localização definida' : 'Definir Localização'}
                </Text>
              </TouchableOpacity>
              {location?.address && (
                <Text style={styles.locationText}>{location.address}</Text>
              )}
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Salvando...' : 'Criar Tarefa'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          date={dueDate || new Date()}
          onConfirm={(selectedDate) => {
            setShowDatePicker(false);
            setDueDate(selectedDate);
          }}
          onCancel={() => setShowDatePicker(false)}
          locale="pt-BR"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
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
  form: {
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
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  categoryTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
  },
  priorityOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  priorityOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  priorityText: {
    fontSize: 14,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  locationButton: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  locationText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTaskScreen; 