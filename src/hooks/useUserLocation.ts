import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserLocationData {
  location: string | null;
  displayName: string | null;
  userId: string | null;
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocationData>({
    location: null,
    displayName: null,
    userId: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('location, display_name')
        .eq('id', user.id)
        .single();

      setUserLocation({
        location: profile?.location || null,
        displayName: profile?.display_name || null,
        userId: user.id
      });
      setLoading(false);
    };

    fetchUserLocation();

    // Subscribe to profile changes
    const channel = supabase
      .channel('user-profile-location')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        async () => {
          fetchUserLocation();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { userLocation, loading };
};
