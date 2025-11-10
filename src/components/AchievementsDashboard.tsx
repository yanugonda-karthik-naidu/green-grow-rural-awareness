import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Star, Sparkles, Award, Target, Crown, Gift, TrendingUp, Calendar, Zap, Users, Share2 } from "lucide-react";
import { UserProgress, Badge as UserBadge, Achievement } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from 'canvas-confetti';

interface AchievementsDashboardProps {
  progress: UserProgress;
  badges: UserBadge[];
  achievements: Achievement[];
  t: any;
}

export const AchievementsDashboard = ({ progress, badges, achievements, t }: AchievementsDashboardProps) => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);

  const safeProgress = {
    treesPlanted: progress.trees_planted || 0,
    seedPoints: progress.seed_points || 0,
    co2Reduced: progress.co2_reduced || 0,
    waterSaved: progress.water_saved || 0,
    badges: badges.map(b => b.badge_name),
    achievementTimeline: achievements.map(a => ({
      date: new Date(a.created_at).toLocaleDateString(),
      achievement: a.achievement_text,
      seedsEarned: a.seeds_earned
    }))
  };

  // Achievement tiers with seed rewards
  const achievementTiers = [
    { 
      icon: Star, 
      name: t.tierBeginner, 
      threshold: 1, 
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      desc: t.tierBeginnerDesc,
      seedReward: 10
    },
    { 
      icon: Sparkles, 
      name: t.tierExplorer, 
      threshold: 10, 
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/30",
      desc: t.tierExplorerDesc,
      seedReward: 25
    },
    { 
      icon: Award, 
      name: t.tierForestFriend, 
      threshold: 25, 
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      desc: t.tierForestFriendDesc,
      seedReward: 50
    },
    { 
      icon: Trophy, 
      name: t.tierGuardian, 
      threshold: 50, 
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      desc: t.tierGuardianDesc,
      seedReward: 100
    },
    { 
      icon: Crown, 
      name: t.tierVillageHero, 
      threshold: 100, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      desc: t.tierVillageHeroDesc,
      seedReward: 200
    },
    { 
      icon: Target, 
      name: t.tierEarthSaver, 
      threshold: 200, 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      desc: t.tierEarthSaverDesc,
      seedReward: 500
    },
  ];

  const currentTier = achievementTiers
    .slice()
    .reverse()
    .find(tier => safeProgress.treesPlanted >= tier.threshold) || achievementTiers[0];

  const nextTier = achievementTiers.find(tier => tier.threshold > safeProgress.treesPlanted);
  const tierProgress = nextTier 
    ? ((safeProgress.treesPlanted - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
    : 100;

  // Special badges with seed rewards - Expanded list
  const specialBadges = [
    { 
      id: "first_tree", 
      name: `🌱 ${t.badgeFirstSapling}`, 
      desc: t.badgeFirstSaplingDesc, 
      condition: () => safeProgress.treesPlanted >= 1,
      seeds: 5
    },
    { 
      id: "eco_warrior", 
      name: `⚔️ ${t.badgeEcoWarrior}`, 
      desc: t.badgeEcoWarriorDesc, 
      condition: () => safeProgress.treesPlanted >= 10,
      seeds: 15
    },
    { 
      id: "community_mentor", 
      name: `👥 ${t.badgeCommunityMentor}`, 
      desc: t.badgeCommunityMentorDesc, 
      condition: () => safeProgress.badges.length >= 3,
      seeds: 20
    },
    { 
      id: "sustainability_leader", 
      name: `🌍 ${t.badgeSustainabilityLeader}`, 
      desc: t.badgeSustainabilityLeaderDesc, 
      condition: () => safeProgress.treesPlanted >= 100,
      seeds: 50
    },
    { 
      id: "water_guardian", 
      name: `💧 ${t.badgeWaterGuardian}`, 
      desc: t.badgeWaterGuardianDesc, 
      condition: () => (safeProgress.waterSaved || 0) >= 1000,
      seeds: 25
    },
    { 
      id: "climate_hero", 
      name: `🌤️ ${t.badgeClimateHero}`, 
      desc: t.badgeClimateHeroDesc, 
      condition: () => safeProgress.co2Reduced >= 500,
      seeds: 30
    },
    { 
      id: "tree_master", 
      name: `🌳 Tree Master`, 
      desc: "Plant 50 trees to become a master", 
      condition: () => safeProgress.treesPlanted >= 50,
      seeds: 40
    },
    { 
      id: "seed_collector", 
      name: `💰 Seed Collector`, 
      desc: "Collect 1000 seeds", 
      condition: () => safeProgress.seedPoints >= 1000,
      seeds: 100
    },
    { 
      id: "forest_builder", 
      name: `🏞️ Forest Builder`, 
      desc: "Create your own forest with 75 trees", 
      condition: () => safeProgress.treesPlanted >= 75,
      seeds: 75
    },
    { 
      id: "eco_champion", 
      name: `🏆 Eco Champion`, 
      desc: "Reach 150 trees planted", 
      condition: () => safeProgress.treesPlanted >= 150,
      seeds: 150
    },
  ];

  const earnedBadges = specialBadges.filter(badge => badge.condition());
  const lockedBadges = specialBadges.filter(badge => !badge.condition());

  // Track claimed rewards
  const [claimedRewards, setClaimedRewards] = useState(0);

  // Claim rewards function - fixed to prevent auto-unlock
  const handleClaimReward = async () => {
    const availableRewards = rewardsUnlocked - claimedRewards;
    if (availableRewards === 0 || claimingReward) return;
    
    setClaimingReward(true);
    fireConfetti();
    
    // Update user progress with claimed seeds
    const { error } = await supabase
      .from('user_progress')
      .update({ 
        seed_points: safeProgress.seedPoints + (availableRewards * 100)
      })
      .eq('user_id', progress.user_id);

    if (!error) {
      setClaimedRewards(rewardsUnlocked);
      toast.success(`Claimed ${availableRewards * 100} seeds!`);
    } else {
      toast.error('Failed to claim rewards');
    }
    
    setClaimingReward(false);
    setShowRewardAnimation(false);
  };

  // Seed reward calculations
  const seedsToNextReward = 100;
  const seedProgress = (safeProgress.seedPoints % seedsToNextReward) / seedsToNextReward * 100;
  const rewardsUnlocked = Math.floor(safeProgress.seedPoints / seedsToNextReward);

  // Top contributors - only show if user has planted trees
  const topContributors = safeProgress.treesPlanted > 0 ? [
    { rank: 1, name: "You", trees: safeProgress.treesPlanted, seeds: safeProgress.seedPoints, avatar: "🌱", isUser: true }
  ] : [];

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
    });
  };

  const fireCelebration = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    if (safeProgress.treesPlanted > 0 && safeProgress.treesPlanted % 10 === 0) {
      fireCelebration();
    }
  }, [safeProgress.treesPlanted]);

  const shareAchievement = () => {
    const text = `I've planted ${safeProgress.treesPlanted} ${t.treesPlanted.toLowerCase()} and earned ${safeProgress.seedPoints} ${t.seeds} on GreenGrow! Join me in making the planet greener! 🌱🌍`;
    if (navigator.share) {
      navigator.share({
        title: 'My GreenGrow Achievement',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Achievement copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-3 p-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl border-2 border-purple-500/20">
        <div className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mb-2">
          <Trophy className="h-12 w-12 text-purple-600 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          🏆 {t.achievementsRewards}
        </h2>
        <p className="text-muted-foreground text-lg">{t.trackJourney}</p>
      </div>

      {/* Seed Points Counter */}
      <Card className="overflow-hidden border-2 border-yellow-500/30 shadow-2xl bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-amber-500/5">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full">
                <Zap className="h-10 w-10 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-yellow-600">{safeProgress.seedPoints} {t.seeds}</h3>
                <p className="text-muted-foreground">{t.ecoCurrency}</p>
              </div>
            </div>
            <div className="flex-1 max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to next reward</span>
                <span className="font-semibold text-yellow-600">{seedsToNextReward - (safeProgress.seedPoints % seedsToNextReward)} seeds</span>
              </div>
              <Progress value={seedProgress} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                <Gift className="inline h-3 w-3 mr-1" />
                {rewardsUnlocked} rewards unlocked
              </p>
            </div>
            <Button 
              onClick={handleClaimReward} 
              className="shrink-0"
              disabled={(rewardsUnlocked - claimedRewards) === 0 || claimingReward}
            >
              <Gift className="mr-2 h-4 w-4" />
              {(rewardsUnlocked - claimedRewards) > 0 ? `Claim ${(rewardsUnlocked - claimedRewards) * 100} Seeds` : 'No Rewards Available'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Rank & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-2 border-primary/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2">
              <currentTier.icon className={`h-6 w-6 ${currentTier.color}`} />
              Your Current Rank
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className={`${currentTier.bgColor} ${currentTier.borderColor} border-2 rounded-xl p-6 text-center`}>
              <currentTier.icon className={`h-16 w-16 ${currentTier.color} mx-auto mb-3 animate-pulse`} />
              <h3 className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{currentTier.desc}</p>
              <Badge variant="secondary" className="mt-3">
                {currentTier.seedReward} Seeds Earned
              </Badge>
            </div>

            {nextTier && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Next: {nextTier.name}
                  </span>
                  <span className="font-semibold text-primary">
                    {safeProgress.treesPlanted} / {nextTier.threshold}
                  </span>
                </div>
                <Progress value={tierProgress} className="h-3" />
                <p className="text-xs text-center text-muted-foreground">
                  Plant {nextTier.threshold - safeProgress.treesPlanted} more trees to unlock!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Earned Badges */}
        <Card className="overflow-hidden border-2 border-emerald-500/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-emerald-600" />
              Your Badges ({earnedBadges.length}/{specialBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {earnedBadges.length > 0 ? (
                  earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 rounded-xl border-2 border-primary bg-primary/10 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{badge.name.split(' ')[0]}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{badge.name.split(' ').slice(1).join(' ')}</h4>
                          <p className="text-xs text-muted-foreground">{badge.desc}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          +{badge.seeds} 🌱
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">No badges earned yet</p>
                    <p className="text-sm text-muted-foreground">Plant trees to unlock badges!</p>
                  </div>
                )}
                {lockedBadges.length > 0 && (
                  <>
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Locked Badges</p>
                    </div>
                    {lockedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 rounded-xl border-2 border-dashed border-muted bg-muted/20 opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl grayscale">🔒</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-muted-foreground">{badge.name.split(' ').slice(1).join(' ')}</h4>
                            <p className="text-xs text-muted-foreground">{badge.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>


      {/* Share Achievement */}
      <div className="flex justify-center">
        <Button onClick={shareAchievement} size="lg" className="gap-2">
          <Share2 className="h-5 w-5" />
          Share Your Achievement
        </Button>
      </div>
    </div>
  );
};
