import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { treeData, TreeInfo } from "@/lib/treeData";
import { Language } from "@/lib/translations";
import { Volume2, TreeDeciduous } from "lucide-react";
import { toast } from "sonner";
import neemImg from "@/assets/trees/neem.jpg";
import banyanImg from "@/assets/trees/banyan.jpg";
import mangoImg from "@/assets/trees/mango.jpg";
import coconutImg from "@/assets/trees/coconut.jpg";
import peepalImg from "@/assets/trees/peepal.jpg";
import tulsiImg from "@/assets/trees/tulsi.jpg";

interface TreeLibraryProps {
  language: Language;
  t: any;
}

const treeImages: Record<string, string> = {
  neem: neemImg,
  banyan: banyanImg,
  mango: mangoImg,
  coconut: coconutImg,
  peepal: peepalImg,
  tulsi: tulsiImg
};

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
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary mb-2">{t.treeLibrary}</h2>
        <p className="text-muted-foreground">Explore the diverse collection of trees and their benefits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treeData.map((tree, idx) => {
          const name = language === 'en' ? tree.nameEn : language === 'te' ? tree.nameTe : tree.nameHi;
          const benefits = language === 'en' ? tree.benefits : language === 'te' ? tree.benefitsTe : tree.benefitsHi;
          
          return (
            <Card 
              key={tree.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Tree Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-green-900">
                <img 
                  src={treeImages[tree.id]} 
                  alt={name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full p-2">
                  <TreeDeciduous className="h-5 w-5" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-primary">{name}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => speakTreeInfo(tree)}
                    className="h-9 w-9 p-0 hover:bg-primary/10"
                  >
                    <Volume2 className="h-5 w-5 text-primary" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <span className="text-lg">🌿</span> Benefits:
                    </p>
                    <ul className="space-y-1.5">
                      {benefits.slice(0, 4).map((benefit, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Growth Period</p>
                      <p className="text-sm font-medium text-foreground">{tree.growthTime}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Soil Type</p>
                      <p className="text-sm font-medium text-foreground">{tree.soilType}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-lg">
                        <span className="text-xs font-semibold text-secondary">CO₂ Absorbed</span>
                        <span className="text-sm font-bold text-foreground">{tree.co2Absorption}kg/yr</span>
                      </div>
                      <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
                        <span className="text-xs font-semibold text-accent">O₂ Produced</span>
                        <span className="text-sm font-bold text-foreground">{tree.oxygenProduction}L/day</span>
                      </div>
                    </div>
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
