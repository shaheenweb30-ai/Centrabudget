import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCategories = (userId: string | undefined) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, icon: string, color: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: name.trim(),
          icon,
          color,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      
      toast({
        title: "Category added",
        description: "Category has been successfully created.",
      });

      return data;
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, name: string, icon: string, color: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: name.trim(),
          icon,
          color
        })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setCategories(categories.map(cat => 
        cat.id === id 
          ? { ...cat, name: name.trim(), icon, color }
          : cat
      ));
      
      toast({
        title: "Category updated",
        description: "Category has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!userId) {
      console.log('No userId provided for deleteCategory');
      return;
    }

    console.log('Attempting to delete category:', { id, userId });

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Category deleted from database, updating local state');
      setCategories(categories.filter(cat => cat.id !== id));
      
      toast({
        title: "Category deleted",
        description: "Category has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userId]);

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
}; 