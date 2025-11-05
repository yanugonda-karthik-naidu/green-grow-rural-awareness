import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  total_trees: number;
  total_co2_kg: number;
  total_o2_lpd: number;
  total_area_m2: number;
  total_seeds_issued: number;
  last_updated: string;
}

export const useRealtimeAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const fetchAnalytics = async () => {
      const { data, error } = await supabase
        .from('analytics_counters')
        .select('*')
        .single();

      if (!error && data) {
        setAnalytics(data);
      }
      setLoading(false);
    };

    fetchAnalytics();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics_counters',
        },
        (payload) => {
          console.log('Analytics updated:', payload);
          if (payload.new) {
            setAnalytics(payload.new as AnalyticsData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { analytics, loading };
};