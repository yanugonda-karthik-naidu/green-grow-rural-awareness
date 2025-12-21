import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, Sparkles, TreeDeciduous, Palette, Crown, 
  Star, Zap, Heart, Shield, Gift, Lock, Check, Leaf
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'trees' | 'badges' | 'themes' | 'features';
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface RewardsShopProps {
  seedPoints: number;
  purchasedItems: string[];
  onPurchase: (itemId: string, cost: number) => Promise<void>;
}

const rewardItems: RewardItem[] = [
  // Virtual Trees
  { id: 'golden_oak', name: 'Golden Oak', description: 'A rare golden oak tree for your forest', cost: 100, category: 'trees', icon: <TreeDeciduous className="h-6 w-6 text-yellow-500" />, rarity: 'rare' },
  { id: 'crystal_pine', name: 'Crystal Pine', description: 'A magical crystalline pine tree', cost: 250, category: 'trees', icon: <TreeDeciduous className="h-6 w-6 text-cyan-400" />, rarity: 'epic' },
  { id: 'rainbow_willow', name: 'Rainbow Willow', description: 'A legendary rainbow willow tree', cost: 500, category: 'trees', icon: <TreeDeciduous className="h-6 w-6 text-purple-500" />, rarity: 'legendary' },
  { id: 'sakura_blossom', name: 'Sakura Blossom', description: 'Beautiful cherry blossom tree', cost: 150, category: 'trees', icon: <TreeDeciduous className="h-6 w-6 text-pink-400" />, rarity: 'rare' },
  { id: 'ancient_redwood', name: 'Ancient Redwood', description: 'Majestic ancient redwood', cost: 300, category: 'trees', icon: <TreeDeciduous className="h-6 w-6 text-red-700" />, rarity: 'epic' },
  
  // Special Badges
  { id: 'eco_warrior', name: 'Eco Warrior Badge', description: 'Show your commitment to the environment', cost: 75, category: 'badges', icon: <Shield className="h-6 w-6 text-green-500" />, rarity: 'common' },
  { id: 'nature_champion', name: 'Nature Champion', description: 'Champion of nature badge', cost: 200, category: 'badges', icon: <Crown className="h-6 w-6 text-yellow-500" />, rarity: 'rare' },
  { id: 'tree_whisperer', name: 'Tree Whisperer', description: 'Legendary tree whisperer badge', cost: 400, category: 'badges', icon: <Star className="h-6 w-6 text-purple-500" />, rarity: 'epic' },
  { id: 'forest_guardian', name: 'Forest Guardian', description: 'Ultimate forest guardian badge', cost: 750, category: 'badges', icon: <Heart className="h-6 w-6 text-red-500" />, rarity: 'legendary' },
  
  // Themes
  { id: 'theme_sunset', name: 'Sunset Theme', description: 'Beautiful sunset color theme', cost: 150, category: 'themes', icon: <Palette className="h-6 w-6 text-orange-500" />, rarity: 'rare' },
  { id: 'theme_ocean', name: 'Ocean Theme', description: 'Calming ocean blue theme', cost: 150, category: 'themes', icon: <Palette className="h-6 w-6 text-blue-500" />, rarity: 'rare' },
  { id: 'theme_aurora', name: 'Aurora Theme', description: 'Magical aurora borealis theme', cost: 350, category: 'themes', icon: <Palette className="h-6 w-6 text-teal-400" />, rarity: 'epic' },
  
  // Features
  { id: 'double_seeds', name: 'Double Seeds (24h)', description: 'Earn double seeds for 24 hours', cost: 100, category: 'features', icon: <Zap className="h-6 w-6 text-yellow-500" />, rarity: 'common' },
  { id: 'priority_badge', name: 'Priority Display', description: 'Your profile appears first in community', cost: 200, category: 'features', icon: <Star className="h-6 w-6 text-amber-500" />, rarity: 'rare' },
  { id: 'custom_frame', name: 'Custom Profile Frame', description: 'Unique animated profile frame', cost: 300, category: 'features', icon: <Gift className="h-6 w-6 text-pink-500" />, rarity: 'epic' },
];

export const RewardsShop = ({ seedPoints, purchasedItems, onPurchase }: RewardsShopProps) => {
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'legendary': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 dark:border-gray-600';
      case 'rare': return 'border-blue-400 dark:border-blue-500';
      case 'epic': return 'border-purple-400 dark:border-purple-500';
      case 'legendary': return 'border-yellow-400 dark:border-yellow-500 shadow-lg shadow-yellow-500/20';
      default: return 'border-border';
    }
  };

  const handlePurchase = async (item: RewardItem) => {
    if (purchasedItems.includes(item.id)) {
      toast.info('You already own this item!');
      return;
    }

    if (seedPoints < item.cost) {
      toast.error(`Not enough seeds! You need ${item.cost - seedPoints} more seeds.`);
      return;
    }

    setPurchasing(item.id);
    try {
      await onPurchase(item.id, item.cost);
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#22c55e', '#4ade80', '#86efac']
      });
      
      toast.success(`🎉 Purchased ${item.name}!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trees': return <TreeDeciduous className="h-4 w-4" />;
      case 'badges': return <Shield className="h-4 w-4" />;
      case 'themes': return <Palette className="h-4 w-4" />;
      case 'features': return <Zap className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const ItemCard = ({ item }: { item: RewardItem }) => {
    const owned = purchasedItems.includes(item.id);
    const canAfford = seedPoints >= item.cost;

    return (
      <Card className={`p-4 transition-all hover:shadow-lg ${getRarityBorder(item.rarity)} border-2 ${
        owned ? 'opacity-75 bg-green-500/5' : ''
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${getRarityColor(item.rarity)} border`}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-foreground">{item.name}</h4>
              <Badge variant="outline" className={`text-xs ${getRarityColor(item.rarity)}`}>
                {item.rarity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 font-bold">
                <Leaf className="h-4 w-4" />
                {item.cost}
              </div>
              
              {owned ? (
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 gap-1">
                  <Check className="h-3 w-3" />
                  Owned
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford || purchasing === item.id}
                  className={`gap-1.5 ${canAfford ? '' : 'opacity-50'}`}
                >
                  {purchasing === item.id ? (
                    'Buying...'
                  ) : !canAfford ? (
                    <>
                      <Lock className="h-3 w-3" />
                      {item.cost - seedPoints} more
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-3 w-3" />
                      Buy
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const filterItems = (category: string) => rewardItems.filter(item => item.category === category);

  return (
    <Card className="p-6 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full">
            <ShoppingBag className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Rewards Shop</h2>
            <p className="text-sm text-muted-foreground">Spend your seeds on exclusive rewards!</p>
          </div>
        </div>
        
        <Badge className="text-lg px-4 py-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
          <Sparkles className="h-5 w-5 mr-2" />
          {seedPoints} Seeds
        </Badge>
      </div>

      <Tabs defaultValue="trees" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="trees" className="gap-1.5">
            {getCategoryIcon('trees')}
            <span className="hidden sm:inline">Trees</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-1.5">
            {getCategoryIcon('badges')}
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
          <TabsTrigger value="themes" className="gap-1.5">
            {getCategoryIcon('themes')}
            <span className="hidden sm:inline">Themes</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-1.5">
            {getCategoryIcon('features')}
            <span className="hidden sm:inline">Features</span>
          </TabsTrigger>
        </TabsList>

        {['trees', 'badges', 'themes', 'features'].map(category => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[400px]">
              <div className="grid gap-4 pr-4">
                {filterItems(category).map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
