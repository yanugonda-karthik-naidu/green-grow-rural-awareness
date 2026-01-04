import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  TreePine, 
  Trophy, 
  Flame, 
  TrendingUp, 
  Leaf,
  Award,
  CalendarDays,
  CalendarRange
} from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

interface ActivitySummaryProps {
  userId: string | undefined;
}

interface PeriodStats {
  treesPlanted: number;
  achievementsEarned: number;
  challengesCompleted: number;
  co2Reduced: number;
  o2Generated: number;
  seedsEarned: number;
}

type PeriodType = 'weekly' | 'monthly' | 'yearly';

const fetchStats = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<PeriodStats> => {
  // Fetch trees planted in period
  const { data: trees } = await supabase
    .from('planted_trees')
    .select('impact_co2_kg, impact_o2_l_per_day')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  // Fetch achievements in period
  const { data: achievements } = await supabase
    .from('achievements')
    .select('seeds_earned')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  // Fetch challenges completed in period
  const { data: challenges } = await supabase
    .from('user_challenge_completions')
    .select('seeds_earned')
    .eq('user_id', userId)
    .gte('completed_at', startDate.toISOString())
    .lte('completed_at', endDate.toISOString());

  const treesPlanted = trees?.length || 0;
  const co2Reduced = trees?.reduce((sum, t) => sum + (Number(t.impact_co2_kg) || 0), 0) || 0;
  const o2Generated = trees?.reduce((sum, t) => sum + (Number(t.impact_o2_l_per_day) || 0), 0) || 0;
  const achievementsEarned = achievements?.length || 0;
  const challengesCompleted = challenges?.length || 0;
  const seedsFromAchievements = achievements?.reduce((sum, a) => sum + (a.seeds_earned || 0), 0) || 0;
  const seedsFromChallenges = challenges?.reduce((sum, c) => sum + (c.seeds_earned || 0), 0) || 0;

  return {
    treesPlanted,
    achievementsEarned,
    challengesCompleted,
    co2Reduced,
    o2Generated,
    seedsEarned: seedsFromAchievements + seedsFromChallenges,
  };
};

const StatGrid = ({ stats }: { stats: PeriodStats }) => {
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

  if (!hasActivity) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <TreePine className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No activity in this period yet</p>
        <p className="text-sm mt-1">Plant a tree or complete a challenge to get started!</p>
      </div>
    );
  }

  return (
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
  );
};

export const ActivitySummary = ({ userId }: ActivitySummaryProps) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('weekly');
  const [weeklyStats, setWeeklyStats] = useState<PeriodStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<PeriodStats | null>(null);
  const [yearlyStats, setYearlyStats] = useState<PeriodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRanges, setDateRanges] = useState({
    weekly: { start: new Date(), end: new Date() },
    monthly: { start: new Date(), end: new Date() },
    yearly: { start: new Date(), end: new Date() },
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const now = new Date();
        
        // Calculate date ranges
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const yearStart = startOfYear(now);
        const yearEnd = endOfYear(now);

        setDateRanges({
          weekly: { start: weekStart, end: weekEnd },
          monthly: { start: monthStart, end: monthEnd },
          yearly: { start: yearStart, end: yearEnd },
        });

        // Fetch all stats in parallel
        const [weekly, monthly, yearly] = await Promise.all([
          fetchStats(userId, weekStart, weekEnd),
          fetchStats(userId, monthStart, monthEnd),
          fetchStats(userId, yearStart, yearEnd),
        ]);

        setWeeklyStats(weekly);
        setMonthlyStats(monthly);
        setYearlyStats(yearly);
      } catch (error) {
        console.error('Error fetching activity stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPeriodLabel = (period: PeriodType) => {
    const range = dateRanges[period];
    switch (period) {
      case 'weekly':
        return `${format(range.start, "MMM d")} - ${format(range.end, "MMM d, yyyy")}`;
      case 'monthly':
        return format(range.start, "MMMM yyyy");
      case 'yearly':
        return format(range.start, "yyyy");
    }
  };

  const periodIcons = {
    weekly: Calendar,
    monthly: CalendarDays,
    yearly: CalendarRange,
  };

  const ActiveIcon = periodIcons[activePeriod];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <ActiveIcon className="h-5 w-5" />
            Activity Summary
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {getPeriodLabel(activePeriod)}
          </Badge>
        </div>
        <CardDescription>
          Your activity and environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activePeriod} onValueChange={(v) => setActivePeriod(v as PeriodType)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">This Week</span>
              <span className="sm:hidden">Week</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">This Month</span>
              <span className="sm:hidden">Month</span>
            </TabsTrigger>
            <TabsTrigger value="yearly" className="gap-2">
              <CalendarRange className="h-4 w-4" />
              <span className="hidden sm:inline">This Year</span>
              <span className="sm:hidden">Year</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            {weeklyStats && <StatGrid stats={weeklyStats} />}
          </TabsContent>
          
          <TabsContent value="monthly">
            {monthlyStats && <StatGrid stats={monthlyStats} />}
          </TabsContent>
          
          <TabsContent value="yearly">
            {yearlyStats && <StatGrid stats={yearlyStats} />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};