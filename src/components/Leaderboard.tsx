import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Crown, Leaf, Sparkles, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EquippedItem {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  seed_points: number;
  trees_planted: number;
  rank: number;
  equippedFrame?: EquippedItem | null;
  equippedBadges?: EquippedItem[];
  equippedTitle?: EquippedItem | null;
}

interface LeaderboardProps {
  currentUserId?: string;
  onRankChange?: (rank: number, category: string) => void;
}

// Helper to get frame class from item name
const getFrameClass = (frameName: string): string => {
  const frameMap: Record<string, string> = {
    'Golden Crown': 'frame-golden-crown',
    'Nature Guardian': 'frame-nature-guardian',
    'Fire Ring': 'frame-fire-ring',
    'Crystal Aura': 'frame-crystal-aura',
    'Rainbow Halo': 'frame-rainbow-halo',
  };
  return frameMap[frameName] || '';
};

// Get equipped items for a user from localStorage
const getEquippedItemsFromStorage = (userId: string): string[] => {
  const saved = localStorage.getItem(`equipped_items_${userId}`);
  return saved ? JSON.parse(saved) : [];
};

export const Leaderboard = ({ currentUserId, onRankChange }: LeaderboardProps) => {
  const [seedLeaderboard, setSeedLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [treeLeaderboard, setTreeLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousRanks, setPreviousRanks] = useState<{ seeds: number; trees: number }>({ seeds: 0, trees: 0 });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch user progress ordered by seed_points
        const { data: seedData } = await supabase
          .from('user_progress')
          .select('user_id, seed_points, trees_planted')
          .order('seed_points', { ascending: false })
          .limit(20);

        // Fetch user progress ordered by trees_planted
        const { data: treeData } = await supabase
          .from('user_progress')
          .select('user_id, seed_points, trees_planted')
          .order('trees_planted', { ascending: false })
          .limit(20);

        if (seedData || treeData) {
          const allUserIds = new Set([
            ...(seedData?.map(d => d.user_id) || []),
            ...(treeData?.map(d => d.user_id) || [])
          ]);

          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', Array.from(allUserIds));

          const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || []);

          // Get all equipped item IDs for current user if available
          const currentUserEquipped = currentUserId ? getEquippedItemsFromStorage(currentUserId) : [];
          
          // Fetch equipped item details if any
          let equippedItemsMap = new Map<string, EquippedItem>();
          if (currentUserEquipped.length > 0) {
            const { data: items } = await supabase
              .from('shop_items')
              .select('id, name, category, image_url')
              .in('id', currentUserEquipped);
            
            items?.forEach(item => equippedItemsMap.set(item.id, item));
          }

          const getEquippedForUser = (userId: string) => {
            if (userId !== currentUserId) return { frame: null, badges: [], title: null };
            
            const equipped = Array.from(equippedItemsMap.values());
            return {
              frame: equipped.find(i => i.category === 'frame') || null,
              badges: equipped.filter(i => i.category === 'badge'),
              title: equipped.find(i => i.category === 'title') || null,
            };
          };

          if (seedData) {
            const seedEntries = seedData
              .filter(d => (d.seed_points || 0) > 0)
              .map((d, idx) => {
                const equipped = getEquippedForUser(d.user_id);
                return {
                  user_id: d.user_id,
                  display_name: profileMap.get(d.user_id) || 'Anonymous',
                  seed_points: d.seed_points || 0,
                  trees_planted: d.trees_planted || 0,
                  rank: idx + 1,
                  equippedFrame: equipped.frame,
                  equippedBadges: equipped.badges,
                  equippedTitle: equipped.title,
                };
              });
            setSeedLeaderboard(seedEntries);
            
            // Check for rank changes
            const currentUserSeedRank = seedEntries.find(e => e.user_id === currentUserId)?.rank;
            if (currentUserSeedRank && currentUserSeedRank <= 10 && onRankChange) {
              if (previousRanks.seeds === 0 || currentUserSeedRank < previousRanks.seeds) {
                onRankChange(currentUserSeedRank, 'Seed Points');
              }
              setPreviousRanks(prev => ({ ...prev, seeds: currentUserSeedRank }));
            }
          }

          if (treeData) {
            const treeEntries = treeData
              .filter(d => (d.trees_planted || 0) > 0)
              .map((d, idx) => {
                const equipped = getEquippedForUser(d.user_id);
                return {
                  user_id: d.user_id,
                  display_name: profileMap.get(d.user_id) || 'Anonymous',
                  seed_points: d.seed_points || 0,
                  trees_planted: d.trees_planted || 0,
                  rank: idx + 1,
                  equippedFrame: equipped.frame,
                  equippedBadges: equipped.badges,
                  equippedTitle: equipped.title,
                };
              });
            setTreeLeaderboard(treeEntries);
            
            // Check for rank changes
            const currentUserTreeRank = treeEntries.find(e => e.user_id === currentUserId)?.rank;
            if (currentUserTreeRank && currentUserTreeRank <= 10 && onRankChange) {
              if (previousRanks.trees === 0 || currentUserTreeRank < previousRanks.trees) {
                onRankChange(currentUserTreeRank, 'Trees Planted');
              }
              setPreviousRanks(prev => ({ ...prev, trees: currentUserTreeRank }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, fetchLeaderboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-primary/20 border-primary/50';
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
    return 'bg-card hover:bg-accent/50';
  };

  const LeaderboardList = ({ entries, metric }: { entries: LeaderboardEntry[], metric: 'seeds' | 'trees' }) => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-4">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Be the first!</p>
          </div>
        ) : (
          entries.map((entry) => {
            const isCurrentUser = entry.user_id === currentUserId;
            const frameClass = entry.equippedFrame ? getFrameClass(entry.equippedFrame.name) : '';
            
            return (
              <Card 
                key={entry.user_id} 
                className={`p-3 border transition-all ${getRankBg(entry.rank, isCurrentUser)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${frameClass}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {entry.display_name}
                        </p>
                        {/* Show equipped title */}
                        {entry.equippedTitle && (
                          <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-600 border-purple-500/30">
                            {entry.equippedTitle.image_url} {entry.equippedTitle.name}
                          </Badge>
                        )}
                        {/* Show equipped badges */}
                        {entry.equippedBadges?.map(badge => (
                          <span key={badge.id} className="text-lg badge-glow" title={badge.name}>
                            {badge.image_url}
                          </span>
                        ))}
                        {isCurrentUser && <Badge variant="secondary" className="text-xs">You</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {metric === 'seeds' 
                          ? `🌳 ${entry.trees_planted} trees planted`
                          : `🌱 ${entry.seed_points} seed points`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      metric === 'seeds' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {metric === 'seeds' ? entry.seed_points : entry.trees_planted}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric === 'seeds' ? 'seeds' : 'trees'}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </ScrollArea>
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse text-muted-foreground">Loading leaderboard...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full">
          <Trophy className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Community Leaderboard</h2>
          <p className="text-sm text-muted-foreground">Top contributors across the community</p>
        </div>
      </div>

      <Tabs defaultValue="seeds" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="seeds" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Seed Points
          </TabsTrigger>
          <TabsTrigger value="trees" className="gap-2">
            <Leaf className="h-4 w-4" />
            Trees Planted
          </TabsTrigger>
        </TabsList>
        <TabsContent value="seeds">
          <LeaderboardList entries={seedLeaderboard} metric="seeds" />
        </TabsContent>
        <TabsContent value="trees">
          <LeaderboardList entries={treeLeaderboard} metric="trees" />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
