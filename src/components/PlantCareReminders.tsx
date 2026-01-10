import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Droplets, 
  Leaf, 
  Bug, 
  Sun, 
  Plus, 
  Trash2, 
  Check,
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, isPast, addDays, formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PlantCareRemindersProps {
  userId: string | undefined;
  language: string;
}

interface Reminder {
  id: string;
  plant_name: string;
  plant_id: string | null;
  reminder_type: string;
  frequency_days: number;
  last_completed_at: string | null;
  next_due_at: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

const reminderTypes = [
  { value: "watering", icon: Droplets, color: "text-blue-500" },
  { value: "fertilizing", icon: Leaf, color: "text-green-500" },
  { value: "pest_check", icon: Bug, color: "text-orange-500" },
  { value: "sunlight", icon: Sun, color: "text-yellow-500" },
  { value: "treatment", icon: RefreshCw, color: "text-purple-500" },
];

const translations = {
  en: {
    title: "Plant Care Reminders",
    subtitle: "Never forget to care for your plants",
    addReminder: "Add Reminder",
    plantName: "Plant Name",
    reminderType: "Reminder Type",
    frequency: "Frequency (days)",
    noReminders: "No reminders set",
    noRemindersDesc: "Add reminders to get notified about plant care",
    due: "Due",
    overdue: "Overdue",
    upcoming: "Upcoming",
    completed: "Completed",
    markComplete: "Mark Complete",
    delete: "Delete",
    watering: "Watering",
    fertilizing: "Fertilizing",
    pest_check: "Pest Check",
    sunlight: "Sunlight Check",
    treatment: "Treatment",
    every: "Every",
    days: "days",
    dueIn: "Due in",
    overdueBy: "Overdue by",
    lastCompleted: "Last completed",
    notes: "Notes (optional)",
    save: "Save Reminder",
    todaysTasks: "Today's Tasks",
    upcomingTasks: "Upcoming",
    active: "Active",
    paused: "Paused",
  },
  te: {
    title: "మొక్క సంరక్షణ రిమైండర్లు",
    subtitle: "మీ మొక్కలను సంరక్షించడం మర్చిపోకండి",
    addReminder: "రిమైండర్ జోడించండి",
    plantName: "మొక్క పేరు",
    reminderType: "రిమైండర్ రకం",
    frequency: "ఫ్రీక్వెన్సీ (రోజులు)",
    noReminders: "రిమైండర్లు సెట్ చేయబడలేదు",
    noRemindersDesc: "మొక్క సంరక్షణ గురించి నోటిఫై చేయబడటానికి రిమైండర్లు జోడించండి",
    due: "గడువు",
    overdue: "గడువు మించింది",
    upcoming: "రాబోయేది",
    completed: "పూర్తయింది",
    markComplete: "పూర్తయినట్లు గుర్తించు",
    delete: "తొలగించు",
    watering: "నీరు పోయడం",
    fertilizing: "ఎరువులు",
    pest_check: "తెగులు తనిఖీ",
    sunlight: "సూర్యకాంతి తనిఖీ",
    treatment: "చికిత్స",
    every: "ప్రతి",
    days: "రోజులు",
    dueIn: "లో గడువు",
    overdueBy: "గడువు మించింది",
    lastCompleted: "చివరిసారి పూర్తయింది",
    notes: "నోట్స్ (ఐచ్ఛికం)",
    save: "రిమైండర్ సేవ్ చేయండి",
    todaysTasks: "నేటి టాస్క్‌లు",
    upcomingTasks: "రాబోయేవి",
    active: "యాక్టివ్",
    paused: "పాజ్ చేయబడింది",
  },
  hi: {
    title: "पौधों की देखभाल रिमाइंडर",
    subtitle: "अपने पौधों की देखभाल करना न भूलें",
    addReminder: "रिमाइंडर जोड़ें",
    plantName: "पौधे का नाम",
    reminderType: "रिमाइंडर प्रकार",
    frequency: "आवृत्ति (दिन)",
    noReminders: "कोई रिमाइंडर सेट नहीं",
    noRemindersDesc: "पौधों की देखभाल के बारे में सूचित होने के लिए रिमाइंडर जोड़ें",
    due: "देय",
    overdue: "अतिदेय",
    upcoming: "आगामी",
    completed: "पूर्ण",
    markComplete: "पूर्ण के रूप में चिह्नित करें",
    delete: "हटाएं",
    watering: "पानी देना",
    fertilizing: "खाद",
    pest_check: "कीट जांच",
    sunlight: "धूप जांच",
    treatment: "उपचार",
    every: "हर",
    days: "दिन",
    dueIn: "में देय",
    overdueBy: "अतिदेय",
    lastCompleted: "अंतिम बार पूर्ण",
    notes: "नोट्स (वैकल्पिक)",
    save: "रिमाइंडर सहेजें",
    todaysTasks: "आज के कार्य",
    upcomingTasks: "आगामी",
    active: "सक्रिय",
    paused: "रुका हुआ",
  },
};

export const PlantCareReminders = ({ userId, language }: PlantCareRemindersProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    plant_name: "",
    reminder_type: "watering",
    frequency_days: 7,
    notes: "",
  });

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (userId) {
      fetchReminders();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('plant_care_reminders')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'plant_care_reminders', filter: `user_id=eq.${userId}` },
          () => {
            fetchReminders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  const fetchReminders = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("plant_care_reminders")
        .select("*")
        .eq("user_id", userId)
        .order("next_due_at", { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async () => {
    if (!userId || !newReminder.plant_name.trim()) {
      toast.error("Please enter a plant name");
      return;
    }

    try {
      const { error } = await supabase
        .from("plant_care_reminders")
        .insert({
          user_id: userId,
          plant_name: newReminder.plant_name,
          reminder_type: newReminder.reminder_type,
          frequency_days: newReminder.frequency_days,
          next_due_at: addDays(new Date(), newReminder.frequency_days).toISOString(),
          notes: newReminder.notes || null,
        });

      if (error) throw error;
      
      toast.success("Reminder added!");
      setDialogOpen(false);
      setNewReminder({ plant_name: "", reminder_type: "watering", frequency_days: 7, notes: "" });
      fetchReminders();
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast.error("Failed to add reminder");
    }
  };

  const completeReminder = async (reminder: Reminder) => {
    try {
      const nextDue = addDays(new Date(), reminder.frequency_days);
      
      const { error } = await supabase
        .from("plant_care_reminders")
        .update({
          last_completed_at: new Date().toISOString(),
          next_due_at: nextDue.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", reminder.id);

      if (error) throw error;
      
      toast.success(`${t.completed}! Next due: ${format(nextDue, "MMM d")}`);
      fetchReminders();
    } catch (error) {
      console.error("Error completing reminder:", error);
      toast.error("Failed to update reminder");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("plant_care_reminders")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      fetchReminders();
    } catch (error) {
      console.error("Error toggling reminder:", error);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from("plant_care_reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Reminder deleted");
      fetchReminders();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete");
    }
  };

  const getTypeInfo = (type: string) => {
    return reminderTypes.find(rt => rt.value === type) || reminderTypes[0];
  };

  const overdueReminders = reminders.filter(r => r.is_active && isPast(new Date(r.next_due_at)));
  const upcomingReminders = reminders.filter(r => r.is_active && !isPast(new Date(r.next_due_at)));

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
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {t.addReminder}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addReminder}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.plantName}</Label>
                  <Input
                    value={newReminder.plant_name}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, plant_name: e.target.value }))}
                    placeholder="e.g., Neem Tree"
                  />
                </div>
                
                <div>
                  <Label>{t.reminderType}</Label>
                  <Select
                    value={newReminder.reminder_type}
                    onValueChange={(value) => setNewReminder(prev => ({ ...prev, reminder_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className={`h-4 w-4 ${type.color}`} />
                            {t[type.value as keyof typeof t]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t.frequency}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    value={newReminder.frequency_days}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, frequency_days: parseInt(e.target.value) || 7 }))}
                  />
                </div>
                
                <div>
                  <Label>{t.notes}</Label>
                  <Input
                    value={newReminder.notes}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special instructions..."
                  />
                </div>
                
                <Button onClick={addReminder} className="w-full">
                  {t.save}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">{t.noReminders}</p>
            <p className="text-sm">{t.noRemindersDesc}</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {/* Overdue Section */}
              {overdueReminders.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-destructive flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    {t.overdue} ({overdueReminders.length})
                  </h3>
                  <div className="space-y-2">
                    {overdueReminders.map((reminder) => {
                      const typeInfo = getTypeInfo(reminder.reminder_type);
                      return (
                        <Card key={reminder.id} className="border-destructive/50 bg-destructive/5">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-background ${typeInfo.color}`}>
                                  <typeInfo.icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{reminder.plant_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {t[reminder.reminder_type as keyof typeof t]} • {t.overdueBy} {formatDistanceToNow(new Date(reminder.next_due_at))}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="sm" onClick={() => completeReminder(reminder)}>
                                  <Check className="h-4 w-4 mr-1" />
                                  {t.markComplete}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming Section */}
              {upcomingReminders.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    {t.upcomingTasks} ({upcomingReminders.length})
                  </h3>
                  <div className="space-y-2">
                    {upcomingReminders.map((reminder) => {
                      const typeInfo = getTypeInfo(reminder.reminder_type);
                      return (
                        <Card key={reminder.id} className="border-muted">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-muted ${typeInfo.color}`}>
                                  <typeInfo.icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{reminder.plant_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {t[reminder.reminder_type as keyof typeof t]} • {t.dueIn} {formatDistanceToNow(new Date(reminder.next_due_at))}
                                  </p>
                                  {reminder.notes && (
                                    <p className="text-xs text-muted-foreground italic mt-1">{reminder.notes}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {t.every} {reminder.frequency_days} {t.days}
                                </Badge>
                                <Switch
                                  checked={reminder.is_active}
                                  onCheckedChange={() => toggleActive(reminder.id, reminder.is_active)}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => completeReminder(reminder)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                  onClick={() => deleteReminder(reminder.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
