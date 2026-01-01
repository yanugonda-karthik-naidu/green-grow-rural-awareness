import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Check, CheckCheck, Trophy, Flame, Crown, Gift, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
  userId?: string;
}

export const NotificationsPanel = ({ userId }: NotificationsPanelProps) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userId);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leaderboard':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'streak':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-primary" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-pink-500" />;
      default:
        return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-muted/30';
    switch (type) {
      case 'leaderboard':
        return 'bg-yellow-500/10 border-l-4 border-l-yellow-500';
      case 'streak':
        return 'bg-orange-500/10 border-l-4 border-l-orange-500';
      case 'achievement':
        return 'bg-primary/10 border-l-4 border-l-primary';
      case 'reward':
        return 'bg-pink-500/10 border-l-4 border-l-pink-500';
      default:
        return 'bg-blue-500/10 border-l-4 border-l-blue-500';
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading notifications...</p>
        </CardContent>
      </Card>
    );
  }

  if (!userId) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-8 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Sign in to view your notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bell className="w-6 h-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete challenges and climb the leaderboard to earn achievements!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg transition-all cursor-pointer hover:opacity-90 ${
                    getNotificationBg(notification.notification_type, notification.is_read)
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`font-semibold truncate ${notification.is_read ? 'text-muted-foreground' : ''}`}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <Badge variant="outline" className="shrink-0 text-xs bg-primary/20">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${notification.is_read ? 'text-muted-foreground' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {notification.is_read && (
                      <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
