import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Target, TreePine, Plus, Edit2, CheckCircle2, TrendingUp } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
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

export const GoalSetting = ({ userId }: GoalSettingProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [targetValue, setTargetValue] = useState(5);

  const currentMonth = format(new Date(), "yyyy-MM-01");
  const currentMonthLabel = format(new Date(), "MMMM yyyy");

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
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth);

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndAwardBadges = async (isNewCompletion: boolean) => {
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
        message: 'You completed your first monthly goal! Keep up the great work!',
        notification_type: 'achievement',
      });
      toast.success("🎯 Badge earned: Goal Crusher!");
    }

    // Check for "Consistent Planter" badge (3 months streak)
    const { data: allCompletedGoals } = await supabase
      .from('user_goals')
      .select('month')
      .eq('user_id', userId)
      .eq('is_completed', true)
      .order('month', { ascending: false });

    if (allCompletedGoals && allCompletedGoals.length >= 3) {
      // Check for consecutive months
      const now = new Date();
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

      // Check for "Goal Champion" (6 months streak)
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
  };

  const updateGoalProgress = async () => {
    if (!userId) return;

    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    // Get trees planted this month
    const { data: trees } = await supabase
      .from('planted_trees')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', monthEnd.toISOString());

    const treesCount = trees?.length || 0;

    // Update goals with current progress
    const { data: existingGoals } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .eq('goal_type', 'trees');

    if (existingGoals && existingGoals.length > 0) {
      const goal = existingGoals[0];
      const wasCompleted = goal.is_completed;
      const isCompleted = treesCount >= goal.target_value;

      await supabase
        .from('user_goals')
        .update({ 
          current_value: treesCount,
          is_completed: isCompleted
        })
        .eq('id', goal.id);

      // Award badges if goal was just completed
      if (isCompleted && !wasCompleted) {
        await checkAndAwardBadges(true);
      }
    }

    fetchGoals();
  };

  const handleSaveGoal = async () => {
    if (!userId) return;

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
            goal_type: 'trees',
            target_value: targetValue,
            current_value: 0,
            month: currentMonth,
          });

        if (error) {
          if (error.code === '23505') {
            toast.error("You already have a tree goal for this month");
            return;
          }
          throw error;
        }
        toast.success("Goal created!");
      }

      setDialogOpen(false);
      setEditingGoal(null);
      setTargetValue(5);
      await updateGoalProgress();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error("Failed to save goal");
    }
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setTargetValue(goal.target_value);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingGoal(null);
    setTargetValue(5);
    setDialogOpen(true);
  };

  const treesGoal = goals.find(g => g.goal_type === 'trees');
  const progressPercentage = treesGoal 
    ? Math.min((treesGoal.current_value / treesGoal.target_value) * 100, 100)
    : 0;

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Goals
            </CardTitle>
            <CardDescription>{currentMonthLabel}</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              {!treesGoal ? (
                <Button size="sm" onClick={openCreateDialog} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Set Goal
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(treesGoal)}
                  className="gap-1"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  {editingGoal ? "Edit Tree Goal" : "Set Monthly Tree Goal"}
                </DialogTitle>
                <DialogDescription>
                  Set a target for how many trees you want to plant this month.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Trees to plant in {currentMonthLabel}</Label>
                  <Input
                    id="target"
                    type="number"
                    min={1}
                    max={100}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                  />
                </div>
                <div className="flex gap-2">
                  {[3, 5, 10, 15, 20].map(val => (
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
        </div>
      </CardHeader>
      <CardContent>
        {treesGoal ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-primary" />
                <span className="font-medium">Trees Planted</span>
              </div>
              {treesGoal.is_completed ? (
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
                  {treesGoal.current_value} / {treesGoal.target_value} trees
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground text-center">
                {progressPercentage.toFixed(0)}% complete
              </p>
            </div>

            {!treesGoal.is_completed && treesGoal.target_value - treesGoal.current_value > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Plant {treesGoal.target_value - treesGoal.current_value} more tree{treesGoal.target_value - treesGoal.current_value !== 1 ? 's' : ''} to reach your goal!
              </p>
            )}

            {treesGoal.is_completed && (
              <p className="text-sm text-center text-green-600 font-medium">
                🎉 Congratulations! You've reached your monthly goal!
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No goal set yet</p>
            <p className="text-sm mt-1">Set a monthly goal to track your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
