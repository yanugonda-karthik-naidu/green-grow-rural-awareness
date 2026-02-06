import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Crown, Brain, Flame, Sparkles, Users } from 'lucide-react';
import { UserQuizProgress, getDefaultProgress } from '@/lib/advancedQuizData';

interface QuizLeaderboardEntry {
  userId: string;
  displayName: string;
  totalScore: number;
  completedQuizzes: number;
  perfectScores: number;
  quizStreak: number;
  longestStreak: number;
  badgeCount: number;
  rank: number;
}

interface QuizLeaderboardProps {
  currentUserId?: string;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
};

const getRankBg = (rank: number, isCurrentUser: boolean) => {
  if (isCurrentUser) return 'bg-primary/20 border-primary/50';
  if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
  if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
  if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
  return 'bg-card hover:bg-accent/50';
};

// Gather all quiz progress entries from localStorage (simulating multi-user)
const getQuizLeaderboardData = (currentUserId?: string): QuizLeaderboardEntry[] => {
  const entries: QuizLeaderboardEntry[] = [];

  // Current user's progress
  const saved = localStorage.getItem('advancedQuizProgress');
  if (saved) {
    try {
      const progress: UserQuizProgress = JSON.parse(saved);
      if (progress.totalScore > 0 || progress.completedQuizzes > 0) {
        entries.push({
          userId: currentUserId || 'current-user',
          displayName: localStorage.getItem('userDisplayName') || 'You',
          totalScore: progress.totalScore,
          completedQuizzes: progress.completedQuizzes,
          perfectScores: progress.perfectScores || 0,
          quizStreak: progress.quizStreak || 0,
          longestStreak: progress.longestStreak || 0,
          badgeCount: progress.earnedBadges?.length || 0,
          rank: 0,
        });
      }
    } catch {}
  }

  // Simulated community entries for demonstration
  const communityData: Omit<QuizLeaderboardEntry, 'rank'>[] = [
    { userId: 'demo-1', displayName: 'Priya Sharma', totalScore: 2450, completedQuizzes: 28, perfectScores: 8, quizStreak: 14, longestStreak: 21, badgeCount: 11 },
    { userId: 'demo-2', displayName: 'Arjun Reddy', totalScore: 1890, completedQuizzes: 22, perfectScores: 5, quizStreak: 7, longestStreak: 15, badgeCount: 9 },
    { userId: 'demo-3', displayName: 'Meera Patel', totalScore: 1650, completedQuizzes: 19, perfectScores: 6, quizStreak: 3, longestStreak: 12, badgeCount: 8 },
    { userId: 'demo-4', displayName: 'Vikram Singh', totalScore: 1420, completedQuizzes: 17, perfectScores: 4, quizStreak: 5, longestStreak: 10, badgeCount: 7 },
    { userId: 'demo-5', displayName: 'Ananya Das', totalScore: 1200, completedQuizzes: 15, perfectScores: 3, quizStreak: 2, longestStreak: 8, badgeCount: 6 },
    { userId: 'demo-6', displayName: 'Rahul Kumar', totalScore: 980, completedQuizzes: 12, perfectScores: 2, quizStreak: 4, longestStreak: 7, badgeCount: 5 },
    { userId: 'demo-7', displayName: 'Kavitha Nair', totalScore: 750, completedQuizzes: 9, perfectScores: 1, quizStreak: 1, longestStreak: 5, badgeCount: 4 },
    { userId: 'demo-8', displayName: 'Suresh Babu', totalScore: 520, completedQuizzes: 6, perfectScores: 1, quizStreak: 0, longestStreak: 3, badgeCount: 3 },
  ];

  entries.push(...communityData.map(e => ({ ...e, rank: 0 })));
  return entries;
};

const LeaderboardList = ({
  entries,
  metric,
  currentUserId,
}: {
  entries: QuizLeaderboardEntry[];
  metric: 'score' | 'streak' | 'perfect';
  currentUserId?: string;
}) => {
  const sorted = useMemo(() => {
    const key = metric === 'score' ? 'totalScore' : metric === 'streak' ? 'longestStreak' : 'perfectScores';
    return [...entries]
      .sort((a, b) => b[key] - a[key])
      .map((e, idx) => ({ ...e, rank: idx + 1 }));
  }, [entries, metric]);

  const metricLabel = metric === 'score' ? 'points' : metric === 'streak' ? 'day streak' : 'perfect';
  const metricValue = (e: QuizLeaderboardEntry) =>
    metric === 'score' ? e.totalScore : metric === 'streak' ? e.longestStreak : e.perfectScores;

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-4">
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Complete a quiz to appear!</p>
          </div>
        ) : (
          sorted.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId || entry.userId === 'current-user';
            return (
              <Card
                key={entry.userId}
                className={`p-3 border transition-all ${getRankBg(entry.rank, isCurrentUser)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {entry.displayName}
                        </p>
                        {isCurrentUser && <Badge variant="secondary" className="text-xs">You</Badge>}
                        {entry.badgeCount > 0 && (
                          <Badge variant="outline" className="text-xs">🏅 {entry.badgeCount}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {metric === 'score'
                          ? `📝 ${entry.completedQuizzes} quizzes · 🔥 ${entry.quizStreak} streak`
                          : metric === 'streak'
                          ? `📝 ${entry.completedQuizzes} quizzes · ⭐ ${entry.totalScore} pts`
                          : `📝 ${entry.completedQuizzes} quizzes · 🔥 ${entry.longestStreak} best streak`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      metric === 'score' ? 'text-yellow-600 dark:text-yellow-400'
                        : metric === 'streak' ? 'text-orange-600 dark:text-orange-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {metricValue(entry)}
                    </div>
                    <div className="text-xs text-muted-foreground">{metricLabel}</div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};

export const QuizLeaderboard = ({ currentUserId }: QuizLeaderboardProps) => {
  const [entries, setEntries] = useState<QuizLeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getQuizLeaderboardData(currentUserId));
  }, [currentUserId]);

  return (
    <Card className="p-6 border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Quiz Leaderboard</h2>
          <p className="text-sm text-muted-foreground">Top quiz performers in the community</p>
        </div>
      </div>

      <Tabs defaultValue="score" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="score" className="gap-1 text-xs sm:text-sm">
            <Sparkles className="h-4 w-4" />
            Score
          </TabsTrigger>
          <TabsTrigger value="streak" className="gap-1 text-xs sm:text-sm">
            <Flame className="h-4 w-4" />
            Streak
          </TabsTrigger>
          <TabsTrigger value="perfect" className="gap-1 text-xs sm:text-sm">
            <Trophy className="h-4 w-4" />
            Perfect
          </TabsTrigger>
        </TabsList>
        <TabsContent value="score">
          <LeaderboardList entries={entries} metric="score" currentUserId={currentUserId} />
        </TabsContent>
        <TabsContent value="streak">
          <LeaderboardList entries={entries} metric="streak" currentUserId={currentUserId} />
        </TabsContent>
        <TabsContent value="perfect">
          <LeaderboardList entries={entries} metric="perfect" currentUserId={currentUserId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
