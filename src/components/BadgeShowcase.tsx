import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  Award, 
  Target, 
  Flame, 
  Crown, 
  TreePine, 
  Zap, 
  Star, 
  Medal,
  Sparkles,
  Trophy
} from "lucide-react";
import { format } from "date-fns";

interface BadgeShowcaseProps {
  userId: string | undefined;
}

interface UserBadge {
  id: string;
  badge_name: string;
  earned_at: string;
}

interface BadgeInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const BADGE_INFO: Record<string, BadgeInfo> = {
  "Goal Crusher": {
    name: "Goal Crusher",
    description: "Completed your first goal",
    icon: <Target className="h-6 w-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  "Consistent Planter": {
    name: "Consistent Planter",
    description: "Completed monthly goals 3 months in a row",
    icon: <Flame className="h-6 w-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
  "Goal Champion": {
    name: "Goal Champion",
    description: "Completed monthly goals 6 months in a row",
    icon: <Crown className="h-6 w-6" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
  },
  "Weekly Warrior": {
    name: "Weekly Warrior",
    description: "Completed 4 weekly goals",
    icon: <Zap className="h-6 w-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  "First Tree": {
    name: "First Tree",
    description: "Planted your very first tree",
    icon: <TreePine className="h-6 w-6" />,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  "Forest Starter": {
    name: "Forest Starter",
    description: "Planted 5 trees",
    icon: <Sparkles className="h-6 w-6" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  "Tree Champion": {
    name: "Tree Champion",
    description: "Planted 25 trees",
    icon: <Trophy className="h-6 w-6" />,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  "Forest Guardian": {
    name: "Forest Guardian",
    description: "Planted 50 trees",
    icon: <Medal className="h-6 w-6" />,
    color: "text-teal-600",
    bgColor: "bg-teal-500/10",
  },
  "Eco Legend": {
    name: "Eco Legend",
    description: "Planted 100 trees",
    icon: <Star className="h-6 w-6" />,
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
  },
};

// All possible badges for the "locked" view
const ALL_BADGES = Object.keys(BADGE_INFO);

export const BadgeShowcase = ({ userId }: BadgeShowcaseProps) => {
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchBadges = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setEarnedBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const earnedBadgeNames = new Set(earnedBadges.map(b => b.badge_name));
  const lockedBadges = ALL_BADGES.filter(name => !earnedBadgeNames.has(name));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
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
          <Award className="h-5 w-5 text-yellow-500" />
          Badge Showcase
        </CardTitle>
        <CardDescription>
          {earnedBadges.length} of {ALL_BADGES.length} badges earned
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Earned Badges
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {earnedBadges.map((badge) => {
                const info = BADGE_INFO[badge.badge_name] || {
                  name: badge.badge_name,
                  description: "Achievement unlocked!",
                  icon: <Award className="h-6 w-6" />,
                  color: "text-gray-600",
                  bgColor: "bg-gray-500/10",
                };

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg ${info.bgColor} border border-transparent hover:border-primary/20 transition-colors`}
                  >
                    <div className={`${info.color} mb-2`}>{info.icon}</div>
                    <h4 className="font-semibold text-sm">{info.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {format(new Date(badge.earned_at), "MMM d, yyyy")}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Badges to Unlock ({lockedBadges.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {lockedBadges.map((badgeName) => {
                const info = BADGE_INFO[badgeName];
                
                return (
                  <div
                    key={badgeName}
                    className="p-4 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/20 opacity-60"
                  >
                    <div className="text-muted-foreground mb-2">{info.icon}</div>
                    <h4 className="font-semibold text-sm text-muted-foreground">{info.name}</h4>
                    <p className="text-xs text-muted-foreground/70 mt-1">{info.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      🔒 Locked
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {earnedBadges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No badges earned yet</p>
            <p className="text-sm mt-1">Complete goals and plant trees to unlock badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
