import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Heart, ThumbsUp, Sprout, Leaf, MessageCircle, Share2, Image as ImageIcon, Video, Award, Trophy, MapPin, Globe, Sparkles, TrendingUp, Users, Send } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useRealtimeAnalytics } from "@/hooks/useRealtimeAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}
interface Message {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  reactions: {
    like: number;
    love: number;
    plant: number;
    support: number;
  };
  comments: Comment[];
  tags: string[];
  location?: string;
  imageUrl?: string;
  greenPoints: number;
  userBadge?: string;
}
interface User {
  id: string;
  name: string;
  points: number;
  treesPlanted: number;
  badge: string;
  location: string;
  isCurrentUser?: boolean;
}
interface CommunityChallenge {
  id: string;
  title: string;
  target: number;
  current: number;
  endDate: string;
}
interface CommunityWallProps {
  t: any;
}
const ecoFacts = ["🌳 1 mature tree provides oxygen for 2 humans daily", "🌍 Trees can reduce air temperature by up to 10°C", "💧 A single tree can absorb 22 kg of CO₂ per year", "🐦 Trees provide shelter for over 80% of terrestrial biodiversity", "🌱 Planting trees improves soil quality and prevents erosion"];
const motivationalQuotes = ["Let's grow together 🌱", "Every tree makes a difference 🌳", "Be the change you wish to see 🌍", "Plant today, breathe tomorrow 💚", "Together we can heal the Earth 🌿"];
const badges = {
  starter: {
    icon: "🌱",
    name: "Green Starter",
    minTrees: 0
  },
  explorer: {
    icon: "🌿",
    name: "Eco Explorer",
    minTrees: 5
  },
  guardian: {
    icon: "🌳",
    name: "Eco Guardian",
    minTrees: 15
  },
  hero: {
    icon: "🌾",
    name: "Village Hero",
    minTrees: 30
  },
  saver: {
    icon: "🌍",
    name: "Earth Saver",
    minTrees: 50
  }
};
export const CommunityWall = ({
  t
}: CommunityWallProps) => {
  const {
    posts: communityPosts,
    loading: postsLoading
  } = useCommunityPosts();
  const {
    analytics,
    loading: analyticsLoading
  } = useRealtimeAnalytics();
  const [messages, setMessages] = useLocalStorage<Message[]>('communityMessages', []);
  const [topContributors, setTopContributors] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newComment, setNewComment] = useState<{
    [key: string]: string;
  }>({});
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showComments, setShowComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [currentFact, setCurrentFact] = useState(ecoFacts[0]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Fetch top contributors from database with real user names
  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('user_progress').select('user_id, trees_planted, seed_points').order('trees_planted', {
          ascending: false
        }).limit(5);
        if (error || !data) return;
        
        const {
          data: {
            user: currentUser
          }
        } = await supabase.auth.getUser();
        
        // Fetch profile data for all contributors
        const userIds = data.filter(contrib => contrib.trees_planted > 0).map(contrib => contrib.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, location')
          .in('id', userIds);
        
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        const contributors: User[] = data.filter(contrib => contrib.trees_planted > 0).map(contrib => {
          const badgeInfo = getUserBadge(contrib.trees_planted);
          const profile = profileMap.get(contrib.user_id);
          return {
            id: contrib.user_id,
            name: profile?.display_name || 'Community Member',
            points: contrib.seed_points,
            treesPlanted: contrib.trees_planted,
            badge: badgeInfo.name,
            location: profile?.location || 'Community',
            isCurrentUser: contrib.user_id === currentUser?.id
          };
        });
        setTopContributors(contributors);
      } catch (err) {
        console.error('Error fetching contributors:', err);
      }
    };
    fetchTopContributors();

    // Subscribe to real-time updates
    const channel = supabase.channel('progress-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'user_progress'
    }, () => {
      fetchTopContributors();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Rotate motivational quotes every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate global impact from realtime analytics
  const globalImpact = {
    totalTrees: analytics?.total_trees || 0,
    co2Saved: Math.round(analytics?.total_co2_kg || 0),
    o2Generated: Math.round(analytics?.total_o2_lpd || 0),
    areaExpanded: Math.round(analytics?.total_area_m2 || 0),
    usersInvolved: topContributors.length > 0 ? topContributors.length : 0
  };
  const getUserBadge = (treesPlanted: number) => {
    if (treesPlanted >= 50) return badges.saver;
    if (treesPlanted >= 30) return badges.hero;
    if (treesPlanted >= 15) return badges.guardian;
    if (treesPlanted >= 5) return badges.explorer;
    return badges.starter;
  };
  const postMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to post");
        return;
      }

      // Get user profile for display name
      const {
        data: profile
      } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
      const authorName = profile?.display_name || user.email?.split('@')[0] || 'Anonymous';

      // Insert into Supabase
      const {
        error
      } = await supabase.from('community_posts').insert({
        user_id: user.id,
        content: newMessage,
        author_name: authorName,
        likes: 0
      });
      if (error) throw error;

      // Also save locally for backward compatibility
      const message: Message = {
        id: Date.now().toString(),
        author: authorName,
        text: newMessage,
        timestamp: new Date().toLocaleString(),
        reactions: {
          like: 0,
          love: 0,
          plant: 0,
          support: 0
        },
        comments: [],
        tags: tags,
        location: "My Village",
        greenPoints: 10,
        userBadge: badges.guardian.icon
      };
      setMessages([message, ...messages]);
      setNewMessage("");
      setTags([]);
      setTagInput("");
      toast.success("Post shared! +10 Green Points 🌱");
    } catch (error) {
      console.error('Error posting message:', error);
      toast.error("Failed to post message");
    }
  };
  const addReaction = (messageId: string, reactionType: keyof Message['reactions']) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reactionType]: msg.reactions[reactionType] + 1
          }
        };
      }
      return msg;
    }));
    toast.success("Reaction added! +2 Green Points 🌿");
  };
  const addComment = (messageId: string) => {
    const commentText = newComment[messageId];
    if (!commentText?.trim()) return;
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          comments: [...msg.comments, {
            id: Date.now().toString(),
            author: "You",
            text: commentText,
            timestamp: new Date().toLocaleString()
          }]
        };
      }
      return msg;
    }));
    setNewComment({
      ...newComment,
      [messageId]: ""
    });
    toast.success("Comment added! +5 Green Points 💬");
  };
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Combine local messages with database posts
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  // Calculate community challenge from real data
  const challengeTarget = 100;
  const challengeCurrent = globalImpact.totalTrees;
  const challengeProgress = (challengeCurrent / challengeTarget) * 100;

  // Convert database posts to Message format
  const dbMessages: Message[] = communityPosts.map(post => ({
    id: post.id,
    author: post.author_name,
    text: post.content,
    timestamp: new Date(post.created_at).toLocaleString(),
    reactions: {
      like: post.likes || 0,
      love: 0,
      plant: 0,
      support: 0
    },
    comments: [],
    tags: [],
    location: "Community",
    greenPoints: 10,
    userBadge: badges.starter.icon,
    imageUrl: post.image_url || undefined
  }));

  // Merge and sort by timestamp
  const allMessages = [...dbMessages, ...safeMessages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const filteredMessages = selectedLocation === "all" ? allMessages : allMessages.filter(msg => msg.location === selectedLocation);
  return <div className="space-y-6">
      {/* Motivational Banner */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <p className="text-lg font-semibold text-foreground">{currentQuote}</p>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
      </Card>

      {/* Global Impact Counter - Real-time */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <Globe className="h-6 w-6 text-primary animate-pulse" />
          Global Community Impact (Live)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{globalImpact.totalTrees}</div>
            <div className="text-sm text-muted-foreground">Trees Planted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{globalImpact.co2Saved}kg</div>
            <div className="text-sm text-muted-foreground">CO₂ Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{globalImpact.o2Generated}L</div>
            <div className="text-sm text-muted-foreground">O₂/Day</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{globalImpact.areaExpanded}m²</div>
            <div className="text-sm text-muted-foreground">Green Area</div>
          </div>
        </div>
      </Card>

      {/* Community Challenge */}
      <Card className="p-6 border-2 border-primary/30">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Community Challenge</h3>
        </div>
        <p className="text-foreground mb-3">Plant {challengeTarget} trees together as a community!</p>
        <Progress value={Math.min(challengeProgress, 100)} className="h-3 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{challengeCurrent} / {challengeTarget} trees</span>
          <span>{challengeCurrent >= challengeTarget ? '✓ Completed!' : `${Math.max(0, challengeTarget - challengeCurrent)} more to go`}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Creation Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
              <Sprout className="h-6 w-6" />
              {t.communityWall}
            </h2>
            
            <div className="space-y-4">
              <Textarea placeholder="Share your plantation story, ideas, or progress... 🌱" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="min-h-[120px] resize-none" />
              
              {/* Tags Input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="Add tags (e.g., #MyTree, #GreenVillage)" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTag()} className="flex-1" />
                  <Button onClick={addTag} variant="outline" size="sm">
                    Add Tag
                  </Button>
                </div>
                {tags.length > 0 && <div className="flex flex-wrap gap-2">
                    {tags.map(tag => <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>)}
                  </div>}
              </div>

              <div className="flex gap-2">
                <Button onClick={postMessage} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Share Progress
                </Button>
              </div>
            </div>
          </Card>

          {/* Location Filter */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <MapPin className="h-5 w-5 text-primary" />
              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="flex-1 p-2 rounded-md border border-input bg-background">
                <option value="all">All Locations</option>
                <option value="My Village">My Village</option>
                <option value="Village A">Village A</option>
                <option value="Village B">Village B</option>
              </select>
            </div>
          </Card>

          {/* Posts Feed */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {filteredMessages.map((message, index) => <>
                  {index > 0 && index % 3 === 0 && <Card className="p-3 bg-primary/5 border-primary/20">
                      <p className="text-sm text-center text-muted-foreground italic">
                        💡 {ecoFacts[Math.floor(Math.random() * ecoFacts.length)]}
                      </p>
                    </Card>}
                  
                  <Card key={message.id} className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
                    {/* Author Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                          {message.userBadge}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{message.author}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {message.location} · {message.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Leaf className="h-3 w-3" />
                        +{message.greenPoints} pts
                      </Badge>
                    </div>

                    {/* Message Content */}
                    <p className="text-foreground mb-3 leading-relaxed">{message.text}</p>

                    {/* Image if exists */}
                    {message.imageUrl && <div className="mb-3 rounded-lg overflow-hidden">
                        <img src={message.imageUrl.startsWith('http') ? message.imageUrl : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/plant-images/${message.imageUrl}`} alt="Post" className="w-full max-h-96 object-cover" />
                      </div>}

                    {/* Tags */}
                    {message.tags && Array.isArray(message.tags) && message.tags.length > 0 && <div className="flex flex-wrap gap-2 mb-3">
                        {message.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>)}
                      </div>}

                    <Separator className="my-3" />

                    {/* Reactions */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => addReaction(message.id, 'like')} className="gap-1 hover:bg-blue-100 dark:hover:bg-blue-900">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xs">{message.reactions?.like || 0}</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => addReaction(message.id, 'love')} className="gap-1 hover:bg-red-100 dark:hover:bg-red-900">
                          <Heart className="h-4 w-4" />
                          <span className="text-xs">{message.reactions?.love || 0}</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => addReaction(message.id, 'plant')} className="gap-1 hover:bg-green-100 dark:hover:bg-green-900">
                          <Sprout className="h-4 w-4" />
                          <span className="text-xs">{message.reactions?.plant || 0}</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => addReaction(message.id, 'support')} className="gap-1 hover:bg-purple-100 dark:hover:bg-purple-900">
                          <Leaf className="h-4 w-4" />
                          <span className="text-xs">{message.reactions?.support || 0}</span>
                        </Button>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setShowComments({
                    ...showComments,
                    [message.id]: !showComments[message.id]
                  })} className="gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{message.comments?.length || 0}</span>
                      </Button>
                    </div>

                    {/* Comments Section */}
                    {showComments[message.id] && <div className="space-y-3 pt-3 border-t">
                        {(message.comments || []).map(comment => <div key={comment.id} className="flex gap-2 text-sm">
                            <div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center text-xs flex-shrink-0">
                              {comment.author === "EcoBot 🤖" ? "🤖" : "👤"}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-xs text-foreground">{comment.author}</p>
                              <p className="text-muted-foreground">{comment.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">{comment.timestamp}</p>
                            </div>
                          </div>)}
                        
                        <div className="flex gap-2 mt-3">
                          <Input placeholder="Add a comment..." value={newComment[message.id] || ""} onChange={e => setNewComment({
                      ...newComment,
                      [message.id]: e.target.value
                    })} onKeyPress={e => e.key === 'Enter' && addComment(message.id)} className="flex-1" />
                          <Button onClick={() => addComment(message.id)} size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>}
                  </Card>
                </>)}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <Award className="h-5 w-5 text-primary" />
              Top Contributors
            </h3>
            <div className="space-y-3">
              {topContributors.map((user, index) => <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {getUserBadge(user.treesPlanted).icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{user.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{user.points} pts</span>
                      <span>·</span>
                      <span>{user.treesPlanted} trees</span>
                    </div>
                  </div>
                </div>)}
            </div>
          </Card>

          {/* Badges System */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <Trophy className="h-5 w-5 text-primary" />
              Achievement Badges
            </h3>
            <div className="space-y-3">
              {Object.entries(badges).map(([key, badge]) => <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/20">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.minTrees}+ trees</p>
                  </div>
                </div>)}
            </div>
          </Card>

          {/* Impact Visualization */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Impact
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Trees Planted</span>
                  <span className="font-semibold text-foreground">0 / 25</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Green Points</span>
                  <span className="font-semibold text-foreground">0 / 500</span>
                </div>
                <Progress value={56} className="h-2" />
              </div>
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">Keep going to reach</p>
                <p className="font-bold text-primary">{badges.guardian.icon} {badges.guardian.name}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};