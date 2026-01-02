import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRewardsShop } from '@/hooks/useRewardsShop';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Check, Sparkles, Crown, Palette, Zap, Package } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardsShopProps {
  userId?: string;
  onPurchase?: (newBalance: number) => void;
}

export const RewardsShop = ({ userId, onPurchase }: RewardsShopProps) => {
  const { shopItems, seedPoints, loading, purchaseItem, hasPurchased, refetch } = useRewardsShop(userId);
  const { toast } = useToast();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Items', icon: Package },
    { id: 'badge', label: 'Badges', icon: Crown },
    { id: 'title', label: 'Titles', icon: Sparkles },
    { id: 'cosmetic', label: 'Cosmetics', icon: Palette },
    { id: 'boost', label: 'Boosts', icon: Zap },
  ];

  const handlePurchase = async (itemId: string, itemName: string, seedCost: number) => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make purchases",
        variant: "destructive"
      });
      return;
    }

    if (seedPoints < seedCost) {
      toast({
        title: "Insufficient seeds",
        description: `You need ${seedCost - seedPoints} more seeds to purchase this item`,
        variant: "destructive"
      });
      return;
    }

    setPurchasing(itemId);
    const result = await purchaseItem(itemId, seedCost);
    setPurchasing(null);

    if (result.error) {
      toast({
        title: "Purchase failed",
        description: result.error,
        variant: "destructive"
      });
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "🎉 Purchase successful!",
        description: `You've unlocked ${itemName}!`,
      });
      if (onPurchase && result.newBalance !== undefined) {
        onPurchase(result.newBalance);
      }
    }
  };

  const getFilteredItems = (category: string) => {
    const items = category === 'all' ? shopItems : shopItems.filter(item => item.category === category);
    // Sort: unpurchased items first, then purchased items at the bottom
    return [...items].sort((a, b) => {
      const aOwned = hasPurchased(a.id);
      const bOwned = hasPurchased(b.id);
      if (aOwned === bOwned) return 0;
      return aOwned ? 1 : -1;
    });
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

  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading shop...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <ShoppingBag className="w-6 h-6" />
            Rewards Shop
          </CardTitle>
          <Badge variant="outline" className="text-lg px-4 py-1 bg-primary/10 border-primary/30">
            🌱 {seedPoints.toLocaleString()} Seeds
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1">
                <cat.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredItems(cat.id).map(item => {
                  const owned = hasPurchased(item.id);
                  const canAfford = seedPoints >= item.seed_cost;
                  const isPurchasing = purchasing === item.id;

                  return (
                    <Card 
                      key={item.id} 
                      className={`relative overflow-hidden transition-all hover:shadow-lg ${
                        owned ? 'bg-primary/5 border-primary/30' : 'bg-card'
                      }`}
                    >
                      {owned && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground">
                            <Check className="w-3 h-3 mr-1" /> Owned
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="text-4xl mb-3 text-center">{item.image_url}</div>
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <span className="font-bold text-primary">🌱 {item.seed_cost}</span>
                        </div>
                        {!owned && (
                          <Button
                            className="w-full mt-3"
                            variant={canAfford ? "default" : "outline"}
                            disabled={!canAfford || isPurchasing || !userId}
                            onClick={() => handlePurchase(item.id, item.name, item.seed_cost)}
                          >
                            {isPurchasing ? (
                              <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Purchasing...
                              </span>
                            ) : canAfford ? (
                              'Purchase'
                            ) : (
                              `Need ${item.seed_cost - seedPoints} more seeds`
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {getFilteredItems(cat.id).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No items available in this category
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
