import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TreeInfo } from "@/lib/treeData";
import { expandedTreeData } from "@/lib/expandedTreeData";
import { Volume2, TreeDeciduous, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TreeLibraryExpandedProps {
  language: string;
  t: any;
}

export const TreeLibraryExpanded = ({ language, t }: TreeLibraryExpandedProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [soilFilter, setSoilFilter] = useState("all");
  const [growthFilter, setGrowthFilter] = useState("all");

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

  // Filter trees based on search and filters
  const filteredTrees = expandedTreeData.filter(tree => {
    const name = language === 'en' ? tree.nameEn : language === 'te' ? tree.nameTe : tree.nameHi;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSoil = soilFilter === "all" || tree.soilType.toLowerCase().includes(soilFilter.toLowerCase());
    const matchesGrowth = growthFilter === "all" || tree.growthTime.includes(growthFilter);
    
    return matchesSearch && matchesSoil && matchesGrowth;
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary mb-2">{t.treeLibrary}</h2>
        <p className="text-muted-foreground">Explore {expandedTreeData.length} diverse trees and plants</p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search trees by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={soilFilter} onValueChange={setSoilFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Soil Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Soils</SelectItem>
                <SelectItem value="dry">Dry Soil</SelectItem>
                <SelectItem value="sandy">Sandy Soil</SelectItem>
                <SelectItem value="loamy">Loamy Soil</SelectItem>
                <SelectItem value="fertile">Fertile Soil</SelectItem>
              </SelectContent>
            </Select>

            <Select value={growthFilter} onValueChange={setGrowthFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Growth Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="3">Fast (3 years)</SelectItem>
                <SelectItem value="4">Medium (4-5 years)</SelectItem>
                <SelectItem value="6">Slow (6+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredTrees.length} of {expandedTreeData.length} trees</span>
          {(searchQuery || soilFilter !== "all" || growthFilter !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery("");
                setSoilFilter("all");
                setGrowthFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>
      
      {/* Trees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrees.map((tree, idx) => {
          const name = language === 'en' ? tree.nameEn : language === 'te' ? tree.nameTe : tree.nameHi;
          const benefits = language === 'en' ? tree.benefits : language === 'te' ? tree.benefitsTe : tree.benefitsHi;
          
          return (
            <Card 
              key={tree.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${(idx % 12) * 50}ms` }}
            >
              {/* Tree Image */}
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-green-900">
                <img 
                  src={tree.image} 
                  alt={name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full p-2">
                  <TreeDeciduous className="h-4 w-4" />
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-primary line-clamp-1">{name}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => speakTreeInfo(tree)}
                    className="h-8 w-8 p-0 hover:bg-primary/10 shrink-0"
                  >
                    <Volume2 className="h-4 w-4 text-primary" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-xs text-primary mb-1 flex items-center gap-1">
                      <span>🌿</span> Benefits:
                    </p>
                    <ul className="space-y-1">
                      {benefits.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1">
                          <span className="text-secondary mt-0.5">•</span>
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-0.5">Growth</p>
                      <p className="text-xs font-medium text-foreground">{tree.growthTime}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-0.5">Soil</p>
                      <p className="text-xs font-medium text-foreground line-clamp-1">{tree.soilType}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                        <span className="font-semibold text-secondary">CO₂</span>
                        <span className="font-bold text-foreground">{tree.co2Absorption}kg/yr</span>
                      </div>
                      <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded">
                        <span className="font-semibold text-accent">O₂</span>
                        <span className="font-bold text-foreground">{tree.oxygenProduction}L/d</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTrees.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No trees found matching your filters</p>
          <Button 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSoilFilter("all");
              setGrowthFilter("all");
            }}
          >
            Clear All Filters
          </Button>
        </Card>
      )}
    </div>
  );
};
