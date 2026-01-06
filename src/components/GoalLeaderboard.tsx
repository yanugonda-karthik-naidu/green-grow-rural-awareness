import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Target, Flame, Medal, Crown } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  goalsCompleted: number;
  currentStreak: number;
  rank: number;
}

interface GoalLeaderboardProps {
  currentUserId?: string;
}

export const GoalLeaderboard = ({ currentUserId }: GoalLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [currentUserId]);

  const fetchLeaderboard = async () => {
    try {
      // Get all completed goals grouped by user
      const { data: completedGoals } = await supabase
        .from('user_goals')
        .select('user_id, month, is_completed')
        .eq('is_completed', true)
        .order('month', { ascending: false });

      if (!completedGoals) {
        setLoading(false);
        return;
      }

      // Group by user and calculate stats
      const userStats = new Map<string, { completed: number; months: string[] }>();
      
      completedGoals.forEach(goal => {
        const existing = userStats.get(goal.user_id) || { completed: 0, months: [] };
        existing.completed++;
        existing.months.push(goal.month);
        userStats.set(goal.user_id, existing);
      });

      // Get profile names
      const userIds = Array.from(userStats.keys());
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.display_name || 'Anonymous']) || []);

      // Calculate streaks and create leaderboard entries
      const entries: LeaderboardEntry[] = Array.from(userStats.entries()).map(([userId, stats]) => {
        // Calculate current streak (consecutive months)
        const sortedMonths = stats.months.sort().reverse();
        let streak = 0;
        const now = new Date();
        let expectedMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        for (const monthStr of sortedMonths) {
          const monthDate = new Date(monthStr);
          const expectedStr = expectedMonth.toISOString().slice(0, 10);
          const monthCompare = monthDate.toISOString().slice(0, 10);
          
          if (monthCompare === expectedStr) {
            streak++;
            expectedMonth.setMonth(expectedMonth.getMonth() - 1);
          } else {
            break;
          }
        }

        return {
          userId,
          displayName: profileMap.get(userId) || 'Anonymous',
          goalsCompleted: stats.completed,
          currentStreak: streak,
          rank: 0,
        };
      });

      // Sort by goals completed, then by streak
      entries.sort((a, b) => {
        if (b.goalsCompleted !== a.goalsCompleted) {
          return b.goalsCompleted - a.goalsCompleted;
        }
        return b.currentStreak - a.currentStreak;
      });

      // Assign ranks
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Find current user's rank
      if (currentUserId) {
        const userEntry = entries.find(e => e.userId === currentUserId);
        setUserRank(userEntry || null);
      }

      setLeaderboard(entries.slice(0, 10));
    } catch (error) {
      console.error('Error fetching goal leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center font-bold text-muted-foreground">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Goal Completers Leaderboard
        </CardTitle>
        <CardDescription>
          Top planters who consistently hit their monthly goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No completed goals yet</p>
            <p className="text-sm mt-1">Be the first to complete a monthly goal!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  entry.userId === currentUserId
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {entry.displayName}
                      {entry.userId === currentUserId && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.goalsCompleted} goal{entry.goalsCompleted !== 1 ? 's' : ''} completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.currentStreak > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {entry.currentStreak} month streak
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {/* Show current user if not in top 10 */}
            {userRank && userRank.rank > 10 && (
              <>
                <div className="text-center text-muted-foreground text-sm py-2">• • •</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">
                      <span className="font-bold text-muted-foreground">{userRank.rank}</span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {userRank.displayName}
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userRank.goalsCompleted} goal{userRank.goalsCompleted !== 1 ? 's' : ''} completed
                      </p>
                    </div>
                  </div>
                  {userRank.currentStreak > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {userRank.currentStreak} month streak
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
