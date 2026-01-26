import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HealthAlert {
  id: string;
  type: "low_score" | "severe_issues" | "unresolved_buildup" | "recurring_disease";
  severity: "warning" | "critical";
  title: string;
  message: string;
  plantName?: string;
  createdAt: Date;
  isRead: boolean;
}

interface PlantHealthData {
  plantName: string;
  totalIssues: number;
  severeIssues: number;
  unresolvedIssues: number;
  healthScore: number;
}

export const usePlantHealthMonitor = (userId: string) => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const HEALTH_SCORE_THRESHOLD = 50;
  const SEVERE_ISSUES_THRESHOLD = 2;
  const UNRESOLVED_THRESHOLD = 3;

  const calculateHealthScore = (total: number, severe: number, resolved: number): number => {
    let score = 100;
    score -= (total * 5);
    score -= (severe * 10);
    score += (resolved * 3);
    return Math.max(0, Math.min(100, score));
  };

  const checkForAlerts = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: diagnoses, error } = await supabase
        .from("disease_diagnoses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const newAlerts: HealthAlert[] = [];
      const plantData: Record<string, PlantHealthData> = {};

      // Aggregate data by plant
      diagnoses?.forEach((d) => {
        if (!plantData[d.plant_name]) {
          plantData[d.plant_name] = {
            plantName: d.plant_name,
            totalIssues: 0,
            severeIssues: 0,
            unresolvedIssues: 0,
            healthScore: 100,
          };
        }
        plantData[d.plant_name].totalIssues++;
        if (d.severity === "severe") plantData[d.plant_name].severeIssues++;
        if (!d.is_resolved) plantData[d.plant_name].unresolvedIssues++;
      });

      // Calculate health scores and check thresholds
      Object.values(plantData).forEach((plant) => {
        const resolved = plant.totalIssues - plant.unresolvedIssues;
        plant.healthScore = calculateHealthScore(
          plant.totalIssues,
          plant.severeIssues,
          resolved
        );

        // Low health score alert
        if (plant.healthScore < HEALTH_SCORE_THRESHOLD) {
          newAlerts.push({
            id: `low_score_${plant.plantName}`,
            type: "low_score",
            severity: plant.healthScore < 30 ? "critical" : "warning",
            title: `${plant.plantName} Health Critical`,
            message: `Health score dropped to ${plant.healthScore}%. Immediate attention required.`,
            plantName: plant.plantName,
            createdAt: new Date(),
            isRead: false,
          });
        }

        // Multiple severe issues alert
        if (plant.severeIssues >= SEVERE_ISSUES_THRESHOLD) {
          newAlerts.push({
            id: `severe_${plant.plantName}`,
            type: "severe_issues",
            severity: "critical",
            title: `Multiple Severe Issues - ${plant.plantName}`,
            message: `${plant.severeIssues} severe health issues detected. Review treatments immediately.`,
            plantName: plant.plantName,
            createdAt: new Date(),
            isRead: false,
          });
        }

        // Unresolved issues buildup
        if (plant.unresolvedIssues >= UNRESOLVED_THRESHOLD) {
          newAlerts.push({
            id: `unresolved_${plant.plantName}`,
            type: "unresolved_buildup",
            severity: "warning",
            title: `Unresolved Issues - ${plant.plantName}`,
            message: `${plant.unresolvedIssues} unresolved issues need attention.`,
            plantName: plant.plantName,
            createdAt: new Date(),
            isRead: false,
          });
        }
      });

      // Check for recurring diseases
      const diseaseCount: Record<string, number> = {};
      diagnoses?.forEach((d) => {
        if (d.disease_name) {
          const key = `${d.plant_name}_${d.disease_name}`;
          diseaseCount[key] = (diseaseCount[key] || 0) + 1;
        }
      });

      Object.entries(diseaseCount).forEach(([key, count]) => {
        if (count >= 2) {
          const [plantName, diseaseName] = key.split("_");
          newAlerts.push({
            id: `recurring_${key}`,
            type: "recurring_disease",
            severity: "warning",
            title: `Recurring Disease - ${plantName}`,
            message: `${diseaseName} has appeared ${count} times. Consider preventive measures.`,
            plantName,
            createdAt: new Date(),
            isRead: false,
          });
        }
      });

      setAlerts(newAlerts);
    } catch (error) {
      console.error("Error checking health alerts:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    checkForAlerts();

    // Set up realtime subscription
    const channel = supabase
      .channel("health-monitor")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "disease_diagnoses",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          checkForAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, checkForAlerts]);

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    toast.success("Alert dismissed");
  };

  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a))
    );
  };

  return {
    alerts,
    loading,
    dismissAlert,
    markAsRead,
    refreshAlerts: checkForAlerts,
    criticalCount: alerts.filter((a) => a.severity === "critical").length,
    warningCount: alerts.filter((a) => a.severity === "warning").length,
  };
};
