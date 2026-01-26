import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  Lightbulb, Search, CheckCircle, TrendingUp, Leaf, 
  Clock, ThumbsUp, Sparkles, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TreatmentRecommendationsProps {
  userId: string;
}

interface TreatmentPattern {
  diseaseName: string;
  treatment: string;
  successCount: number;
  totalCases: number;
  successRate: number;
  avgResolutionDays: number;
  plantTypes: string[];
  severity: string;
}

interface ActiveIssue {
  id: string;
  plantName: string;
  diseaseName: string | null;
  severity: string | null;
  diagnosis: string;
  createdAt: string;
  recommendations: TreatmentPattern[];
}

export const TreatmentRecommendations = ({ userId }: TreatmentRecommendationsProps) => {
  const [treatments, setTreatments] = useState<TreatmentPattern[]>([]);
  const [activeIssues, setActiveIssues] = useState<ActiveIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTreatmentData();
  }, [userId]);

  const fetchTreatmentData = async () => {
    try {
      // Fetch all diagnoses to analyze patterns
      const { data: allDiagnoses, error: allError } = await supabase
        .from("disease_diagnoses")
        .select("*")
        .order("created_at", { ascending: false });

      if (allError) throw allError;

      // Fetch user's active (unresolved) issues
      const { data: userActive, error: activeError } = await supabase
        .from("disease_diagnoses")
        .select("*")
        .eq("user_id", userId)
        .eq("is_resolved", false)
        .order("created_at", { ascending: false });

      if (activeError) throw activeError;

      // Analyze treatment patterns from resolved cases
      const treatmentMap: Record<string, {
        treatment: string;
        successCount: number;
        totalCases: number;
        totalDays: number;
        plantTypes: Set<string>;
        severities: string[];
      }> = {};

      allDiagnoses?.forEach((d) => {
        if (d.disease_name && d.treatment) {
          const key = `${d.disease_name.toLowerCase()}_${d.treatment.toLowerCase().substring(0, 50)}`;
          
          if (!treatmentMap[key]) {
            treatmentMap[key] = {
              treatment: d.treatment,
              successCount: 0,
              totalCases: 0,
              totalDays: 0,
              plantTypes: new Set(),
              severities: [],
            };
          }

          treatmentMap[key].totalCases++;
          treatmentMap[key].plantTypes.add(d.plant_name);
          if (d.severity) treatmentMap[key].severities.push(d.severity);

          if (d.is_resolved && d.resolved_at) {
            treatmentMap[key].successCount++;
            const created = new Date(d.created_at);
            const resolved = new Date(d.resolved_at);
            const days = Math.ceil((resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            treatmentMap[key].totalDays += days;
          }
        }
      });

      // Convert to treatment patterns
      const patterns: TreatmentPattern[] = Object.entries(treatmentMap)
        .map(([key, data]) => {
          const diseaseName = key.split("_")[0];
          const mostCommonSeverity = data.severities.length > 0
            ? data.severities.sort((a, b) =>
                data.severities.filter(s => s === b).length - 
                data.severities.filter(s => s === a).length
              )[0]
            : "mild";

          return {
            diseaseName,
            treatment: data.treatment,
            successCount: data.successCount,
            totalCases: data.totalCases,
            successRate: data.totalCases > 0 
              ? Math.round((data.successCount / data.totalCases) * 100) 
              : 0,
            avgResolutionDays: data.successCount > 0 
              ? Math.round(data.totalDays / data.successCount) 
              : 0,
            plantTypes: Array.from(data.plantTypes),
            severity: mostCommonSeverity,
          };
        })
        .filter(p => p.totalCases >= 1)
        .sort((a, b) => b.successRate - a.successRate);

      // Match recommendations to active issues
      const issuesWithRecs = userActive?.map((issue) => {
        const matchingTreatments = patterns.filter((p) => {
          if (!issue.disease_name) return false;
          return p.diseaseName.toLowerCase().includes(issue.disease_name.toLowerCase()) ||
                 issue.disease_name.toLowerCase().includes(p.diseaseName.toLowerCase());
        }).slice(0, 3);

        return {
          id: issue.id,
          plantName: issue.plant_name,
          diseaseName: issue.disease_name,
          severity: issue.severity,
          diagnosis: issue.diagnosis,
          createdAt: issue.created_at,
          recommendations: matchingTreatments,
        };
      }) || [];

      setTreatments(patterns);
      setActiveIssues(issuesWithRecs);
    } catch (error) {
      console.error("Error fetching treatment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTreatments = treatments.filter(t =>
    t.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.treatment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600 bg-green-500/10";
    if (rate >= 50) return "text-amber-600 bg-amber-500/10";
    return "text-red-600 bg-red-500/10";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Treatment Recommendations
        </CardTitle>
        <CardDescription>
          AI-powered suggestions based on successful past treatments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Active Issues ({activeIssues.length})
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Treatment Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : activeIssues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
                <p className="font-medium text-green-600">No Active Issues!</p>
                <p className="text-sm">All your plant health issues have been resolved.</p>
              </div>
            ) : (
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {activeIssues.map((issue) => (
                    <div 
                      key={issue.id}
                      className="p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-green-500" />
                            <h4 className="font-medium">{issue.plantName}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {issue.diseaseName || "Unknown condition"}
                          </p>
                        </div>
                        <Badge 
                          variant={issue.severity === "severe" ? "destructive" : "secondary"}
                          className="capitalize"
                        >
                          {issue.severity || "mild"}
                        </Badge>
                      </div>

                      {issue.recommendations.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Recommended Treatments
                          </p>
                          {issue.recommendations.map((rec, idx) => (
                            <div 
                              key={idx}
                              className="p-3 bg-background rounded-md border"
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-sm flex-1">{rec.treatment}</p>
                                <Badge className={cn("ml-2", getSuccessRateColor(rec.successRate))}>
                                  {rec.successRate}% success
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {rec.successCount}/{rec.totalCases} cases
                                </span>
                                {rec.avgResolutionDays > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    ~{rec.avgResolutionDays} days
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
                          <p className="text-sm text-amber-700">
                            No matching treatments found. Use the AI assistant for personalized advice.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="library" className="mt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search diseases or treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : filteredTreatments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No treatment patterns found yet.</p>
                <p className="text-sm">Diagnose more plants to build the knowledge base.</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {filteredTreatments.map((treatment, idx) => (
                    <div 
                      key={idx}
                      className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium capitalize">{treatment.diseaseName}</h4>
                          <Badge variant="outline" className="capitalize mt-1">
                            {treatment.severity}
                          </Badge>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-sm font-medium",
                          getSuccessRateColor(treatment.successRate)
                        )}>
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                          {treatment.successRate}%
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {treatment.treatment}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-green-500" />
                          {treatment.successCount} successful
                        </span>
                        <span className="flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          {treatment.plantTypes.length} plant types
                        </span>
                        {treatment.avgResolutionDays > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ~{treatment.avgResolutionDays} days avg
                          </span>
                        )}
                      </div>

                      {treatment.plantTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {treatment.plantTypes.slice(0, 3).map((plant, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {plant}
                            </Badge>
                          ))}
                          {treatment.plantTypes.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{treatment.plantTypes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
