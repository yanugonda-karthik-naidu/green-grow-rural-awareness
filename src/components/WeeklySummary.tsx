import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  TreePine, 
  Trophy, 
  Flame, 
  TrendingUp, 
  Leaf,
  Award
} from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

interface WeeklySummaryProps {
  userId: string | undefined;
}

interface WeeklyStats {
  treesPlanted: number;
  achievementsEarned: number;
  challengesCompleted: number;
  co2Reduced: number;
  o2Generated: number;
  seedsEarned: number;
}

export const WeeklySummary = ({ userId }: WeeklySummaryProps) => {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekRange, setWeekRange] = useState({ start: new Date(), end: new Date() });

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
        setWeekRange({ start: weekStart, end: weekEnd });

        // Fetch trees planted this week
        const { data: trees, error: treesError } = await supabase
          .from('planted_trees')
          .select('impact_co2_kg, impact_o2_l_per_day')
          .eq('user_id', userId)
          .gte('created_at', weekStart.toISOString())
          .lte('created_at', weekEnd.toISOString());

        // Fetch achievements this week
        const { data: achievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('seeds_earned')
          .eq('user_id', userId)
          .gte('created_at', weekStart.toISOString())
          .lte('created_at', weekEnd.toISOString());

        // Fetch challenges completed this week
        const { data: challenges, error: challengesError } = await supabase
          .from('user_challenge_completions')
          .select('seeds_earned')
          .eq('user_id', userId)
          .gte('completed_at', weekStart.toISOString())
          .lte('completed_at', weekEnd.toISOString());

        const treesPlanted = trees?.length || 0;
        const co2Reduced = trees?.reduce((sum, t) => sum + (Number(t.impact_co2_kg) || 0), 0) || 0;
        const o2Generated = trees?.reduce((sum, t) => sum + (Number(t.impact_o2_l_per_day) || 0), 0) || 0;
        const achievementsEarned = achievements?.length || 0;
        const challengesCompleted = challenges?.length || 0;
        const seedsFromAchievements = achievements?.reduce((sum, a) => sum + (a.seeds_earned || 0), 0) || 0;
        const seedsFromChallenges = challenges?.reduce((sum, c) => sum + (c.seeds_earned || 0), 0) || 0;

        setStats({
          treesPlanted,
          achievementsEarned,
          challengesCompleted,
          co2Reduced,
          o2Generated,
          seedsEarned: seedsFromAchievements + seedsFromChallenges,
        });
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyStats();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      icon: TreePine,
      label: "Trees Planted",
      value: stats.treesPlanted,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Trophy,
      label: "Achievements",
      value: stats.achievementsEarned,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Flame,
      label: "Challenges",
      value: stats.challengesCompleted,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Leaf,
      label: "CO₂ Reduced",
      value: `${stats.co2Reduced.toFixed(1)} kg`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: TrendingUp,
      label: "O₂ Generated",
      value: `${stats.o2Generated.toFixed(0)} L/day`,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Award,
      label: "Seeds Earned",
      value: stats.seedsEarned,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
  ];

  const hasActivity = stats.treesPlanted > 0 || stats.achievementsEarned > 0 || stats.challengesCompleted > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Summary
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {format(weekRange.start, "MMM d")} - {format(weekRange.end, "MMM d, yyyy")}
          </Badge>
        </div>
        <CardDescription>
          Your activity and impact this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasActivity ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statItems.map((item) => (
              <div
                key={item.label}
                className={`p-4 rounded-lg ${item.bgColor} flex flex-col items-center text-center`}
              >
                <item.icon className={`h-6 w-6 ${item.color} mb-2`} />
                <span className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <TreePine className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No activity this week yet</p>
            <p className="text-sm mt-1">Plant a tree or complete a challenge to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};