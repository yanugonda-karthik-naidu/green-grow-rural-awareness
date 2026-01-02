import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EquippedItem {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
}

export const useEquippedItems = (userId: string | undefined) => {
  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);
  const [equippedItemIds, setEquippedItemIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquippedItems = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Load equipped item IDs from localStorage
      const saved = localStorage.getItem(`equipped_items_${userId}`);
      const itemIds: string[] = saved ? JSON.parse(saved) : [];
      setEquippedItemIds(itemIds);

      if (itemIds.length === 0) {
        setEquippedItems([]);
        setLoading(false);
        return;
      }

      // Fetch item details
      const { data, error } = await supabase
        .from('shop_items')
        .select('id, name, category, image_url')
        .in('id', itemIds);

      if (error) throw error;
      setEquippedItems(data || []);
    } catch (error) {
      console.error('Error fetching equipped items:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEquippedItems();

    // Listen for storage changes (when user equips/unequips in Profile)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `equipped_items_${userId}`) {
        fetchEquippedItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchEquippedItems, userId]);

  const getEquippedByCategory = (category: string) => {
    return equippedItems.filter(item => item.category === category);
  };

  const hasEquippedFrame = () => {
    return equippedItems.some(item => item.category === 'frame');
  };

  const getEquippedFrame = () => {
    return equippedItems.find(item => item.category === 'frame');
  };

  const hasEquippedTitle = () => {
    return equippedItems.some(item => item.category === 'title');
  };

  const getEquippedTitle = () => {
    return equippedItems.find(item => item.category === 'title');
  };

  const hasEquippedBadge = () => {
    return equippedItems.some(item => item.category === 'badge');
  };

  const getEquippedBadges = () => {
    return equippedItems.filter(item => item.category === 'badge');
  };

  return {
    equippedItems,
    equippedItemIds,
    loading,
    getEquippedByCategory,
    hasEquippedFrame,
    getEquippedFrame,
    hasEquippedTitle,
    getEquippedTitle,
    hasEquippedBadge,
    getEquippedBadges,
    refetch: fetchEquippedItems
  };
};

// Static function to get equipped items for any user (for leaderboard)
export const getEquippedItemsForUser = async (userId: string): Promise<EquippedItem[]> => {
  const saved = localStorage.getItem(`equipped_items_${userId}`);
  const itemIds: string[] = saved ? JSON.parse(saved) : [];

  if (itemIds.length === 0) return [];

  const { data } = await supabase
    .from('shop_items')
    .select('id, name, category, image_url')
    .in('id', itemIds);

  return data || [];
};
