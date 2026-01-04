import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, BellRing, Trophy, Crown, Flame, Users, Zap, Volume2, Play, Moon, Clock } from "lucide-react";
import { useNotificationPreferences, NotificationPreferences as Prefs } from "@/hooks/useNotificationPreferences";
import { NOTIFICATION_SOUNDS, SoundType, playNotificationSound } from "@/lib/notificationSounds";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationPreferencesProps {
  userId: string | undefined;
}

export const NotificationPreferences = ({ userId }: NotificationPreferencesProps) => {
  const { preferences, loading, updatePreference, isInQuietHours } = useNotificationPreferences(userId);

  const handlePreviewSound = (soundType: SoundType) => {
    playNotificationSound(soundType);
  };

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

  const toggleItems: {
    key: keyof Omit<Prefs, 'sound_type' | 'quiet_hours_start' | 'quiet_hours_end'>;
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
    <div className="space-y-6">
      {/* Quiet Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Quiet Hours
            {isInQuietHours() && (
              <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">
                Active Now
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Pause notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Moon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="quiet_hours_enabled" className="text-sm font-medium cursor-pointer">
                  Enable Quiet Hours
                </Label>
                <p className="text-xs text-muted-foreground">
                  No notifications during scheduled hours
                </p>
              </div>
            </div>
            <Switch
              id="quiet_hours_enabled"
              checked={preferences.quiet_hours_enabled}
              onCheckedChange={(checked) => updatePreference('quiet_hours_enabled', checked)}
            />
          </div>

          {preferences.quiet_hours_enabled && (
            <>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm text-muted-foreground">From</Label>
                  <Input
                    type="time"
                    value={preferences.quiet_hours_start}
                    onChange={(e) => updatePreference('quiet_hours_start', e.target.value)}
                    className="w-28"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">To</Label>
                  <Input
                    type="time"
                    value={preferences.quiet_hours_end}
                    onChange={(e) => updatePreference('quiet_hours_end', e.target.value)}
                    className="w-28"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Notifications will be silenced between {preferences.quiet_hours_start} and {preferences.quiet_hours_end}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Main Notification Preferences Card */}
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
          {/* Sound Type Selection */}
          {preferences.sound_enabled && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Volume2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Notification Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred alert tone
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={preferences.sound_type}
                    onValueChange={(value: SoundType) => updatePreference('sound_type', value)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NOTIFICATION_SOUNDS).map(([key, sound]) => (
                        <SelectItem key={key} value={key}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePreviewSound(preferences.sound_type)}
                    title="Preview sound"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Toggle Items */}
          {toggleItems.map((item, index) => (
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
                  checked={preferences[item.key] as boolean}
                  onCheckedChange={(checked) => updatePreference(item.key, checked)}
                />
              </div>
              {index < toggleItems.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
