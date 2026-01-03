import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, BellRing, Trophy, Crown, Flame, Users, Zap, Volume2 } from "lucide-react";
import { useNotificationPreferences, NotificationPreferences as Prefs } from "@/hooks/useNotificationPreferences";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationPreferencesProps {
  userId: string | undefined;
}

export const NotificationPreferences = ({ userId }: NotificationPreferencesProps) => {
  const { preferences, loading, updatePreference } = useNotificationPreferences(userId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const preferenceItems: {
    key: keyof Prefs;
    label: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      key: 'sound_enabled',
      label: 'Notification Sounds',
      description: 'Play a sound when notifications arrive',
      icon: Volume2,
    },
    {
      key: 'browser_notifications_enabled',
      label: 'Browser Notifications',
      description: 'Show desktop notifications when the tab is in background',
      icon: BellRing,
    },
    {
      key: 'achievements_enabled',
      label: 'Achievement Alerts',
      description: 'Get notified when you earn badges and achievements',
      icon: Trophy,
    },
    {
      key: 'leaderboard_enabled',
      label: 'Leaderboard Updates',
      description: 'Get notified when your rank changes on leaderboards',
      icon: Crown,
    },
    {
      key: 'challenges_enabled',
      label: 'Challenge Notifications',
      description: 'Get reminders about daily challenges and completions',
      icon: Flame,
    },
    {
      key: 'streak_enabled',
      label: 'Streak Milestones',
      description: 'Get notified when you reach streak milestones',
      icon: Zap,
    },
    {
      key: 'community_enabled',
      label: 'Community Activity',
      description: 'Get notified about likes and comments on your posts',
      icon: Users,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Customize which notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferenceItems.map((item, index) => (
          <div key={item.key}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                    {item.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                id={item.key}
                checked={preferences[item.key]}
                onCheckedChange={(checked) => updatePreference(item.key, checked)}
              />
            </div>
            {index < preferenceItems.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
