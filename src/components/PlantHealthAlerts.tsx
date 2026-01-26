import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlantHealthMonitor } from "@/hooks/usePlantHealthMonitor";
import { Bell, AlertTriangle, AlertCircle, X, RefreshCw, Leaf, Activity, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlantHealthAlertsProps {
  userId: string;
}

export const PlantHealthAlerts = ({ userId }: PlantHealthAlertsProps) => {
  const { 
    alerts, 
    loading, 
    dismissAlert, 
    markAsRead, 
    refreshAlerts,
    criticalCount,
    warningCount 
  } = usePlantHealthMonitor(userId);

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === "critical") {
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
    switch (type) {
      case "low_score":
        return <Activity className="h-5 w-5 text-orange-500" />;
      case "severe_issues":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "recurring_disease":
        return <RefreshCw className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  const getAlertBgColor = (severity: string, isRead: boolean) => {
    if (isRead) return "bg-muted/30";
    if (severity === "critical") return "bg-destructive/10 border-destructive/30";
    return "bg-amber-500/10 border-amber-500/30";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Health Alerts
              {(criticalCount > 0 || warningCount > 0) && (
                <div className="flex gap-1">
                  {criticalCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {criticalCount} Critical
                    </Badge>
                  )}
                  {warningCount > 0 && (
                    <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-700">
                      {warningCount} Warning
                    </Badge>
                  )}
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Automated notifications for plant health issues
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={refreshAlerts} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
            <p className="font-medium text-green-600">All Plants Healthy!</p>
            <p className="text-sm">No health alerts at this time.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    getAlertBgColor(alert.severity, alert.isRead)
                  )}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "font-medium text-sm",
                            !alert.isRead && "font-semibold"
                          )}>
                            {alert.title}
                          </h4>
                          {!alert.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                        {alert.plantName && (
                          <div className="flex items-center gap-1 mt-2">
                            <Leaf className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-muted-foreground">
                              {alert.plantName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Alert Settings Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h5 className="text-sm font-medium mb-2">Alert Thresholds</h5>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span>Health Score &lt; 50%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span>2+ Severe Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span>3+ Unresolved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Recurring Disease</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
