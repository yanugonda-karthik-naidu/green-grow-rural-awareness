import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Heart, ThumbsUp, MapPin, Globe, Sparkles, TrendingUp, Send, Trophy, 
  MessageCircle, Users, Target, Calendar, Plus, ChevronRight, Flame,
  TreeDeciduous, Award, Loader2
} from "lucide-react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useRealtimeAnalytics } from "@/hooks/useRealtimeAnalytics";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useLocationCommunity } from "@/hooks/useLocationCommunity";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CommunityWallProps {
  t: any;
}

const motivationalQuotes = [
  "Let's grow together 🌱",
  "Every tree makes a difference 🌳",
  "Be the change you wish to see 🌍",
  "Plant today, breathe tomorrow 💚",
  "Together we can heal the Earth 🌿",
  "Your community needs you! 🤝",
  "One tree at a time, we build forests! 🌲"
];

const getBadgeInfo = (treesPlanted: number) => {
  if (treesPlanted >= 100) return { icon: "🏆", name: "Legend", color: "bg-yellow-500" };
  if (treesPlanted >= 50) return { icon: "🌍", name: "Earth Saver", color: "bg-blue-500" };
  if (treesPlanted >= 30) return { icon: "🌾", name: "Village Hero", color: "bg-purple-500" };
  if (treesPlanted >= 15) return { icon: "🌳", name: "Eco Guardian", color: "bg-green-500" };
  if (treesPlanted >= 5) return { icon: "🌿", name: "Eco Explorer", color: "bg-teal-500" };
  return { icon: "🌱", name: "Green Starter", color: "bg-emerald-500" };
};

export const CommunityWall = ({ t }: CommunityWallProps) => {
  const { userLocation, loading: locationLoading } = useUserLocation();
  const [selectedLocation, setSelectedLocation] = useState<string>("my-location");
  
  // Determine the active location to fetch data for
  const activeLocation = selectedLocation === "my-location" 
    ? userLocation.location 
    : selectedLocation === "all" 
      ? null 
      : selectedLocation;
  
  const { 
    locationStats, 
    challenges, 
    leaderboard, 
    locationPosts,
    allLocations,
    loading: communityLoading,
    createChallenge 
  } = useLocationCommunity(activeLocation);
  const { analytics } = useRealtimeAnalytics();
  
  const [newMessage, setNewMessage] = useState("");
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [newChallengeTitle, setNewChallengeTitle] = useState("");
  const [newChallengeTarget, setNewChallengeTarget] = useState(50);
  const [globalPosts, setGlobalPosts] = useState<any[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);

  // Fetch global data when "all" is selected
  useEffect(() => {
    const fetchGlobalData = async () => {
      // Fetch all posts
      const { data: posts } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (posts) setGlobalPosts(posts);

      // Fetch global leaderboard
      const { data: progress } = await supabase
        .from('user_progress')
        .select('user_id, trees_planted, seed_points')
        .order('trees_planted', { ascending: false })
        .limit(10);

      if (progress) {
        const userIds = progress.filter(p => p.trees_planted > 0).map(p => p.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, location')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        const leaderboardData = progress
          .filter(p => p.trees_planted > 0)
          .map(p => ({
            user_id: p.user_id,
            display_name: profileMap.get(p.user_id)?.display_name || 'Community Member',
            location: profileMap.get(p.user_id)?.location || 'Unknown',
            trees_planted: p.trees_planted,
            seed_points: p.seed_points || 0
          }));
        setGlobalLeaderboard(leaderboardData);
      }
    };

    fetchGlobalData();

    // Subscribe to changes
    const channel = supabase
      .channel('global-community-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, fetchGlobalData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, fetchGlobalData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const postMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to post");
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, location')
      .eq('id', user.id)
      .single();

    const authorName = profile?.display_name || user.email?.split('@')[0] || 'Anonymous';

    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      content: newMessage,
      author_name: authorName,
      location: profile?.location,
      likes: 0
    });

    if (error) {
      toast.error("Failed to post message");
      return;
    }

    setNewMessage("");
    toast.success("Post shared with your community! +10 Green Points 🌱");
  };

  const handleCreateChallenge = async () => {
    const challengeLocation = activeLocation || userLocation.location;
    if (!newChallengeTitle.trim() || !challengeLocation) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const { error } = await createChallenge(
      challengeLocation,
      newChallengeTitle,
      `Community challenge for ${challengeLocation}`,
      newChallengeTarget,
      endDate
    );

    if (error) {
      toast.error("Failed to create challenge");
      return;
    }

    setShowCreateChallenge(false);
    setNewChallengeTitle("");
    toast.success("Challenge created for your community! 🎯");
  };

  const displayPosts = selectedLocation === "all" ? globalPosts : locationPosts;
  const displayLeaderboard = selectedLocation === "all" ? globalLeaderboard : leaderboard;
  
  // Get the display name for the current selected location
  const displayLocationName = selectedLocation === "my-location" 
    ? userLocation.location 
    : selectedLocation === "all" 
      ? "Global" 
      : selectedLocation;
  
  const globalImpact = {
    totalTrees: analytics?.total_trees || 0,
    co2Saved: Math.round(analytics?.total_co2_kg || 0),
    o2Generated: Math.round(analytics?.total_o2_lpd || 0),
    areaExpanded: Math.round(analytics?.total_area_m2 || 0),
  };

  const localImpact = locationStats ? {
    totalTrees: locationStats.total_trees,
    co2Saved: Math.round(locationStats.total_co2_kg),
    o2Generated: Math.round(locationStats.total_o2_lpd),
    totalUsers: locationStats.total_users
  } : null;

  if (locationLoading || communityLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Header */}
      <Card className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {userLocation.location ? `Welcome, ${userLocation.displayName}!` : 'Community Hub'}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {userLocation.location ? (
                  <>📍 {userLocation.location} Community</>
                ) : (
                  <>Update your profile to see your local community</>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <p className="text-sm font-medium text-foreground">{currentQuote}</p>
          </div>
        </div>
      </Card>

      {/* Location Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-medium">View Community:</span>
          </div>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="my-location">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  My Location ({userLocation.location || 'Not set'})
                </span>
              </SelectItem>
              <SelectItem value="all">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  All Communities (Global)
                </span>
              </SelectItem>
              {allLocations.filter(loc => loc !== userLocation.location).map(loc => (
                <SelectItem key={loc} value={loc}>📍 {loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Impact */}
        {selectedLocation !== "all" && localImpact && (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-green-600" />
              📍 {displayLocationName} Impact
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{localImpact.totalTrees}</div>
                <div className="text-xs text-muted-foreground">Trees</div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{localImpact.totalUsers}</div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-2xl font-bold text-cyan-600">{localImpact.co2Saved}kg</div>
                <div className="text-xs text-muted-foreground">CO₂ Saved</div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">{localImpact.o2Generated}L</div>
                <div className="text-xs text-muted-foreground">O₂/Day</div>
              </div>
            </div>
          </Card>
        )}

        {/* Global Impact */}
        <Card className={`p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-500/30 ${selectedLocation === "all" || !localImpact ? 'md:col-span-2' : ''}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
            <Globe className="h-5 w-5 text-blue-600 animate-pulse" />
            🌍 Global Community Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-card/50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{globalImpact.totalTrees}</div>
              <div className="text-xs text-muted-foreground">Total Trees</div>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{globalImpact.co2Saved}kg</div>
              <div className="text-xs text-muted-foreground">CO₂ Saved</div>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-xl">
              <div className="text-2xl font-bold text-cyan-600">{globalImpact.o2Generated}L</div>
              <div className="text-xs text-muted-foreground">O₂/Day</div>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">{globalImpact.areaExpanded}m²</div>
              <div className="text-xs text-muted-foreground">Green Area</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Community Challenges */}
      {selectedLocation !== "all" && (
        <Card className="p-6 border-2 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Community Challenges</h3>
            </div>
            <Dialog open={showCreateChallenge} onOpenChange={setShowCreateChallenge}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  New Challenge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Community Challenge</DialogTitle>
                  <DialogDescription>
                    Start a new tree planting challenge for {displayLocationName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium">Challenge Title</label>
                    <Input
                      placeholder="e.g., 100 Trees for Our Village"
                      value={newChallengeTitle}
                      onChange={(e) => setNewChallengeTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Trees</label>
                    <Input
                      type="number"
                      min={10}
                      max={1000}
                      value={newChallengeTarget}
                      onChange={(e) => setNewChallengeTarget(parseInt(e.target.value) || 50)}
                    />
                  </div>
                  <Button onClick={handleCreateChallenge} className="w-full">
                    <Flame className="h-4 w-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {challenges.length > 0 ? (
            <div className="space-y-4">
              {challenges.map((challenge) => {
                const progress = Math.min((challenge.current_trees / challenge.target_trees) * 100, 100);
                const daysLeft = Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                
                return (
                  <Card key={challenge.id} className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        {challenge.title}
                      </h4>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {daysLeft} days left
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-3 mb-2" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {challenge.current_trees} / {challenge.target_trees} trees
                      </span>
                      <span className="flex items-center gap-1 text-primary">
                        <Users className="h-4 w-4" />
                        {challenge.participants?.length || 0} participants
                      </span>
                    </div>
                    {progress >= 100 && (
                      <Badge className="mt-2 bg-green-500">✓ Challenge Completed!</Badge>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-6 text-center bg-muted/30">
              <Target className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No active challenges in {displayLocationName}</p>
              <p className="text-sm text-muted-foreground">Create one to rally your community!</p>
            </Card>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Creation */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
              <MessageCircle className="h-6 w-6" />
              Share with {selectedLocation === "all" ? "Everyone" : displayLocationName}
            </h2>
            <div className="space-y-4">
              <Textarea 
                placeholder={`Share your plantation story with ${selectedLocation === "all" ? "the global community" : `${displayLocationName} community`}... 🌱`}
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)} 
                className="min-h-[100px]" 
              />
              <Button onClick={postMessage} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Share Progress
              </Button>
            </div>
          </Card>

          {/* Posts Feed */}
          <Card className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              {selectedLocation === "all" ? (
                <><Globe className="h-5 w-5 text-blue-500" /> Global Feed</>
              ) : (
                <><MapPin className="h-5 w-5 text-green-500" /> {displayLocationName} Feed</>
              )}
              <Badge variant="outline" className="ml-auto">{displayPosts.length} posts</Badge>
            </h3>
          </Card>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {displayPosts.length === 0 ? (
                <Card className="p-8 text-center">
                  <TreeDeciduous className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                </Card>
              ) : (
                displayPosts.map((post: any) => (
                  <PostCard key={post.id} post={post} leaderboard={displayLeaderboard} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar - Leaderboard */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              {selectedLocation === "all" ? "Global" : displayLocationName} Leaders
            </h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {displayLeaderboard.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No contributors yet. Plant a tree to get on the leaderboard!
                  </p>
                ) : (
                  displayLeaderboard.map((contributor, idx) => {
                    const badge = getBadgeInfo(contributor.trees_planted);
                    const isCurrentUser = contributor.user_id === userLocation.userId;
                    
                    return (
                      <Card 
                        key={contributor.user_id} 
                        className={`p-4 transition-all ${isCurrentUser ? 'border-primary/50 bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted/30'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center ${idx < 3 ? 'bg-gradient-to-br from-yellow-200 to-yellow-400' : 'bg-muted'}`}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : badge.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate flex items-center gap-1">
                              {contributor.display_name}
                              {isCurrentUser && <Badge variant="secondary" className="text-xs ml-1">You</Badge>}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {contributor.location}
                            </p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                🌳 {contributor.trees_planted}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                ⭐ {contributor.seed_points}
                              </Badge>
                            </div>
                          </div>
                          <Badge className={`${badge.color} text-white text-xs`}>
                            #{idx + 1}
                          </Badge>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Quick Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Members</span>
                <span className="font-bold">{displayLeaderboard.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Posts</span>
                <span className="font-bold">{displayPosts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Challenges</span>
                <span className="font-bold">{challenges.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, leaderboard }: { post: any; leaderboard: any[] }) => {
  const contributor = leaderboard.find(c => c.display_name === post.author_name);
  const badge = getBadgeInfo(contributor?.trees_planted || 0);
  const { likes, comments, hasLiked, likesCount, commentsCount, toggleLike, addComment } = usePostInteractions(post.id);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(newComment);
    setNewComment("");
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-l-primary/50">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${badge.color}/20`}>
          {badge.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-semibold">{post.author_name}</p>
            <Badge variant="secondary" className="text-xs">
              {badge.name}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {post.location || contributor?.location || 'Community'} · {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <p className="text-foreground mb-3 leading-relaxed">{post.content}</p>
      
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt="Post" 
          className="rounded-lg mb-3 w-full max-h-[300px] object-cover" 
        />
      )}
      
      <div className="flex gap-2 items-center border-t border-border pt-3">
        <Button 
          variant={hasLiked ? "default" : "ghost"} 
          size="sm"
          onClick={toggleLike}
          className={hasLiked ? "bg-primary hover:bg-primary/90" : ""}
        >
          <ThumbsUp className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
          {likesCount}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          {commentsCount}
        </Button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 border-t border-border pt-3">
          <div className="flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1"
            />
            <Button onClick={handleAddComment} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="max-h-[200px]">
            <div className="space-y-2">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-3 bg-muted/30">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                      🌱
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold">{comment.author_name}</p>
                      <p className="text-sm text-foreground">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
};
