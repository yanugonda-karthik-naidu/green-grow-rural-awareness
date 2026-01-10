import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Search,
  ChevronDown,
  ChevronUp,
  Leaf,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface DiseaseHistoryLogProps {
  userId: string | undefined;
  language: string;
}

interface DiagnosisEntry {
  id: string;
  plant_name: string;
  disease_name: string | null;
  symptoms: string | null;
  diagnosis: string;
  severity: string;
  treatment: string | null;
  image_url: string | null;
  is_resolved: boolean;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
}

const severityColors: Record<string, string> = {
  mild: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  moderate: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  severe: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const translations = {
  en: {
    title: "Disease History Log",
    subtitle: "Track your plants' health over time",
    noHistory: "No disease diagnoses yet",
    noHistoryDesc: "Use the Disease Detection mode to analyze plant issues",
    resolved: "Resolved",
    unresolved: "Active",
    markResolved: "Mark as Resolved",
    markUnresolved: "Mark as Active",
    addNotes: "Add treatment notes...",
    search: "Search diagnoses...",
    delete: "Delete",
    showMore: "Show Details",
    showLess: "Hide Details",
    treatment: "Treatment",
    symptoms: "Symptoms",
    diagnosedOn: "Diagnosed on",
    resolvedOn: "Resolved on",
    severity: "Severity",
    all: "All",
    active: "Active",
    resolvedFilter: "Resolved",
  },
  te: {
    title: "వ్యాధి చరిత్ర లాగ్",
    subtitle: "మీ మొక్కల ఆరోగ్యాన్ని ట్రాక్ చేయండి",
    noHistory: "ఇంకా వ్యాధి నిర్ధారణలు లేవు",
    noHistoryDesc: "మొక్క సమస్యలను విశ్లేషించడానికి వ్యాధి గుర్తింపు మోడ్ ఉపయోగించండి",
    resolved: "పరిష్కరించబడింది",
    unresolved: "యాక్టివ్",
    markResolved: "పరిష్కరించినట్లు గుర్తించు",
    markUnresolved: "యాక్టివ్‌గా గుర్తించు",
    addNotes: "చికిత్స నోట్స్ జోడించండి...",
    search: "నిర్ధారణలను వెతకండి...",
    delete: "తొలగించు",
    showMore: "వివరాలు చూపించు",
    showLess: "వివరాలు దాచు",
    treatment: "చికిత్స",
    symptoms: "లక్షణాలు",
    diagnosedOn: "నిర్ధారించబడిన తేదీ",
    resolvedOn: "పరిష్కరించిన తేదీ",
    severity: "తీవ్రత",
    all: "అన్నీ",
    active: "యాక్టివ్",
    resolvedFilter: "పరిష్కరించబడిన",
  },
  hi: {
    title: "रोग इतिहास लॉग",
    subtitle: "अपने पौधों के स्वास्थ्य को ट्रैक करें",
    noHistory: "अभी तक कोई रोग निदान नहीं",
    noHistoryDesc: "पौधों की समस्याओं का विश्लेषण करने के लिए रोग पहचान मोड का उपयोग करें",
    resolved: "हल किया गया",
    unresolved: "सक्रिय",
    markResolved: "हल के रूप में चिह्नित करें",
    markUnresolved: "सक्रिय के रूप में चिह्नित करें",
    addNotes: "उपचार नोट्स जोड़ें...",
    search: "निदान खोजें...",
    delete: "हटाएं",
    showMore: "विवरण दिखाएं",
    showLess: "विवरण छुपाएं",
    treatment: "उपचार",
    symptoms: "लक्षण",
    diagnosedOn: "निदान की तारीख",
    resolvedOn: "हल की तारीख",
    severity: "गंभीरता",
    all: "सभी",
    active: "सक्रिय",
    resolvedFilter: "हल किया गया",
  },
};

export const DiseaseHistoryLog = ({ userId, language }: DiseaseHistoryLogProps) => {
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (userId) {
      fetchDiagnoses();
    }
  }, [userId]);

  const fetchDiagnoses = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("disease_diagnoses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDiagnoses(data || []);
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
      toast.error("Failed to load disease history");
    } finally {
      setLoading(false);
    }
  };

  const toggleResolved = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("disease_diagnoses")
        .update({ 
          is_resolved: !currentStatus,
          resolved_at: !currentStatus ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
      
      setDiagnoses(prev => prev.map(d => 
        d.id === id 
          ? { ...d, is_resolved: !currentStatus, resolved_at: !currentStatus ? new Date().toISOString() : null }
          : d
      ));
      
      toast.success(!currentStatus ? t.resolved : t.unresolved);
    } catch (error) {
      console.error("Error updating diagnosis:", error);
      toast.error("Failed to update status");
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("disease_diagnoses")
        .update({ notes, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      
      setDiagnoses(prev => prev.map(d => 
        d.id === id ? { ...d, notes } : d
      ));
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const deleteDiagnosis = async (id: string) => {
    try {
      const { error } = await supabase
        .from("disease_diagnoses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setDiagnoses(prev => prev.filter(d => d.id !== id));
      toast.success("Diagnosis deleted");
    } catch (error) {
      console.error("Error deleting diagnosis:", error);
      toast.error("Failed to delete");
    }
  };

  const filteredDiagnoses = diagnoses.filter(d => {
    const matchesSearch = 
      d.plant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.disease_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "active" && !d.is_resolved) ||
      (filter === "resolved" && d.is_resolved);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Stethoscope className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-lg">{t.title}</CardTitle>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              {t.all}
            </Button>
            <Button
              size="sm"
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
            >
              {t.active}
            </Button>
            <Button
              size="sm"
              variant={filter === "resolved" ? "default" : "outline"}
              onClick={() => setFilter("resolved")}
            >
              {t.resolvedFilter}
            </Button>
          </div>
        </div>

        {/* Diagnoses List */}
        {filteredDiagnoses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">{t.noHistory}</p>
            <p className="text-sm">{t.noHistoryDesc}</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {filteredDiagnoses.map((diagnosis) => (
                <Card 
                  key={diagnosis.id} 
                  className={`transition-all ${
                    diagnosis.is_resolved 
                      ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800" 
                      : "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          checked={diagnosis.is_resolved}
                          onCheckedChange={() => toggleResolved(diagnosis.id, diagnosis.is_resolved)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-semibold ${diagnosis.is_resolved ? "line-through text-muted-foreground" : ""}`}>
                              {diagnosis.plant_name}
                            </h4>
                            {diagnosis.disease_name && (
                              <Badge variant="outline" className="text-xs">
                                {diagnosis.disease_name}
                              </Badge>
                            )}
                            <Badge className={`text-xs ${severityColors[diagnosis.severity] || severityColors.mild}`}>
                              {diagnosis.severity}
                            </Badge>
                            {diagnosis.is_resolved ? (
                              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {t.resolved}
                              </Badge>
                            ) : (
                              <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {t.unresolved}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t.diagnosedOn}: {format(new Date(diagnosis.created_at), "MMM d, yyyy")}
                            {diagnosis.is_resolved && diagnosis.resolved_at && (
                              <span className="ml-2 text-green-600 dark:text-green-400">
                                • {t.resolvedOn}: {format(new Date(diagnosis.resolved_at), "MMM d, yyyy")}
                              </span>
                            )}
                          </p>

                          {/* Expandable Details */}
                          {expandedId === diagnosis.id && (
                            <div className="mt-3 space-y-2 text-sm">
                              <div className="p-3 bg-background/80 rounded-lg space-y-2">
                                <p><strong>{t.symptoms}:</strong> {diagnosis.symptoms || "N/A"}</p>
                                <p className="whitespace-pre-wrap">{diagnosis.diagnosis}</p>
                                {diagnosis.treatment && (
                                  <p><strong>{t.treatment}:</strong> {diagnosis.treatment}</p>
                                )}
                              </div>
                              
                              <Textarea
                                placeholder={t.addNotes}
                                value={diagnosis.notes || ""}
                                onChange={(e) => updateNotes(diagnosis.id, e.target.value)}
                                className="mt-2"
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpandedId(expandedId === diagnosis.id ? null : diagnosis.id)}
                        >
                          {expandedId === diagnosis.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteDiagnosis(diagnosis.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
