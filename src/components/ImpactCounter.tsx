import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreeDeciduous, Cloud, Wind, Bird } from "lucide-react";
import { UserProgress } from "@/hooks/useLocalStorage";

interface ImpactCounterProps {
  progress: UserProgress;
  t: any;
}

export const ImpactCounter = ({ progress, t }: ImpactCounterProps) => {
  const stats = [
    {
      icon: TreeDeciduous,
      label: t.treesPlanted,
      value: progress.treesPlanted,
      unit: "",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Cloud,
      label: t.co2Reduced,
      value: progress.co2Reduced,
      unit: "kg",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Wind,
      label: t.oxygenGenerated,
      value: progress.oxygenGenerated,
      unit: "L/day",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Bird,
      label: t.wildlifeSheltered,
      value: progress.wildlifeSheltered,
      unit: "birds",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const maxTrees = 100;
  const progressPercent = Math.min((progress.treesPlanted / maxTrees) * 100, 100);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">{t.impactCounter}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={`${stat.bgColor} p-4 rounded-lg text-center animate-slide-up`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value.toLocaleString()} {stat.unit}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.myProgress}</span>
            <span className="font-semibold text-primary">
              {progress.treesPlanted} / {maxTrees} trees
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>
      </Card>

      {progress.badges.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-primary">🏆 Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {progress.badges.map((badge, idx) => (
              <div
                key={idx}
                className="bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold animate-pulse-soft"
              >
                🌟 {badge}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
