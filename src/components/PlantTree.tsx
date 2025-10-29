import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sprout } from "lucide-react";
import { toast } from "sonner";

interface PlantTreeProps {
  language: string;
  onTreePlanted: (progress: any) => void;
  addPlantedTree: (treeName: string) => Promise<void>;
  t: any;
}

export const PlantTree = ({ language, onTreePlanted, addPlantedTree, t }: PlantTreeProps) => {
  const [treeStage, setTreeStage] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);

  const stages = [
    { label: t.stageSeed, desc: t.stageSeedDesc, progress: 0 },
    { label: t.stageGermination, desc: t.stageGerminationDesc, progress: 20 },
    { label: t.stageSprout, desc: t.stageSproutDesc, progress: 40 },
    { label: t.stageSeedling, desc: t.stageSeedlingDesc, progress: 60 },
    { label: t.stageYoungTree, desc: t.stageYoungTreeDesc, progress: 80 },
    { label: t.stageMatureTree, desc: t.stageMatureTreeDesc, progress: 100 }
  ];

  const plantTree = () => {
    if (isGrowing) return;
    
    setIsGrowing(true);
    setTreeStage(0);
    
    const growthInterval = setInterval(() => {
      setTreeStage(prev => {
        if (prev >= 5) {
          clearInterval(growthInterval);
          setIsGrowing(false);
          
          const impact = {
            treesPlanted: 1,
            co2Reduced: 25,
            oxygenGenerated: 260,
            wildlifeSheltered: 5
          };
          
          onTreePlanted(impact);
          addPlantedTree("Tree");
          toast.success(t.plantTree + " 🌳 " + t.successfullyGrown);
          
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <Card className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">{t.plantTree}</h2>
      
      <div className="min-h-[400px] flex flex-col items-center justify-center mb-8 relative bg-gradient-to-b from-sky-100 to-green-50 dark:from-sky-950/30 dark:to-green-950/30 rounded-xl p-8">
        {/* Realistic tree growth visualization */}
        <div className="relative w-full max-w-md h-80 flex items-end justify-center overflow-hidden">
          {/* Soil base */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-900 to-amber-700 dark:from-amber-950 dark:to-amber-900 rounded-b-xl" />
          
          {/* Growth stages visualization */}
          <div 
            className="relative z-10 transition-all duration-1000 ease-out transform"
            style={{
              transform: `scale(${0.3 + (treeStage * 0.15)})`,
              opacity: treeStage === 0 ? 0.3 : 1
            }}
          >
            {treeStage === 0 && (
              <div className="w-4 h-4 bg-amber-800 rounded-full animate-pulse" />
            )}
            {treeStage === 1 && (
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-green-700 rounded-t" />
                <div className="w-4 h-4 bg-amber-800 rounded-full" />
              </div>
            )}
            {treeStage === 2 && (
              <div className="flex flex-col items-center">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                </div>
                <div className="w-2 h-12 bg-green-700 rounded" />
              </div>
            )}
            {treeStage === 3 && (
              <div className="flex flex-col items-center">
                <div className="flex gap-2 mb-1">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                  </div>
                </div>
                <div className="w-3 h-20 bg-amber-800 rounded" />
              </div>
            )}
            {treeStage === 4 && (
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-600 rounded-full opacity-80" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-500 rounded-full opacity-90" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-amber-800 rounded" />
                </div>
              </div>
            )}
            {treeStage === 5 && (
              <div className="flex flex-col items-center animate-bounce-slow">
                <div className="relative w-48 h-48">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-600 rounded-full opacity-80" />
                  <div className="absolute top-2 left-1/4 w-32 h-32 bg-green-500 rounded-full opacity-90" />
                  <div className="absolute top-2 right-1/4 w-32 h-32 bg-green-500 rounded-full opacity-90" />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-28 bg-green-400 rounded-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-24 bg-amber-800 rounded shadow-lg" />
                  {/* Fruits */}
                  <div className="absolute top-12 left-20 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div className="absolute top-16 right-20 w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute top-20 left-24 w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stage information */}
        <div className="mt-8 text-center w-full max-w-md">
          <p className="text-2xl font-bold text-primary mb-2">
            {stages[treeStage]?.label}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {stages[treeStage]?.desc}
          </p>
          
          {/* Progress bar */}
          <Progress value={stages[treeStage]?.progress} className="h-3 mb-4" />
          
          {/* Stage indicators */}
          <div className="flex justify-center gap-2">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className={`h-3 w-12 rounded-full transition-all ${
                  idx <= treeStage ? 'bg-primary scale-110' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={plantTree} 
          disabled={isGrowing}
          size="lg"
          className="text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all"
        >
          <Sprout className="mr-2 h-6 w-6" />
          {isGrowing ? t.growing : t.plantNow}
        </Button>
        
        {treeStage === 5 && (
          <p className="mt-4 text-green-600 dark:text-green-400 font-semibold animate-pulse">
            🎉 {t.congratsOxygen} 🌳
          </p>
        )}
      </div>
    </Card>
  );
};
