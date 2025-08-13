import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Image {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  alt_text?: string;
  tags?: string[];
  is_featured: boolean;
  is_public: boolean;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ImageForm {
  name: string;
  description?: string;
  file_path: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  alt_text?: string;
  tags?: string[];
  is_featured: boolean;
  is_public: boolean;
}

export const useImages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all images
  const {
    data: images = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['images'],
    queryFn: async (): Promise<Image[]> => {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch featured images
  const {
    data: featuredImages = [],
    isLoading: isLoadingFeatured
  } = useQuery({
    queryKey: ['images', 'featured'],
    queryFn: async (): Promise<Image[]> => {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('is_featured', true)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch images by tags
  const getImagesByTags = (tags: string[]) => {
    return useQuery({
      queryKey: ['images', 'tags', tags],
      queryFn: async (): Promise<Image[]> => {
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .overlaps('tags', tags)
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!user && tags.length > 0
    });
  };

  // Get image by ID
  const getImageById = (id: string) => {
    return useQuery({
      queryKey: ['images', id],
      queryFn: async (): Promise<Image | null> => {
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      },
      enabled: !!user && !!id
    });
  };

  // Create image mutation
  const createImageMutation = useMutation({
    mutationFn: async (imageData: ImageForm): Promise<Image> => {
      const { data, error } = await supabase
        .from('images')
        .insert([{
          ...imageData,
          uploaded_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    },
    onError: (error) => {
      console.error('Error creating image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  });

  // Update image mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, ...imageData }: { id: string } & Partial<ImageForm>): Promise<Image> => {
      const { data, error } = await supabase
        .from('images')
        .update(imageData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast({
        title: "Success",
        description: "Image updated successfully"
      });
    },
    onError: (error) => {
      console.error('Error updating image:', error);
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive"
      });
    }
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast({
        title: "Success",
        description: "Image deleted successfully"
      });
    },
    onError: (error) => {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    }
  });

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, path: string): Promise<{ file_path: string; file_url: string }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('lovable-uploads')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('lovable-uploads')
      .getPublicUrl(filePath);

    return {
      file_path: filePath,
      file_url: publicUrl
    };
  };

  // Create image with file upload
  const createImageWithFile = async (file: File, imageData: Omit<ImageForm, 'file_path' | 'file_url'>) => {
    try {
      const { file_path, file_url } = await uploadFile(file, 'images');
      
      // Get image dimensions
      const img = new Image();
      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.src = URL.createObjectURL(file);
      });

      const fullImageData: ImageForm = {
        ...imageData,
        file_path,
        file_url,
        file_size: file.size,
        mime_type: file.type,
        width: dimensions.width,
        height: dimensions.height
      };

      await createImageMutation.mutateAsync(fullImageData);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  return {
    images,
    featuredImages,
    getImagesByTags,
    getImageById,
    isLoading,
    isLoadingFeatured,
    error,
    refetch,
    createImage: createImageMutation.mutate,
    createImageWithFile,
    updateImage: updateImageMutation.mutate,
    deleteImage: deleteImageMutation.mutate,
    isCreating: createImageMutation.isPending,
    isUpdating: updateImageMutation.isPending,
    isDeleting: deleteImageMutation.isPending
  };
};
