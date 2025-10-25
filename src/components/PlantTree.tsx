import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sprout, TreeDeciduous, TreePine } from "lucide-react";
import { toast } from "sonner";
import { UserProgress } from "@/hooks/useLocalStorage";

interface PlantTreeProps {
  language: string;
  onTreePlanted: (progress: Partial<UserProgress>) => void;
  t: any;
}

export const PlantTree = ({ language, onTreePlanted, t }: PlantTreeProps) => {
  const [treeStage, setTreeStage] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);

  const stages = [
    { icon: Sprout, label: "Seed", size: "h-12 w-12" },
    { icon: Sprout, label: "Sprout", size: "h-16 w-16" },
    { icon: TreeDeciduous, label: "Sapling", size: "h-24 w-24" },
    { icon: TreePine, label: "Tree", size: "h-32 w-32" }
  ];

  const plantTree = () => {
    if (isGrowing) return;
    
    setIsGrowing(true);
    setTreeStage(0);
    
    const growthInterval = setInterval(() => {
      setTreeStage(prev => {
        if (prev >= 3) {
          clearInterval(growthInterval);
          setIsGrowing(false);
          
          // Calculate impact
          const impact = {
            treesPlanted: 1,
            co2Reduced: 25, // kg per tree per year
            oxygenGenerated: 260, // liters per day
            wildlifeSheltered: 5 // birds per tree
          };
          
          onTreePlanted(impact);
          toast.success(t.plantTree + " 🌳");
          
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const CurrentStageIcon = stages[treeStage]?.icon || Sprout;

  return (
    <Card className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-6 text-primary">{t.plantTree}</h2>
      
      <div className="min-h-[300px] flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--sky))] to-[hsl(var(--background))] rounded-lg opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(var(--earth))] to-transparent rounded-b-lg" />
        
        <CurrentStageIcon 
          className={`${stages[treeStage]?.size} text-primary animate-grow relative z-10 transition-all duration-500`}
          strokeWidth={1.5}
        />
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {stages.map((stage, idx) => (
          <div
            key={idx}
            className={`h-2 w-12 rounded-full transition-all ${
              idx <= treeStage ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <p className="text-lg mb-4 text-muted-foreground">
        Stage: {stages[treeStage]?.label}
      </p>

      <Button 
        onClick={plantTree} 
        disabled={isGrowing}
        size="lg"
        className="text-lg px-8"
      >
        <Sprout className="mr-2 h-5 w-5" />
        {t.plantNow}
      </Button>
    </Card>
  );
};
