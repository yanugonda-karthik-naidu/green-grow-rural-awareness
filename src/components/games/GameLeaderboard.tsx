import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Crown, Zap, Calendar, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  seed_points: number;
  location: string | null;
  rank: number;
}

type TimeFilter = 'all-time' | 'monthly' | 'weekly';

export const GameLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<TimeFilter>('all-time');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();

    // Realtime subscription
    const channel = supabase
      .channel('game-leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data: progressData, error } = await supabase
        .from('user_progress')
        .select('user_id, seed_points')
        .order('seed_points', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch display names
      const userIds = (progressData || []).map(p => p.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, location')
        .in('id', userIds);

      const profileMap = new Map(
        (profiles || []).map(p => [p.id, p])
      );

      const ranked: LeaderboardEntry[] = (progressData || [])
        .filter(p => p.seed_points > 0)
        .map((p, i) => ({
          user_id: p.user_id,
          display_name: profileMap.get(p.user_id)?.display_name || 'Eco Player',
          seed_points: p.seed_points || 0,
          location: profileMap.get(p.user_id)?.location || null,
          rank: i + 1,
        }));

      setEntries(ranked);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    }
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="w-5 text-center text-xs font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-primary/10 border-primary/30';
    if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/20';
    if (rank === 2) return 'bg-gray-500/5 border-gray-500/10';
    if (rank === 3) return 'bg-amber-500/5 border-amber-500/10';
    return 'bg-background border-muted/50';
  };

  const currentUserEntry = entries.find(e => e.user_id === user?.id);

  return (
    <Card className="border-2 border-yellow-500/30 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Game Leaderboard
          </span>
          {currentUserEntry && (
            <Badge variant="secondary" className="text-xs">
              Your Rank: #{currentUserEntry.rank}
            </Badge>
          )}
        </CardTitle>
        {/* Time filters */}
        <div className="flex gap-1.5 mt-2">
          {([
            { id: 'all-time', label: 'All Time', icon: TrendingUp },
            { id: 'monthly', label: 'Monthly', icon: Calendar },
            { id: 'weekly', label: 'Weekly', icon: Zap },
          ] as const).map(f => (
            <Button
              key={f.id}
              size="sm"
              variant={filter === f.id ? 'default' : 'outline'}
              onClick={() => setFilter(f.id)}
              className="text-xs flex-1"
            >
              <f.icon className="h-3 w-3 mr-1" />
              {f.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm animate-pulse">
            Loading rankings...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No rankings yet. Play games to earn seeds! 🌱
          </div>
        ) : (
          entries.slice(0, 20).map(entry => {
            const isCurrentUser = entry.user_id === user?.id;
            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${getRankBg(entry.rank, isCurrentUser)} ${isCurrentUser ? 'ring-1 ring-primary/30' : ''}`}
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                    {entry.display_name}
                    {isCurrentUser && <span className="text-xs ml-1 text-muted-foreground">(You)</span>}
                  </p>
                  {entry.location && (
                    <p className="text-[10px] text-muted-foreground truncate">📍 {entry.location}</p>
                  )}
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  <Zap className="h-3 w-3 mr-0.5 text-yellow-600" />
                  {entry.seed_points.toLocaleString()}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
