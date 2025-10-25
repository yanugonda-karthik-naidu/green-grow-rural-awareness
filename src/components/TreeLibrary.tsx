import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { treeData, TreeInfo } from "@/lib/treeData";
import { Language } from "@/lib/translations";
import { Volume2 } from "lucide-react";
import { toast } from "sonner";

interface TreeLibraryProps {
  language: Language;
  t: any;
}

export const TreeLibrary = ({ language, t }: TreeLibraryProps) => {
  const speakTreeInfo = (tree: TreeInfo) => {
    if ('speechSynthesis' in window) {
      const name = language === 'en' ? tree.nameEn : language === 'te' ? tree.nameTe : tree.nameHi;
      const benefits = language === 'en' ? tree.benefits : language === 'te' ? tree.benefitsTe : tree.benefitsHi;
      
      const text = `${name}. Benefits: ${benefits.join(', ')}. Growth time: ${tree.growthTime}. ${tree.maintenance}`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : language === 'te' ? 'te-IN' : 'hi-IN';
      utterance.rate = 0.9;
      
      window.speechSynthesis.speak(utterance);
      toast.success("🔊 Playing tree information");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">{t.treeLibrary}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treeData.map((tree, idx) => {
          const name = language === 'en' ? tree.nameEn : language === 'te' ? tree.nameTe : tree.nameHi;
          const benefits = language === 'en' ? tree.benefits : language === 'te' ? tree.benefitsTe : tree.benefitsHi;
          
          return (
            <Card 
              key={tree.id} 
              className="p-6 hover:shadow-lg transition-all animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary">{name}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => speakTreeInfo(tree)}
                  className="h-8 w-8 p-0"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-muted-foreground mb-1">Benefits:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="text-foreground">{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-muted-foreground">Growth: <span className="font-normal text-foreground">{tree.growthTime}</span></p>
                </div>

                <div>
                  <p className="font-semibold text-muted-foreground">Soil: <span className="font-normal text-foreground">{tree.soilType}</span></p>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">CO₂: {tree.co2Absorption}kg/yr</span>
                    <span className="text-accent">O₂: {tree.oxygenProduction}L/day</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
