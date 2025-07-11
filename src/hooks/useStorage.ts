import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { pickImage, takePhoto } from '../utils';

export interface UseStorageReturn {
  // Estado
  uploading: boolean;
  error: string | null;
  
  // Métodos de upload
  uploadImage: (fileUri: string, fileName?: string) => Promise<string | null>;
  uploadImageFromGallery: () => Promise<string | null>;
  uploadImageFromCamera: () => Promise<string | null>;
  
  // Métodos de download
  getImageUrl: (fileName: string) => string;
  
  // Métodos de exclusão
  deleteImage: (fileName: string) => Promise<boolean>;
  
  // Utilitários
  clearError: () => void;
}

export const useStorage = (): UseStorageReturn => {
  const { user } = useSupabaseAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload de imagem
  const uploadImage = async (fileUri: string, fileName?: string): Promise<string | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const fileExtension = fileUri.split('.').pop() || 'jpg';
      const finalFileName = fileName || `${user.id}/${timestamp}.${fileExtension}`;

      // Verificar se o nome do arquivo segue o padrão exigido pelas políticas RLS
      if (!finalFileName.startsWith(`${user.id}/`)) {
        throw new Error('Nome do arquivo deve começar com o ID do usuário');
      }

      // Fazer upload do arquivo
      const { data, error: uploadError } = await supabase.storage
        .from('task-images')
        .upload(finalFileName, fileUri);

      if (uploadError) {
        throw uploadError;
      }

      if (!data?.path) {
        throw new Error('Erro ao fazer upload: caminho não retornado');
      }

      // Retornar URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('task-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Erro ao fazer upload da imagem:', err);
      setError(err.message || 'Erro ao fazer upload da imagem');
      Alert.alert('Erro', err.message || 'Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Upload de imagem da galeria
  const uploadImageFromGallery = async (): Promise<string | null> => {
    try {
      const imageUri = await pickImage();
      if (!imageUri) {
        return null; // Usuário cancelou a seleção
      }

      return await uploadImage(imageUri);
    } catch (err: any) {
      console.error('Erro ao selecionar imagem da galeria:', err);
      setError(err.message || 'Erro ao selecionar imagem da galeria');
      Alert.alert('Erro', err.message || 'Erro ao selecionar imagem da galeria');
      return null;
    }
  };

  // Upload de imagem da câmera
  const uploadImageFromCamera = async (): Promise<string | null> => {
    try {
      const imageUri = await takePhoto();
      if (!imageUri) {
        return null; // Usuário cancelou a captura
      }

      return await uploadImage(imageUri);
    } catch (err: any) {
      console.error('Erro ao capturar imagem da câmera:', err);
      setError(err.message || 'Erro ao capturar imagem da câmera');
      Alert.alert('Erro', err.message || 'Erro ao capturar imagem da câmera');
      return null;
    }
  };

  // Obter URL pública da imagem
  const getImageUrl = (fileName: string): string => {
    const { data } = supabase.storage
      .from('task-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // Deletar imagem
  const deleteImage = async (fileName: string): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      setError(null);

      // Verificar se o arquivo pertence ao usuário
      if (!fileName.startsWith(`${user.id}/`)) {
        setError('Não é possível excluir este arquivo');
        Alert.alert('Erro', 'Não é possível excluir este arquivo');
        return false;
      }

      const { error: deleteError } = await supabase.storage
        .from('task-images')
        .remove([fileName]);

      if (deleteError) {
        throw deleteError;
      }

      Alert.alert('Sucesso', 'Imagem excluída com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar imagem:', err);
      setError(err.message || 'Erro ao deletar imagem');
      Alert.alert('Erro', err.message || 'Erro ao deletar imagem');
      return false;
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  return {
    // Estado
    uploading,
    error,
    
    // Métodos de upload
    uploadImage,
    uploadImageFromGallery,
    uploadImageFromCamera,
    
    // Métodos de download
    getImageUrl,
    
    // Métodos de exclusão
    deleteImage,
    
    // Utilitários
    clearError,
  };
}; 