import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Target, TreePine, Plus, Edit2, CheckCircle2, TrendingUp, Calendar, CalendarDays } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { toast } from "sonner";

interface GoalSettingProps {
  userId: string | undefined;
}

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  month: string;
  is_completed: boolean;
}

type GoalPeriod = 'weekly' | 'monthly';

export const GoalSetting = ({ userId }: GoalSettingProps) => {
  const [monthlyGoals, setMonthlyGoals] = useState<Goal[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [targetValue, setTargetValue] = useState(5);
  const [goalPeriod, setGoalPeriod] = useState<GoalPeriod>('monthly');
  const [activePeriod, setActivePeriod] = useState<GoalPeriod>('weekly');

  const now = new Date();
  const currentMonth = format(now, "yyyy-MM-01");
  const currentMonthLabel = format(now, "MMMM yyyy");
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const currentWeek = format(weekStart, "yyyy-MM-dd");
  const currentWeekLabel = `Week of ${format(weekStart, "MMM d")}`;

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (userId) {
      updateGoalProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchGoals = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const [monthlyRes, weeklyRes] = await Promise.all([
        supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', userId)
          .eq('month', currentMonth)
          .eq('goal_type', 'trees'),
        supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', userId)
          .eq('month', currentWeek)
          .eq('goal_type', 'trees_weekly'),
      ]);

      setMonthlyGoals(monthlyRes.data || []);
      setWeeklyGoals(weeklyRes.data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndAwardBadges = async (isNewCompletion: boolean, isWeekly: boolean) => {
    if (!userId || !isNewCompletion) return;

    // Check for "Goal Crusher" badge (first goal completed)
    const { data: existingCrusherBadge } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_name', 'Goal Crusher')
      .single();

    if (!existingCrusherBadge) {
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_name: 'Goal Crusher',
      });
      await supabase.from('user_notifications').insert({
        user_id: userId,
        title: '🎯 New Badge: Goal Crusher!',
        message: 'You completed your first goal! Keep up the great work!',
        notification_type: 'achievement',
      });
      toast.success("🎯 Badge earned: Goal Crusher!");
    }

    // Weekly streak badge
    if (isWeekly) {
      const { data: weeklyGoals } = await supabase
        .from('user_goals')
        .select('month')
        .eq('user_id', userId)
        .eq('goal_type', 'trees_weekly')
        .eq('is_completed', true)
        .order('month', { ascending: false });

      if (weeklyGoals && weeklyGoals.length >= 4) {
        const { data: existingWeeklyBadge } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', userId)
          .eq('badge_name', 'Weekly Warrior')
          .single();

        if (!existingWeeklyBadge) {
          await supabase.from('user_badges').insert({
            user_id: userId,
            badge_name: 'Weekly Warrior',
          });
          await supabase.from('user_notifications').insert({
            user_id: userId,
            title: '⚡ New Badge: Weekly Warrior!',
            message: 'Amazing! You completed 4 weekly goals!',
            notification_type: 'achievement',
          });
          toast.success("⚡ Badge earned: Weekly Warrior!");
        }
      }
    }

    // Monthly streak badges
    if (!isWeekly) {
      const { data: allCompletedGoals } = await supabase
        .from('user_goals')
        .select('month')
        .eq('user_id', userId)
        .eq('goal_type', 'trees')
        .eq('is_completed', true)
        .order('month', { ascending: false });

      if (allCompletedGoals && allCompletedGoals.length >= 3) {
        let streak = 0;
        let expectedMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        for (const goal of allCompletedGoals) {
          const monthDate = new Date(goal.month);
          const expectedStr = format(expectedMonth, 'yyyy-MM-dd');
          const monthStr = format(monthDate, 'yyyy-MM-dd');

          if (monthStr === expectedStr) {
            streak++;
            expectedMonth.setMonth(expectedMonth.getMonth() - 1);
          } else {
            break;
          }
        }

        if (streak >= 3) {
          const { data: existingStreakBadge } = await supabase
            .from('user_badges')
            .select('id')
            .eq('user_id', userId)
            .eq('badge_name', 'Consistent Planter')
            .single();

          if (!existingStreakBadge) {
            await supabase.from('user_badges').insert({
              user_id: userId,
              badge_name: 'Consistent Planter',
            });
            await supabase.from('user_notifications').insert({
              user_id: userId,
              title: '🔥 New Badge: Consistent Planter!',
              message: 'Amazing! You completed your goals 3 months in a row!',
              notification_type: 'achievement',
            });
            toast.success("🔥 Badge earned: Consistent Planter!");
          }
        }

        if (streak >= 6) {
          const { data: existingChampionBadge } = await supabase
            .from('user_badges')
            .select('id')
            .eq('user_id', userId)
            .eq('badge_name', 'Goal Champion')
            .single();

          if (!existingChampionBadge) {
            await supabase.from('user_badges').insert({
              user_id: userId,
              badge_name: 'Goal Champion',
            });
            await supabase.from('user_notifications').insert({
              user_id: userId,
              title: '👑 New Badge: Goal Champion!',
              message: 'Incredible! 6 months of consistent goal completion!',
              notification_type: 'achievement',
            });
            toast.success("👑 Badge earned: Goal Champion!");
          }
        }
      }
    }
  };

  const updateGoalProgress = async () => {
    if (!userId) return;

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Get trees planted this month
    const { data: monthlyTrees } = await supabase
      .from('planted_trees')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', monthEnd.toISOString());

    // Get trees planted this week
    const { data: weeklyTrees } = await supabase
      .from('planted_trees')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', weekStart.toISOString())
      .lte('created_at', weekEnd.toISOString());

    const monthlyCount = monthlyTrees?.length || 0;
    const weeklyCount = weeklyTrees?.length || 0;

    // Update monthly goal
    const { data: existingMonthlyGoals } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .eq('goal_type', 'trees');

    if (existingMonthlyGoals && existingMonthlyGoals.length > 0) {
      const goal = existingMonthlyGoals[0];
      const wasCompleted = goal.is_completed;
      const isCompleted = monthlyCount >= goal.target_value;

      await supabase
        .from('user_goals')
        .update({ current_value: monthlyCount, is_completed: isCompleted })
        .eq('id', goal.id);

      if (isCompleted && !wasCompleted) {
        await checkAndAwardBadges(true, false);
      }
    }

    // Update weekly goal
    const { data: existingWeeklyGoals } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentWeek)
      .eq('goal_type', 'trees_weekly');

    if (existingWeeklyGoals && existingWeeklyGoals.length > 0) {
      const goal = existingWeeklyGoals[0];
      const wasCompleted = goal.is_completed;
      const isCompleted = weeklyCount >= goal.target_value;

      await supabase
        .from('user_goals')
        .update({ current_value: weeklyCount, is_completed: isCompleted })
        .eq('id', goal.id);

      if (isCompleted && !wasCompleted) {
        await checkAndAwardBadges(true, true);
      }
    }

    fetchGoals();
  };

  const handleSaveGoal = async () => {
    if (!userId) return;

    const isWeekly = goalPeriod === 'weekly';
    const goalType = isWeekly ? 'trees_weekly' : 'trees';
    const periodKey = isWeekly ? currentWeek : currentMonth;

    try {
      if (editingGoal) {
        const { error } = await supabase
          .from('user_goals')
          .update({ target_value: targetValue })
          .eq('id', editingGoal.id);

        if (error) throw error;
        toast.success("Goal updated!");
      } else {
        const { error } = await supabase
          .from('user_goals')
          .insert({
            user_id: userId,
            goal_type: goalType,
            target_value: targetValue,
            current_value: 0,
            month: periodKey,
          });

        if (error) {
          if (error.code === '23505') {
            toast.error(`You already have a ${isWeekly ? 'weekly' : 'monthly'} tree goal`);
            return;
          }
          throw error;
        }
        toast.success("Goal created!");
      }

      setDialogOpen(false);
      setEditingGoal(null);
      setTargetValue(isWeekly ? 2 : 5);
      await updateGoalProgress();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error("Failed to save goal");
    }
  };

  const openEditDialog = (goal: Goal, period: GoalPeriod) => {
    setEditingGoal(goal);
    setTargetValue(goal.target_value);
    setGoalPeriod(period);
    setDialogOpen(true);
  };

  const openCreateDialog = (period: GoalPeriod) => {
    setEditingGoal(null);
    setTargetValue(period === 'weekly' ? 2 : 5);
    setGoalPeriod(period);
    setDialogOpen(true);
  };

  const weeklyGoal = weeklyGoals[0];
  const monthlyGoal = monthlyGoals[0];

  const renderGoalCard = (goal: Goal | undefined, period: GoalPeriod) => {
    const isWeekly = period === 'weekly';
    const progressPercentage = goal
      ? Math.min((goal.current_value / goal.target_value) * 100, 100)
      : 0;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isWeekly ? <Calendar className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
            {isWeekly ? currentWeekLabel : currentMonthLabel}
          </div>
          {!goal ? (
            <Button size="sm" onClick={() => openCreateDialog(period)} className="gap-1">
              <Plus className="h-4 w-4" />
              Set Goal
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog(goal, period)}
              className="gap-1"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {goal ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-primary" />
                <span className="font-medium">Trees Planted</span>
              </div>
              {goal.is_completed ? (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed!
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  In Progress
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {goal.current_value} / {goal.target_value} trees
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                {progressPercentage.toFixed(0)}% complete
              </p>
            </div>

            {!goal.is_completed && goal.target_value - goal.current_value > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Plant {goal.target_value - goal.current_value} more tree
                {goal.target_value - goal.current_value !== 1 ? 's' : ''} to reach your goal!
              </p>
            )}

            {goal.is_completed && (
              <p className="text-sm text-center text-green-600 font-medium">
                🎉 Congratulations! You've reached your {isWeekly ? 'weekly' : 'monthly'} goal!
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Target className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No {isWeekly ? 'weekly' : 'monthly'} goal set</p>
            <p className="text-sm mt-1">Set a goal to track your progress!</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goal Tracking
        </CardTitle>
        <CardDescription>Set and track your tree planting goals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activePeriod} onValueChange={(v) => setActivePeriod(v as GoalPeriod)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="weekly" className="gap-2">
              <Calendar className="h-4 w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Monthly
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">{renderGoalCard(weeklyGoal, 'weekly')}</TabsContent>
          <TabsContent value="monthly">{renderGoalCard(monthlyGoal, 'monthly')}</TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-primary" />
                {editingGoal ? "Edit Goal" : `Set ${goalPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Goal`}
              </DialogTitle>
              <DialogDescription>
                Set a target for how many trees you want to plant this {goalPeriod === 'weekly' ? 'week' : 'month'}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="target">
                  Trees to plant ({goalPeriod === 'weekly' ? currentWeekLabel : currentMonthLabel})
                </Label>
                <Input
                  id="target"
                  type="number"
                  min={1}
                  max={100}
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(goalPeriod === 'weekly' ? [1, 2, 3, 5, 7] : [3, 5, 10, 15, 20]).map((val) => (
                  <Button
                    key={val}
                    variant={targetValue === val ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTargetValue(val)}
                  >
                    {val}
                  </Button>
                ))}
              </div>
              <Button onClick={handleSaveGoal} className="w-full">
                {editingGoal ? "Update Goal" : "Set Goal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
