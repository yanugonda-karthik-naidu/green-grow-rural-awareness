import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, ThumbsUp, Plus, Search, Leaf, Bug, Sparkles, Filter } from "lucide-react";
import { format } from "date-fns";

interface TreatmentTip {
  id: string;
  user_id: string;
  plant_name: string;
  disease_name: string;
  treatment: string;
  success_rate: string;
  helpful_count: number;
  created_at: string;
}

interface PlantCommunityTipsProps {
  userId: string;
  language?: string;
}

export const PlantCommunityTips = ({ userId, language = "en" }: PlantCommunityTipsProps) => {
  const [tips, setTips] = useState<TreatmentTip[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "plant" | "disease">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New tip form
  const [newPlantName, setNewPlantName] = useState("");
  const [newDiseaseName, setNewDiseaseName] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  const [newSuccessRate, setNewSuccessRate] = useState("effective");

  useEffect(() => {
    fetchTips();
    fetchUserVotes();

    const channel = supabase
      .channel('treatment-tips-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'treatment_tips' }, () => {
        fetchTips();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchTips = async () => {
    const { data, error } = await supabase
      .from('treatment_tips')
      .select('*')
      .order('helpful_count', { ascending: false });

    if (!error && data) {
      setTips(data);
    }
    setLoading(false);
  };

  const fetchUserVotes = async () => {
    const { data } = await supabase
      .from('treatment_tip_votes')
      .select('tip_id')
      .eq('user_id', userId);

    if (data) {
      setUserVotes(new Set(data.map(v => v.tip_id)));
    }
  };

  const handleSubmitTip = async () => {
    if (!newPlantName.trim() || !newDiseaseName.trim() || !newTreatment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from('treatment_tips').insert({
      user_id: userId,
      plant_name: newPlantName.trim(),
      disease_name: newDiseaseName.trim(),
      treatment: newTreatment.trim(),
      success_rate: newSuccessRate,
    });

    if (error) {
      toast.error("Failed to share tip");
    } else {
      toast.success("Treatment tip shared with the community!");
      setNewPlantName("");
      setNewDiseaseName("");
      setNewTreatment("");
      setNewSuccessRate("effective");
      setIsDialogOpen(false);
    }
  };

  const handleVote = async (tipId: string) => {
    const hasVoted = userVotes.has(tipId);

    if (hasVoted) {
      // Remove vote
      await supabase
        .from('treatment_tip_votes')
        .delete()
        .eq('tip_id', tipId)
        .eq('user_id', userId);

      await supabase
        .from('treatment_tips')
        .update({ helpful_count: tips.find(t => t.id === tipId)!.helpful_count - 1 })
        .eq('id', tipId);

      setUserVotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(tipId);
        return newSet;
      });
    } else {
      // Add vote
      await supabase
        .from('treatment_tip_votes')
        .insert({ tip_id: tipId, user_id: userId });

      await supabase
        .from('treatment_tips')
        .update({ helpful_count: tips.find(t => t.id === tipId)!.helpful_count + 1 })
        .eq('id', tipId);

      setUserVotes(prev => new Set([...prev, tipId]));
    }

    fetchTips();
  };

  const filteredTips = tips.filter(tip => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    if (filterType === "plant") {
      return tip.plant_name.toLowerCase().includes(query);
    } else if (filterType === "disease") {
      return tip.disease_name.toLowerCase().includes(query);
    }
    return (
      tip.plant_name.toLowerCase().includes(query) ||
      tip.disease_name.toLowerCase().includes(query) ||
      tip.treatment.toLowerCase().includes(query)
    );
  });

  const getSuccessRateBadge = (rate: string) => {
    switch (rate) {
      case "highly_effective":
        return <Badge className="bg-primary text-primary-foreground">Highly Effective</Badge>;
      case "effective":
        return <Badge className="bg-secondary text-secondary-foreground">Effective</Badge>;
      case "moderately_effective":
        return <Badge className="bg-accent text-accent-foreground">Moderately Effective</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Community Treatment Tips
            </CardTitle>
            <CardDescription>
              Share and discover successful plant treatments from fellow gardeners
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Share Tip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Treatment Success</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Plant Name</Label>
                  <Input
                    placeholder="e.g., Tomato, Rose, Mango"
                    value={newPlantName}
                    onChange={(e) => setNewPlantName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Disease/Issue</Label>
                  <Input
                    placeholder="e.g., Leaf spots, Aphids, Root rot"
                    value={newDiseaseName}
                    onChange={(e) => setNewDiseaseName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Treatment Solution</Label>
                  <Textarea
                    placeholder="Describe what worked for you..."
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Success Rate</Label>
                  <Select value={newSuccessRate} onValueChange={setNewSuccessRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highly_effective">Highly Effective</SelectItem>
                      <SelectItem value="effective">Effective</SelectItem>
                      <SelectItem value="moderately_effective">Moderately Effective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmitTip} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Share with Community
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={(v: "all" | "plant" | "disease") => setFilterType(v)}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="plant">Plant</SelectItem>
              <SelectItem value="disease">Disease</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tips List */}
        {filteredTips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tips found. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="gap-1">
                        <Leaf className="h-3 w-3" />
                        {tip.plant_name}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Bug className="h-3 w-3" />
                        {tip.disease_name}
                      </Badge>
                      {getSuccessRateBadge(tip.success_rate)}
                    </div>
                    <p className="text-sm">{tip.treatment}</p>
                    <p className="text-xs text-muted-foreground">
                      Shared {format(new Date(tip.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    variant={userVotes.has(tip.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote(tip.id)}
                    className="shrink-0"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {tip.helpful_count}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
