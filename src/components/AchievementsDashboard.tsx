import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Star, Sparkles, Award, Target, Crown, Gift, Zap, Share2, Check, Lock } from "lucide-react";
import { UserProgress, Badge as UserBadge, Achievement } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from 'canvas-confetti';

interface AchievementsDashboardProps {
  progress: UserProgress;
  badges: UserBadge[];
  achievements: Achievement[];
  t: any;
  onRefresh?: () => void;
}

export const AchievementsDashboard = ({ progress, badges, achievements, t, onRefresh }: AchievementsDashboardProps) => {
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimedBadges, setClaimedBadges] = useState<Set<string>>(new Set());

  // Safe progress with fallbacks
  const safeProgress = {
    userId: progress?.user_id || '',
    treesPlanted: progress?.trees_planted || 0,
    seedPoints: progress?.seed_points || 0,
    co2Reduced: progress?.co2_reduced || 0,
    waterSaved: progress?.water_saved || 0,
    earnedBadgeNames: badges?.map(b => b.badge_name) || [],
  };

  // Achievement tiers
  const achievementTiers = [
    { icon: Star, name: t?.tierBeginner || "Green Beginner", threshold: 1, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", desc: t?.tierBeginnerDesc || "Plant your first tree", seedReward: 10 },
    { icon: Sparkles, name: t?.tierExplorer || "Eco Explorer", threshold: 10, color: "text-teal-500", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30", desc: t?.tierExplorerDesc || "Plant 10 trees", seedReward: 25 },
    { icon: Award, name: t?.tierForestFriend || "Forest Friend", threshold: 25, color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", desc: t?.tierForestFriendDesc || "Plant 25 trees", seedReward: 50 },
    { icon: Trophy, name: t?.tierGuardian || "Green Guardian", threshold: 50, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30", desc: t?.tierGuardianDesc || "Plant 50 trees", seedReward: 100 },
    { icon: Crown, name: t?.tierVillageHero || "Village Hero", threshold: 100, color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", desc: t?.tierVillageHeroDesc || "Plant 100 trees", seedReward: 200 },
    { icon: Target, name: t?.tierEarthSaver || "Earth Saver", threshold: 200, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", desc: t?.tierEarthSaverDesc || "Plant 200 trees", seedReward: 500 },
  ];

  const currentTier = achievementTiers.slice().reverse().find(tier => safeProgress.treesPlanted >= tier.threshold) || null;
  const nextTier = achievementTiers.find(tier => tier.threshold > safeProgress.treesPlanted) || achievementTiers[0];
  const tierProgress = currentTier && nextTier && nextTier.threshold > currentTier.threshold
    ? ((safeProgress.treesPlanted - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
    : currentTier ? 100 : (safeProgress.treesPlanted / nextTier.threshold) * 100;

  // Special badges with conditions
  const specialBadges = [
    { id: "first_tree", name: "🌱 First Sapling", desc: t?.badgeFirstSaplingDesc || "Plant your first tree", condition: () => safeProgress.treesPlanted >= 1, seeds: 5 },
    { id: "eco_warrior", name: "⚔️ Eco Warrior", desc: t?.badgeEcoWarriorDesc || "Plant 10 trees", condition: () => safeProgress.treesPlanted >= 10, seeds: 15 },
    { id: "tree_master", name: "🌳 Tree Master", desc: "Plant 50 trees", condition: () => safeProgress.treesPlanted >= 50, seeds: 40 },
    { id: "forest_builder", name: "🏞️ Forest Builder", desc: "Plant 75 trees", condition: () => safeProgress.treesPlanted >= 75, seeds: 75 },
    { id: "sustainability_leader", name: "🌍 Sustainability Leader", desc: t?.badgeSustainabilityLeaderDesc || "Plant 100 trees", condition: () => safeProgress.treesPlanted >= 100, seeds: 50 },
    { id: "eco_champion", name: "🏆 Eco Champion", desc: "Plant 150 trees", condition: () => safeProgress.treesPlanted >= 150, seeds: 150 },
    { id: "water_guardian", name: "💧 Water Guardian", desc: t?.badgeWaterGuardianDesc || "Save 1000L water", condition: () => (safeProgress.waterSaved || 0) >= 1000, seeds: 25 },
    { id: "climate_hero", name: "🌤️ Climate Hero", desc: t?.badgeClimateHeroDesc || "Reduce 500kg CO₂", condition: () => safeProgress.co2Reduced >= 500, seeds: 30 },
    { id: "seed_collector", name: "💰 Seed Collector", desc: "Collect 500 seeds", condition: () => safeProgress.seedPoints >= 500, seeds: 100 },
  ];

  // Initialize claimed badges from database
  useEffect(() => {
    const claimed = new Set(safeProgress.earnedBadgeNames);
    setClaimedBadges(claimed);
  }, [badges]);

  const earnedBadges = specialBadges.filter(badge => badge.condition());
  const unclaimedBadges = earnedBadges.filter(badge => !claimedBadges.has(badge.id));
  const lockedBadges = specialBadges.filter(badge => !badge.condition());

  // Calculate total claimable seeds from unclaimed badges
  const claimableSeeds = unclaimedBadges.reduce((sum, badge) => sum + badge.seeds, 0);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
    });
  }, []);

  // Claim all unclaimed badge rewards
  const handleClaimRewards = async () => {
    if (claimableSeeds === 0 || claimingReward || !safeProgress.userId) return;
    
    setClaimingReward(true);
    
    try {
      // Update seed points
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({ seed_points: safeProgress.seedPoints + claimableSeeds })
        .eq('user_id', safeProgress.userId);

      if (progressError) throw progressError;

      // Add badges to database
      const badgesToInsert = unclaimedBadges.map(badge => ({
        user_id: safeProgress.userId,
        badge_name: badge.id
      }));

      if (badgesToInsert.length > 0) {
        const { error: badgeError } = await supabase
          .from('user_badges')
          .insert(badgesToInsert);

        if (badgeError && badgeError.code !== '23505') throw badgeError;
      }

      // Update local state
      const newClaimedBadges = new Set(claimedBadges);
      unclaimedBadges.forEach(badge => newClaimedBadges.add(badge.id));
      setClaimedBadges(newClaimedBadges);

      fireConfetti();
      toast.success(`Claimed ${claimableSeeds} seeds from ${unclaimedBadges.length} badge(s)!`);
      
      // Refresh data
      onRefresh?.();
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      toast.error('Failed to claim rewards');
    } finally {
      setClaimingReward(false);
    }
  };

  const shareAchievement = () => {
    const text = `I've planted ${safeProgress.treesPlanted} trees and earned ${safeProgress.seedPoints} seeds on GreenGrow! Join me in making the planet greener! 🌱🌍`;
    if (navigator.share) {
      navigator.share({ title: 'My GreenGrow Achievement', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Achievement copied to clipboard!');
    }
  };

  // Celebration effect for milestones
  useEffect(() => {
    if (safeProgress.treesPlanted > 0 && safeProgress.treesPlanted % 10 === 0) {
      fireConfetti();
    }
  }, [safeProgress.treesPlanted, fireConfetti]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-3 p-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl border-2 border-purple-500/20">
        <div className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mb-2">
          <Trophy className="h-12 w-12 text-purple-600 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          🏆 {t?.achievementsRewards || "Achievements & Rewards"}
        </h2>
        <p className="text-muted-foreground text-lg">{t?.trackJourney || "Track your green journey"}</p>
      </div>

      {/* Seed Points & Claim Rewards */}
      <Card className="overflow-hidden border-2 border-yellow-500/30 shadow-2xl bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-amber-500/5">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full">
                <Zap className="h-10 w-10 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-yellow-600">{safeProgress.seedPoints} {t?.seeds || "Seeds"}</h3>
                <p className="text-muted-foreground">{t?.ecoCurrency || "Your eco-currency"}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              {unclaimedBadges.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <Gift className="inline h-4 w-4 mr-1 text-yellow-600" />
                  {unclaimedBadges.length} badge reward(s) available
                </p>
              )}
            </div>

            <Button 
              onClick={handleClaimRewards} 
              size="lg"
              disabled={claimableSeeds === 0 || claimingReward}
              className="shrink-0 min-w-[180px]"
            >
              {claimingReward ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Claiming...
                </>
              ) : claimableSeeds > 0 ? (
                <>
                  <Gift className="mr-2 h-5 w-5" />
                  Claim {claimableSeeds} Seeds
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  All Claimed
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Rank & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Rank */}
        <Card className="overflow-hidden border-2 border-primary/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2">
              {currentTier ? <currentTier.icon className={`h-6 w-6 ${currentTier.color}`} /> : <Star className="h-6 w-6 text-muted-foreground" />}
              Your Current Rank
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {currentTier ? (
              <div className={`${currentTier.bgColor} ${currentTier.borderColor} border-2 rounded-xl p-6 text-center`}>
                <currentTier.icon className={`h-16 w-16 ${currentTier.color} mx-auto mb-3 animate-pulse`} />
                <h3 className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{currentTier.desc}</p>
                <Badge variant="secondary" className="mt-3">
                  <Zap className="h-3 w-3 mr-1" />
                  {currentTier.seedReward} Seeds Earned
                </Badge>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center">
                <Star className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-xl font-medium text-muted-foreground">No Rank Yet</h3>
                <p className="text-sm text-muted-foreground mt-2">Plant your first tree to get started!</p>
              </div>
            )}

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
              <Progress value={Math.min(tierProgress, 100)} className="h-3" />
              <p className="text-xs text-center text-muted-foreground">
                Plant {Math.max(0, nextTier.threshold - safeProgress.treesPlanted)} more trees to unlock!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="overflow-hidden border-2 border-emerald-500/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-emerald-600" />
              Your Badges ({earnedBadges.length}/{specialBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[280px]">
              <div className="space-y-3">
                {/* Earned Badges */}
                {earnedBadges.length > 0 ? (
                  earnedBadges.map((badge) => {
                    const isClaimed = claimedBadges.has(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-xl border-2 shadow-md transition-all ${
                          isClaimed 
                            ? 'border-primary bg-primary/10' 
                            : 'border-yellow-500 bg-yellow-500/10 animate-pulse'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{badge.name.split(' ')[0]}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{badge.name.split(' ').slice(1).join(' ')}</h4>
                            <p className="text-xs text-muted-foreground">{badge.desc}</p>
                          </div>
                          <Badge variant={isClaimed ? "secondary" : "default"} className="shrink-0">
                            {isClaimed ? <Check className="h-3 w-3 mr-1" /> : <Gift className="h-3 w-3 mr-1" />}
                            +{badge.seeds} 🌱
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">No badges earned yet</p>
                    <p className="text-sm text-muted-foreground">Plant trees to unlock badges!</p>
                  </div>
                )}

                {/* Locked Badges */}
                {lockedBadges.length > 0 && (
                  <>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Locked Badges ({lockedBadges.length})
                      </p>
                    </div>
                    {lockedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 rounded-xl border-2 border-dashed border-muted bg-muted/20 opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl grayscale">🔒</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-muted-foreground">{badge.name.split(' ').slice(1).join(' ')}</h4>
                            <p className="text-xs text-muted-foreground">{badge.desc}</p>
                          </div>
                          <Badge variant="outline" className="shrink-0 opacity-50">
                            +{badge.seeds} 🌱
                          </Badge>
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

      {/* Share Button */}
      <div className="flex justify-center">
        <Button onClick={shareAchievement} size="lg" variant="outline" className="gap-2">
          <Share2 className="h-5 w-5" />
          Share Your Achievement
        </Button>
      </div>
    </div>
  );
};
