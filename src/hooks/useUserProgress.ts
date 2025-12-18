import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProgress {
  id?: string;
  user_id?: string;
  trees_planted: number;
  co2_reduced: number;
  oxygen_generated: number;
  wildlife_sheltered: number;
  water_saved: number;
  green_area_expanded: number;
  energy_saved: number;
  seed_points: number;
}

export interface PlantedTree {
  id: string;
  user_id: string;
  tree_name: string;
  planted_date: string;
  stage: number;
  image_path?: string;
  species?: string;
  description?: string;
  location?: string;
  growth_stage?: number;
  impact_co2_kg?: number;
  impact_o2_l_per_day?: number;
  area_m2?: number;
  is_public?: boolean;
  metadata?: any;
}

export interface Badge {
  id: string;
  badge_name: string;
  earned_at: string;
}

export interface Achievement {
  id: string;
  achievement_text: string;
  seeds_earned: number;
  created_at: string;
}

export const useUserProgress = (userId: string | undefined) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProgress = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProgress(data);
    } catch (error: any) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchPlantedTrees = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('planted_trees')
        .select('*')
        .eq('user_id', userId)
        .order('planted_date', { ascending: false });

      if (error) throw error;
      setPlantedTrees(data || []);
    } catch (error: any) {
      console.error('Error fetching planted trees:', error);
    }
  };

  const fetchBadges = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error: any) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchAchievements = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAchievements(data || []);
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProgress(),
        fetchPlantedTrees(),
        fetchBadges(),
        fetchAchievements()
      ]);
      setLoading(false);
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!userId) return;

    try {
      // For seed_points, if updates.seed_points is provided as an absolute value, use it
      // Otherwise, add to existing. Check if it's meant to be absolute (when coming from games/quiz)
      const newSeedPoints = updates.seed_points !== undefined 
        ? updates.seed_points  // Use absolute value when explicitly set
        : (progress?.seed_points || 0);

      const newProgress = {
        trees_planted: updates.trees_planted !== undefined 
          ? updates.trees_planted 
          : (progress?.trees_planted || 0),
        co2_reduced: updates.co2_reduced !== undefined 
          ? updates.co2_reduced 
          : (progress?.co2_reduced || 0),
        oxygen_generated: updates.oxygen_generated !== undefined 
          ? updates.oxygen_generated 
          : (progress?.oxygen_generated || 0),
        wildlife_sheltered: updates.wildlife_sheltered !== undefined 
          ? updates.wildlife_sheltered 
          : (progress?.wildlife_sheltered || 0),
        water_saved: updates.water_saved !== undefined 
          ? updates.water_saved 
          : (progress?.water_saved || 0),
        green_area_expanded: updates.green_area_expanded !== undefined 
          ? updates.green_area_expanded 
          : (progress?.green_area_expanded || 0),
        energy_saved: updates.energy_saved !== undefined 
          ? updates.energy_saved 
          : (progress?.energy_saved || 0),
        seed_points: newSeedPoints,
      };

      const { error } = await supabase
        .from('user_progress')
        .update(newProgress)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state immediately for faster UI feedback
      setProgress(prev => prev ? { ...prev, ...newProgress } : null);
      
      // Then fetch fresh data
      await fetchProgress();
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const addPlantedTree = async (treeName: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('planted_trees')
        .insert({
          user_id: userId,
          tree_name: treeName,
        });

      if (error) throw error;

      await fetchPlantedTrees();
    } catch (error: any) {
      console.error('Error adding planted tree:', error);
      toast({
        title: "Error",
        description: "Failed to add planted tree",
        variant: "destructive",
      });
    }
  };

  const addBadge = async (badgeName: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_name: badgeName,
        });

      if (error) throw error;

      await fetchBadges();
    } catch (error: any) {
      console.error('Error adding badge:', error);
    }
  };

  const addAchievement = async (achievementText: string, seedsEarned: number) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          achievement_text: achievementText,
          seeds_earned: seedsEarned,
        });

      if (error) throw error;

      await fetchAchievements();
    } catch (error: any) {
      console.error('Error adding achievement:', error);
    }
  };

  return {
    progress,
    plantedTrees,
    badges,
    achievements,
    loading,
    updateProgress,
    addPlantedTree,
    addBadge,
    addAchievement,
    refetch: () => Promise.all([fetchProgress(), fetchPlantedTrees(), fetchBadges(), fetchAchievements()]),
  };
};
