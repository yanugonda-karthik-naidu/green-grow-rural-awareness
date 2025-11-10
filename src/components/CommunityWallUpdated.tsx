import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Heart, ThumbsUp, MapPin, Globe, Sparkles, TrendingUp, Send, Trophy, MessageCircle } from "lucide-react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useRealtimeAnalytics } from "@/hooks/useRealtimeAnalytics";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommunityWallProps {
  t: any;
}

const motivationalQuotes = [
  "Let's grow together 🌱",
  "Every tree makes a difference 🌳",
  "Be the change you wish to see 🌍",
  "Plant today, breathe tomorrow 💚",
  "Together we can heal the Earth 🌿"
];

const getBadgeInfo = (treesPlanted: number) => {
  if (treesPlanted >= 50) return { icon: "🌍", name: "Earth Saver" };
  if (treesPlanted >= 30) return { icon: "🌾", name: "Village Hero" };
  if (treesPlanted >= 15) return { icon: "🌳", name: "Eco Guardian" };
  if (treesPlanted >= 5) return { icon: "🌿", name: "Eco Explorer" };
  return { icon: "🌱", name: "Green Starter" };
};

export const CommunityWall = ({ t }: CommunityWallProps) => {
  const { posts: communityPosts } = useCommunityPosts();
  const { analytics } = useRealtimeAnalytics();
  
  const [newMessage, setNewMessage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [locationsList, setLocationsList] = useState<string[]>([]);

  // Fetch top contributors with real locations
  useEffect(() => {
    const fetchContributors = async () => {
      const { data } = await supabase
        .from('user_progress')
        .select('user_id, trees_planted, seed_points')
        .order('trees_planted', { ascending: false })
        .limit(5);

      if (!data) return;

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const userIds = data.filter(c => c.trees_planted > 0).map(c => c.user_id);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, location')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const contributors = data
        .filter(c => c.trees_planted > 0)
        .map(c => {
          const profile = profileMap.get(c.user_id);
          const badge = getBadgeInfo(c.trees_planted);
          return {
            id: c.user_id,
            name: profile?.display_name || 'Community Member',
            points: c.seed_points,
            treesPlanted: c.trees_planted,
            badge: badge.name,
            badgeIcon: badge.icon,
            location: profile?.location || 'Community',
            isCurrentUser: c.user_id === currentUser?.id
          };
        });

      setTopContributors(contributors);

      // Extract unique locations
      const locations = Array.from(new Set(contributors.map(c => c.location).filter(Boolean)));
      setLocationsList(locations);
    };

    fetchContributors();

    const channel = supabase
      .channel('progress-location-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, fetchContributors)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchContributors)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 60000);
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
      likes: 0
    });

    if (error) {
      toast.error("Failed to post message");
      return;
    }

    setNewMessage("");
    toast.success("Post shared! +10 Green Points 🌱");
  };

  const globalImpact = {
    totalTrees: analytics?.total_trees || 0,
    co2Saved: Math.round(analytics?.total_co2_kg || 0),
    o2Generated: Math.round(analytics?.total_o2_lpd || 0),
    areaExpanded: Math.round(analytics?.total_area_m2 || 0),
  };

  // Group posts by location from contributors
  const postsByLocation = communityPosts.reduce((acc: any, post) => {
    const contributor = topContributors.find(c => c.name === post.author_name);
    const location = contributor?.location || "Community";
    if (!acc[location]) acc[location] = [];
    acc[location].push(post);
    return acc;
  }, {});

  const filteredPosts = selectedLocation === "all" 
    ? communityPosts 
    : postsByLocation[selectedLocation] || [];

  const challengeTarget = 100;
  const challengeCurrent = globalImpact.totalTrees;
  const challengeProgress = Math.min((challengeCurrent / challengeTarget) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Motivational Banner */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <p className="text-lg font-semibold text-foreground">{currentQuote}</p>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
      </Card>

      {/* Global Impact Counter - Real-time */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2 border-green-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <Globe className="h-6 w-6 text-primary animate-pulse" />
          🌍 Global Community Impact (Live Updates)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-green-600 animate-pulse">{globalImpact.totalTrees}</div>
            <div className="text-sm text-muted-foreground mt-1">Trees Planted</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-blue-600 animate-pulse">{globalImpact.co2Saved}kg</div>
            <div className="text-sm text-muted-foreground mt-1">CO₂ Saved</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-cyan-600 animate-pulse">{globalImpact.o2Generated}L</div>
            <div className="text-sm text-muted-foreground mt-1">O₂/Day</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
            <div className="text-3xl font-bold text-emerald-600 animate-pulse">{globalImpact.areaExpanded}m²</div>
            <div className="text-sm text-muted-foreground mt-1">Green Area</div>
          </div>
        </div>
      </Card>

      {/* Community Challenge */}
      <Card className="p-6 border-2 border-primary/30">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Community Challenge</h3>
        </div>
        <p className="text-foreground mb-3">Plant {challengeTarget} trees together!</p>
        <Progress value={challengeProgress} className="h-3 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{challengeCurrent} / {challengeTarget} trees</span>
          <span>{challengeCurrent >= challengeTarget ? '✓ Completed!' : `${challengeTarget - challengeCurrent} more to go`}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Creation */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
              {t.communityWall}
            </h2>
            <div className="space-y-4">
              <Textarea 
                placeholder="Share your plantation story... 🌱" 
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

          {/* Location Filter */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <MapPin className="h-5 w-5 text-primary" />
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌍 All Locations</SelectItem>
                  {locationsList.map(loc => (
                    <SelectItem key={loc} value={loc}>📍 {loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Location-Based Feed */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {selectedLocation !== "all" && (
                <Card className="p-4 bg-primary/5 border-primary/30">
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Updates from {selectedLocation}
                  </h3>
                </Card>
              )}
              
              {filteredPosts.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No posts yet in this location. Be the first to share!</p>
                </Card>
              ) : (
                filteredPosts.map((post: any) => <PostCard key={post.id} post={post} topContributors={topContributors} />)
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar - Top Contributors */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Contributors
            </h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {topContributors.map((contributor, idx) => (
                  <Card key={contributor.id} className={`p-4 ${contributor.isCurrentUser ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : contributor.badgeIcon}</div>
                      <div className="flex-1">
                        <p className="font-semibold">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {contributor.location}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            🌳 {contributor.treesPlanted}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            ⭐ {contributor.points}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Post Card Component with Likes and Comments
const PostCard = ({ post, topContributors }: { post: any; topContributors: any[] }) => {
  const contributor = topContributors.find(c => c.name === post.author_name);
  const { likes, comments, hasLiked, likesCount, commentsCount, toggleLike, addComment } = usePostInteractions(post.id);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(newComment);
    setNewComment("");
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
          {contributor?.badgeIcon || '🌱'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{post.author_name}</p>
            <Badge variant="secondary">
              {contributor?.badge || 'Green Starter'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {contributor?.location || 'Community'} · {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <p className="text-foreground mb-3">{post.content}</p>
      
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="rounded-lg mb-3 w-full" />
      )}
      
      <div className="flex gap-2 items-center border-t border-border pt-3">
        <Button 
          variant={hasLiked ? "default" : "ghost"} 
          size="sm"
          onClick={toggleLike}
          className={hasLiked ? "bg-primary" : ""}
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
