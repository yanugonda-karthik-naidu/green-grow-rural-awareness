import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LocationStats {
  location: string;
  total_trees: number;
  total_users: number;
  total_co2_kg: number;
  total_o2_lpd: number;
}

export interface CommunityChallenge {
  id: string;
  location: string;
  title: string;
  description: string | null;
  target_trees: number;
  current_trees: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  participants: string[];
}

export interface LocationLeaderboard {
  user_id: string;
  display_name: string;
  location: string;
  trees_planted: number;
  seed_points: number;
}

export const useLocationCommunity = (userLocation: string | null) => {
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LocationLeaderboard[]>([]);
  const [locationPosts, setLocationPosts] = useState<any[]>([]);
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocationData = useCallback(async () => {
    if (!userLocation) {
      setLoading(false);
      return;
    }

    // Fetch location stats
    const { data: stats } = await supabase
      .from('location_stats')
      .select('*')
      .eq('location', userLocation)
      .single();

    if (stats) {
      setLocationStats(stats as LocationStats);
    }

    // Fetch challenges for this location
    const { data: challengeData } = await supabase
      .from('community_challenges')
      .select('*')
      .eq('location', userLocation)
      .eq('is_active', true);

    if (challengeData) {
      setChallenges(challengeData as CommunityChallenge[]);
    }

    // Fetch leaderboard for this location
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, location')
      .eq('location', userLocation);

    if (profiles) {
      const userIds = profiles.map(p => p.id);
      
      const { data: progress } = await supabase
        .from('user_progress')
        .select('user_id, trees_planted, seed_points')
        .in('user_id', userIds)
        .order('trees_planted', { ascending: false });

      if (progress) {
        const profileMap = new Map(profiles.map(p => [p.id, p]));
        const leaderboardData = progress
          .filter(p => p.trees_planted > 0)
          .map(p => ({
            user_id: p.user_id,
            display_name: profileMap.get(p.user_id)?.display_name || 'Community Member',
            location: profileMap.get(p.user_id)?.location || userLocation,
            trees_planted: p.trees_planted,
            seed_points: p.seed_points || 0
          }));
        setLeaderboard(leaderboardData);
      }
    }

    // Fetch posts from users in this location
    const { data: locationProfiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('location', userLocation);

    if (locationProfiles) {
      const userIds = locationProfiles.map(p => p.id);
      
      const { data: posts } = await supabase
        .from('community_posts')
        .select('*')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      if (posts) {
        setLocationPosts(posts);
      }
    }

    // Fetch all unique locations
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('location')
      .not('location', 'is', null);

    if (allProfiles) {
      const locations = [...new Set(allProfiles.map(p => p.location).filter(Boolean))] as string[];
      setAllLocations(locations);
    }

    setLoading(false);
  }, [userLocation]);

  useEffect(() => {
    fetchLocationData();

    // Real-time subscriptions
    const channels = [
      supabase
        .channel('location-stats-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'location_stats' }, fetchLocationData),
      supabase
        .channel('location-challenges-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'community_challenges' }, fetchLocationData),
      supabase
        .channel('location-posts-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, fetchLocationData),
      supabase
        .channel('location-progress-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, fetchLocationData)
    ];

    channels.forEach(c => c.subscribe());

    return () => {
      channels.forEach(c => supabase.removeChannel(c));
    };
  }, [fetchLocationData]);

  const joinChallenge = async (challengeId: string, userId: string) => {
    // Get current challenge
    const { data: challenge } = await supabase
      .from('community_challenges')
      .select('participants')
      .eq('id', challengeId)
      .single();

    if (!challenge) return { error: new Error('Challenge not found') };

    const currentParticipants = (challenge.participants as string[]) || [];
    if (currentParticipants.includes(userId)) {
      return { error: null }; // Already joined
    }

    const { error } = await supabase
      .from('community_challenges')
      .update({ 
        participants: [...currentParticipants, userId] 
      })
      .eq('id', challengeId);
    
    if (!error) {
      fetchLocationData();
    }
    return { error };
  };

  const createChallenge = async (location: string, title: string, description: string, targetTrees: number, endDate: Date) => {
    const { error } = await supabase
      .from('community_challenges')
      .insert({
        location,
        title,
        description,
        target_trees: targetTrees,
        end_date: endDate.toISOString()
      });

    if (!error) {
      fetchLocationData();
    }
    return { error };
  };

  return {
    locationStats,
    challenges,
    leaderboard,
    locationPosts,
    allLocations,
    loading,
    refetch: fetchLocationData,
    joinChallenge,
    createChallenge
  };
};
