import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  seed_cost: number;
  image_url: string | null;
  is_available: boolean;
}

interface UserPurchase {
  id: string;
  user_id: string;
  item_id: string;
  purchased_at: string;
  seeds_spent: number;
}

export const useRewardsShop = (userId: string | undefined) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [seedPoints, setSeedPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchShopData = useCallback(async () => {
    try {
      // Fetch available shop items
      const { data: items, error: itemsError } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_available', true)
        .order('seed_cost', { ascending: true });

      if (itemsError) throw itemsError;
      setShopItems(items || []);

      // Fetch user purchases and seed points if logged in
      if (userId) {
        const [purchasesResult, progressResult] = await Promise.all([
          supabase.from('user_purchases').select('*').eq('user_id', userId),
          supabase.from('user_progress').select('seed_points').eq('user_id', userId).maybeSingle()
        ]);

        if (purchasesResult.error) throw purchasesResult.error;
        setPurchases(purchasesResult.data || []);
        setSeedPoints(progressResult.data?.seed_points || 0);
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Real-time subscription for seed points updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('seed-points-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.new && 'seed_points' in payload.new) {
            setSeedPoints(payload.new.seed_points as number);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  const purchaseItem = async (itemId: string, seedCost: number) => {
    if (!userId) return { error: 'Not authenticated' };

    // Check if already purchased
    const alreadyPurchased = purchases.some(p => p.item_id === itemId);
    if (alreadyPurchased) return { error: 'Already purchased' };

    // Insert purchase record
    const { error: purchaseError } = await supabase
      .from('user_purchases')
      .insert({
        user_id: userId,
        item_id: itemId,
        seeds_spent: seedCost
      });

    if (purchaseError) return { error: purchaseError.message };

    // Deduct seeds from user progress
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('seed_points')
      .eq('user_id', userId)
      .maybeSingle();

    const currentSeeds = currentProgress?.seed_points || 0;
    const newSeeds = Math.max(0, currentSeeds - seedCost);

    const { error: updateError } = await supabase
      .from('user_progress')
      .update({ seed_points: newSeeds })
      .eq('user_id', userId);

    if (updateError) return { error: updateError.message };

    // Update local state
    setPurchases(prev => [...prev, {
      id: crypto.randomUUID(),
      user_id: userId,
      item_id: itemId,
      purchased_at: new Date().toISOString(),
      seeds_spent: seedCost
    }]);

    return { error: null, newBalance: newSeeds };
  };

  const hasPurchased = (itemId: string) => {
    return purchases.some(p => p.item_id === itemId);
  };

  return {
    shopItems,
    purchases,
    seedPoints,
    loading,
    purchaseItem,
    hasPurchased,
    refetch: fetchShopData
  };
};
