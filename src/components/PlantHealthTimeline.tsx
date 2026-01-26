import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, Calendar, Leaf } from "lucide-react";

interface PlantHealthTimelineProps {
  userId: string;
  language?: string;
}

interface Diagnosis {
  id: string;
  plant_name: string;
  disease_name: string | null;
  severity: string | null;
  is_resolved: boolean | null;
  created_at: string;
  resolved_at: string | null;
  treatment: string | null;
}

const SEVERITY_COLORS = {
  mild: "#22c55e",
  moderate: "#f59e0b", 
  severe: "#ef4444"
};

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

export const PlantHealthTimeline = ({ userId, language = "en" }: PlantHealthTimelineProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6");
  const [selectedPlant, setSelectedPlant] = useState<string>("all");

  useEffect(() => {
    fetchDiagnoses();
  }, [userId, timeRange]);

  const fetchDiagnoses = async () => {
    const monthsAgo = subMonths(new Date(), parseInt(timeRange));
    
    const { data, error } = await supabase
      .from("disease_diagnoses")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", monthsAgo.toISOString())
      .order("created_at", { ascending: true });

    if (!error && data) {
      setDiagnoses(data);
    }
    setLoading(false);
  };

  const filteredDiagnoses = selectedPlant === "all" 
    ? diagnoses 
    : diagnoses.filter(d => d.plant_name === selectedPlant);

  const uniquePlants = [...new Set(diagnoses.map(d => d.plant_name))];

  // Timeline data - diagnoses per month
  const getTimelineData = () => {
    const months = parseInt(timeRange);
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(monthStart);
      const monthLabel = format(monthStart, "MMM yyyy");
      
      const monthDiagnoses = filteredDiagnoses.filter(d => {
        const date = parseISO(d.created_at);
        return date >= monthStart && date <= monthEnd;
      });
      
      const resolved = monthDiagnoses.filter(d => d.is_resolved).length;
      const active = monthDiagnoses.filter(d => !d.is_resolved).length;
      
      data.push({
        month: monthLabel,
        total: monthDiagnoses.length,
        resolved,
        active,
        mild: monthDiagnoses.filter(d => d.severity === "mild").length,
        moderate: monthDiagnoses.filter(d => d.severity === "moderate").length,
        severe: monthDiagnoses.filter(d => d.severity === "severe").length,
      });
    }
    
    return data;
  };

  // Severity distribution
  const getSeverityData = () => {
    const mild = filteredDiagnoses.filter(d => d.severity === "mild").length;
    const moderate = filteredDiagnoses.filter(d => d.severity === "moderate").length;
    const severe = filteredDiagnoses.filter(d => d.severity === "severe").length;
    
    return [
      { name: "Mild", value: mild, color: SEVERITY_COLORS.mild },
      { name: "Moderate", value: moderate, color: SEVERITY_COLORS.moderate },
      { name: "Severe", value: severe, color: SEVERITY_COLORS.severe },
    ].filter(d => d.value > 0);
  };

  // Resolution rate over time
  const getResolutionData = () => {
    const months = parseInt(timeRange);
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(monthStart);
      const monthLabel = format(monthStart, "MMM");
      
      const monthDiagnoses = filteredDiagnoses.filter(d => {
        const date = parseISO(d.created_at);
        return date >= monthStart && date <= monthEnd;
      });
      
      const total = monthDiagnoses.length;
      const resolved = monthDiagnoses.filter(d => d.is_resolved).length;
      const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
      
      data.push({
        month: monthLabel,
        rate,
        resolved,
        total
      });
    }
    
    return data;
  };

  // Plant health scores
  const getPlantHealthData = () => {
    const plantScores = uniquePlants.map(plant => {
      const plantDiagnoses = diagnoses.filter(d => d.plant_name === plant);
      const total = plantDiagnoses.length;
      const resolved = plantDiagnoses.filter(d => d.is_resolved).length;
      const severeCases = plantDiagnoses.filter(d => d.severity === "severe").length;
      
      // Health score: higher is better (100 = no issues, lower = more/severe issues)
      let score = 100;
      score -= (total * 5); // -5 per diagnosis
      score -= (severeCases * 10); // additional -10 per severe case
      score += (resolved * 3); // +3 for each resolved
      score = Math.max(0, Math.min(100, score));
      
      return {
        plant,
        score,
        issues: total,
        resolved
      };
    });
    
    return plantScores.sort((a, b) => b.score - a.score);
  };

  // Stats summary
  const stats = {
    total: filteredDiagnoses.length,
    resolved: filteredDiagnoses.filter(d => d.is_resolved).length,
    active: filteredDiagnoses.filter(d => !d.is_resolved).length,
    resolutionRate: filteredDiagnoses.length > 0 
      ? Math.round((filteredDiagnoses.filter(d => d.is_resolved).length / filteredDiagnoses.length) * 100)
      : 0
  };

  const timelineData = getTimelineData();
  const severityData = getSeverityData();
  const resolutionData = getResolutionData();
  const plantHealthData = getPlantHealthData();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-pulse text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Plant Health Timeline
            </CardTitle>
            <CardDescription>
              Track disease history and treatment progress over time
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Plants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants</SelectItem>
                {uniquePlants.map(plant => (
                  <SelectItem key={plant} value={plant}>{plant}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Issues</div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.resolutionRate}%</div>
            <div className="text-sm text-muted-foreground">Resolution Rate</div>
          </div>
        </div>

        {diagnoses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No disease diagnoses recorded yet.</p>
            <p className="text-sm">Use the AI assistant to diagnose plant health issues.</p>
          </div>
        ) : (
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline" className="text-xs sm:text-sm">
                <Calendar className="h-4 w-4 mr-1 hidden sm:inline" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="severity" className="text-xs sm:text-sm">
                <AlertTriangle className="h-4 w-4 mr-1 hidden sm:inline" />
                Severity
              </TabsTrigger>
              <TabsTrigger value="resolution" className="text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1 hidden sm:inline" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="plants" className="text-xs sm:text-sm">
                <Leaf className="h-4 w-4 mr-1 hidden sm:inline" />
                Plants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="resolved" 
                      stackId="1"
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.6}
                      name="Resolved"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="active" 
                      stackId="1"
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      name="Active"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Disease diagnoses over time (stacked by status)
              </p>
            </TabsContent>

            <TabsContent value="severity" className="mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="mild" stackId="a" fill={SEVERITY_COLORS.mild} name="Mild" />
                      <Bar dataKey="moderate" stackId="a" fill={SEVERITY_COLORS.moderate} name="Moderate" />
                      <Bar dataKey="severe" stackId="a" fill={SEVERITY_COLORS.severe} name="Severe" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Severity distribution of plant health issues
              </p>
            </TabsContent>

            <TabsContent value="resolution" className="mt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resolutionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Resolution Rate']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Treatment resolution rate over time (higher is better)
              </p>
            </TabsContent>

            <TabsContent value="plants" className="mt-4">
              <div className="space-y-3">
                {plantHealthData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No plant data available
                  </p>
                ) : (
                  plantHealthData.map((plant, index) => (
                    <div 
                      key={plant.plant}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{plant.plant}</p>
                          <p className="text-xs text-muted-foreground">
                            {plant.issues} issues • {plant.resolved} resolved
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500"
                            style={{ 
                              width: `${plant.score}%`,
                              backgroundColor: plant.score >= 70 ? '#22c55e' : plant.score >= 40 ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                        <Badge 
                          variant={plant.score >= 70 ? "default" : plant.score >= 40 ? "secondary" : "destructive"}
                          className="w-12 justify-center"
                        >
                          {plant.score}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Plant health scores based on disease history (100 = healthiest)
              </p>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
