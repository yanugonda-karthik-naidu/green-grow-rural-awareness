import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
  CalendarRange,
  Download,
  BarChart3
} from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subWeeks } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

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

interface TrendDataPoint {
  period: string;
  trees: number;
  co2: number;
  o2: number;
  achievements: number;
}

type PeriodType = 'weekly' | 'monthly' | 'yearly';

const fetchStats = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<PeriodStats> => {
  const { data: trees } = await supabase
    .from('planted_trees')
    .select('impact_co2_kg, impact_o2_l_per_day')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const { data: achievements } = await supabase
    .from('achievements')
    .select('seeds_earned')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

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

const fetchTrendData = async (
  userId: string,
  periodType: PeriodType
): Promise<TrendDataPoint[]> => {
  const trendData: TrendDataPoint[] = [];
  const now = new Date();
  
  if (periodType === 'weekly') {
    // Last 6 weeks
    for (let i = 5; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const stats = await fetchStats(userId, weekStart, weekEnd);
      trendData.push({
        period: format(weekStart, "MMM d"),
        trees: stats.treesPlanted,
        co2: Math.round(stats.co2Reduced * 10) / 10,
        o2: Math.round(stats.o2Generated),
        achievements: stats.achievementsEarned,
      });
    }
  } else if (periodType === 'monthly') {
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      const stats = await fetchStats(userId, monthStart, monthEnd);
      trendData.push({
        period: format(monthStart, "MMM"),
        trees: stats.treesPlanted,
        co2: Math.round(stats.co2Reduced * 10) / 10,
        o2: Math.round(stats.o2Generated),
        achievements: stats.achievementsEarned,
      });
    }
  } else {
    // Last 3 years
    for (let i = 2; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31);
      const stats = await fetchStats(userId, yearStart, yearEnd);
      trendData.push({
        period: year.toString(),
        trees: stats.treesPlanted,
        co2: Math.round(stats.co2Reduced * 10) / 10,
        o2: Math.round(stats.o2Generated),
        achievements: stats.achievementsEarned,
      });
    }
  }
  
  return trendData;
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

const chartConfig = {
  trees: {
    label: "Trees Planted",
    color: "hsl(142 71% 35%)",
  },
  co2: {
    label: "CO₂ Reduced (kg)",
    color: "hsl(160 60% 45%)",
  },
  o2: {
    label: "O₂ Generated (L)",
    color: "hsl(200 80% 50%)",
  },
  achievements: {
    label: "Achievements",
    color: "hsl(45 100% 50%)",
  },
};

const TrendChart = ({ data, periodType }: { data: TrendDataPoint[], periodType: PeriodType }) => {
  const hasData = data.some(d => d.trees > 0 || d.co2 > 0 || d.achievements > 0);
  
  if (!hasData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No trend data available</p>
        <p className="text-sm mt-1">Start planting trees to see your progress over time!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trees & Achievements Bar Chart */}
      <div className="h-64">
        <p className="text-sm font-medium mb-2 text-muted-foreground">Trees & Achievements</p>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="period" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="trees" name="Trees" fill="hsl(142 71% 35%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="achievements" name="Achievements" fill="hsl(45 100% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* CO2 & O2 Line Chart */}
      <div className="h-64">
        <p className="text-sm font-medium mb-2 text-muted-foreground">Environmental Impact</p>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="period" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="co2" 
                name="CO₂ (kg)" 
                stroke="hsl(160 60% 45%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(160 60% 45%)" }}
              />
              <Line 
                type="monotone" 
                dataKey="o2" 
                name="O₂ (L/day)" 
                stroke="hsl(200 80% 50%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(200 80% 50%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

const generatePDF = (
  stats: PeriodStats,
  trendData: TrendDataPoint[],
  periodType: PeriodType,
  dateRange: { start: Date; end: Date }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Environmental Impact Report", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  const periodLabel = periodType === 'weekly' 
    ? `Week of ${format(dateRange.start, "MMM d")} - ${format(dateRange.end, "MMM d, yyyy")}`
    : periodType === 'monthly'
    ? format(dateRange.start, "MMMM yyyy")
    : format(dateRange.start, "yyyy");
  doc.text(periodLabel, pageWidth / 2, 32, { align: "center" });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  
  // Summary Section
  doc.setFontSize(16);
  doc.text("Activity Summary", 14, 55);
  
  const summaryData = [
    ["Trees Planted", stats.treesPlanted.toString()],
    ["CO₂ Reduced", `${stats.co2Reduced.toFixed(1)} kg`],
    ["O₂ Generated", `${stats.o2Generated.toFixed(0)} L/day`],
    ["Achievements Earned", stats.achievementsEarned.toString()],
    ["Challenges Completed", stats.challengesCompleted.toString()],
    ["Seeds Earned", stats.seedsEarned.toString()],
  ];
  
  autoTable(doc, {
    startY: 60,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    styles: { halign: 'center' },
  });
  
  // Trend Data Section
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(16);
  doc.text("Progress Over Time", 14, finalY + 15);
  
  const trendHeaders = ["Period", "Trees", "CO₂ (kg)", "O₂ (L/day)", "Achievements"];
  const trendRows = trendData.map(d => [
    d.period,
    d.trees.toString(),
    d.co2.toString(),
    d.o2.toString(),
    d.achievements.toString(),
  ]);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [trendHeaders],
    body: trendRows,
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    styles: { halign: 'center' },
  });
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`, pageWidth / 2, footerY, { align: "center" });
  doc.text("🌳 Thank you for making a difference!", pageWidth / 2, footerY + 6, { align: "center" });
  
  // Save
  const filename = `environmental-impact-${periodType}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(filename);
  toast.success("Report downloaded successfully!");
};

export const ActivitySummary = ({ userId }: ActivitySummaryProps) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('weekly');
  const [showCharts, setShowCharts] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState<PeriodStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<PeriodStats | null>(null);
  const [yearlyStats, setYearlyStats] = useState<PeriodStats | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(false);
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

  useEffect(() => {
    const loadTrendData = async () => {
      if (!userId || !showCharts) return;
      
      setTrendLoading(true);
      try {
        const data = await fetchTrendData(userId, activePeriod);
        setTrendData(data);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      } finally {
        setTrendLoading(false);
      }
    };

    loadTrendData();
  }, [userId, activePeriod, showCharts]);

  const handleExportPDF = () => {
    const currentStats = activePeriod === 'weekly' ? weeklyStats 
      : activePeriod === 'monthly' ? monthlyStats 
      : yearlyStats;
    
    if (!currentStats) {
      toast.error("No data available to export");
      return;
    }
    
    generatePDF(currentStats, trendData, activePeriod, dateRanges[activePeriod]);
  };

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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getPeriodLabel(activePeriod)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCharts(!showCharts)}
              className="gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{showCharts ? "Hide" : "Show"} Charts</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
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

        {/* Trend Charts Section */}
        {showCharts && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Trends
            </h3>
            {trendLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <TrendChart data={trendData} periodType={activePeriod} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
