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

      // Fetch user purchases if logged in
      if (userId) {
        const { data: userPurchases, error: purchasesError } = await supabase
          .from('user_purchases')
          .select('*')
          .eq('user_id', userId);

        if (purchasesError) throw purchasesError;
        setPurchases(userPurchases || []);
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
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
    loading,
    purchaseItem,
    hasPurchased,
    refetch: fetchShopData
  };
};
