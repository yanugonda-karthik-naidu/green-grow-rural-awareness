import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, Check, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PurchasedItem {
  id: string;
  item_id: string;
  purchased_at: string;
  seeds_spent: number;
  item: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    image_url: string | null;
  };
}

interface PurchasedItemsProps {
  userId: string;
}

export const PurchasedItems = ({ userId }: PurchasedItemsProps) => {
  const [purchases, setPurchases] = useState<PurchasedItem[]>([]);
  const [equippedItems, setEquippedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
    loadEquippedItems();
  }, [userId]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          id,
          item_id,
          purchased_at,
          seeds_spent,
          item:shop_items(id, name, description, category, image_url)
        `)
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to handle the nested item
      const transformedData = (data || []).map(purchase => ({
        ...purchase,
        item: Array.isArray(purchase.item) ? purchase.item[0] : purchase.item
      })).filter(p => p.item);
      
      setPurchases(transformedData as PurchasedItem[]);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEquippedItems = () => {
    // Load equipped items from localStorage
    const saved = localStorage.getItem(`equipped_items_${userId}`);
    if (saved) {
      setEquippedItems(JSON.parse(saved));
    }
  };

  const toggleEquip = (itemId: string) => {
    const newEquipped = equippedItems.includes(itemId)
      ? equippedItems.filter(id => id !== itemId)
      : [...equippedItems, itemId];
    
    setEquippedItems(newEquipped);
    localStorage.setItem(`equipped_items_${userId}`, JSON.stringify(newEquipped));
    
    toast.success(
      equippedItems.includes(itemId) 
        ? 'Item unequipped!' 
        : 'Item equipped!'
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      badge: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
      title: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
      cosmetic: 'bg-pink-500/20 text-pink-600 border-pink-500/30',
      boost: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
      content: 'bg-green-500/20 text-green-600 border-green-500/30',
      frame: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
      effect: 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'badge':
      case 'title':
        return <Star className="w-3 h-3" />;
      default:
        return <Sparkles className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading purchases...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get equipped items data
  const equippedPurchases = purchases.filter(p => equippedItems.includes(p.item_id));

  return (
    <div className="space-y-6">
      {/* Equipped Items Section */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Equipped Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          {equippedPurchases.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No items equipped. Equip items from your collection below!
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {equippedPurchases.map(purchase => (
                <div
                  key={purchase.id}
                  className="flex items-center gap-2 bg-background rounded-full px-4 py-2 border border-primary/30"
                >
                  <span className="text-xl">{purchase.item.image_url}</span>
                  <span className="font-medium text-sm">{purchase.item.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => toggleEquip(purchase.item_id)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Purchased Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="w-5 h-5" />
            My Collection
            <Badge variant="secondary" className="ml-2">
              {purchases.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">No items purchased yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Visit the Rewards Shop to spend your seeds!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases.map(purchase => {
                const isEquipped = equippedItems.includes(purchase.item_id);
                return (
                  <Card 
                    key={purchase.id}
                    className={`relative overflow-hidden transition-all ${
                      isEquipped ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                  >
                    {isEquipped && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">
                          <Check className="w-3 h-3 mr-1" /> Equipped
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="text-3xl mb-2">{purchase.item.image_url}</div>
                      <h3 className="font-semibold">{purchase.item.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {purchase.item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getCategoryColor(purchase.item.category)}>
                          {getCategoryIcon(purchase.item.category)}
                          <span className="ml-1">{purchase.item.category}</span>
                        </Badge>
                      </div>
                      <Button
                        variant={isEquipped ? "outline" : "default"}
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => toggleEquip(purchase.item_id)}
                      >
                        {isEquipped ? 'Unequip' : 'Equip'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
