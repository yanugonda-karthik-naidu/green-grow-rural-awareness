import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Leaf, Droplets, Wind, Sun, Calendar, Zap, TreeDeciduous, Sparkles, Pencil, Trash2, ZoomIn } from "lucide-react";
import { PlantedTree, Achievement } from "@/hooks/useUserProgress";
import { treeData } from "@/lib/treeData";
import { expandedTreeData } from "@/lib/expandedTreeData";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TreeImageLightbox } from "./TreeImageLightbox";
import { TreeEditDialog } from "./TreeEditDialog";
import { TreeDeleteDialog } from "./TreeDeleteDialog";

interface ImpactCounterProps {
  plantedTrees: PlantedTree[];
  achievements: Achievement[];
  t: any;
  onRefresh?: () => void;
}

export const ImpactCounter = ({ plantedTrees, achievements, t, onRefresh }: ImpactCounterProps) => {
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);
  const [editingTree, setEditingTree] = useState<PlantedTree | null>(null);
  const [deletingTree, setDeletingTree] = useState<PlantedTree | null>(null);
  // Calculate total impact metrics from planted trees
  const totalCO2Reduced = plantedTrees.reduce((sum, tree) => sum + (tree.impact_co2_kg || 25), 0);
  const totalO2Generated = plantedTrees.reduce((sum, tree) => sum + (tree.impact_o2_l_per_day || 260), 0);
  const totalAreaExpanded = plantedTrees.reduce((sum, tree) => sum + (tree.area_m2 || 2), 0);
  
  // Calculate water saved (estimated 50L per tree per year)
  const totalWaterSaved = plantedTrees.length * 50;
  
  // Calculate energy saved (estimated 10 kWh per tree per year through cooling/shade)
  const totalEnergySaved = plantedTrees.length * 10;
  
  // Calculate biodiversity impact
  const wildlifeSheltered = Math.floor(plantedTrees.length * 1.5); // Estimate 1.5 animals per tree

  // Advanced timeline data - calculate cumulative impact over time
  const timelineData = plantedTrees.length > 0 ? (() => {
    const sortedTrees = [...plantedTrees].sort((a, b) => 
      new Date(a.planted_date).getTime() - new Date(b.planted_date).getTime()
    );
    
    let cumulativeTrees = 0;
    let cumulativeCO2 = 0;
    let cumulativeO2 = 0;
    let cumulativeWater = 0;
    
    return sortedTrees.map((tree, idx) => {
      cumulativeTrees += 1;
      cumulativeCO2 += tree.impact_co2_kg || 25;
      cumulativeO2 += tree.impact_o2_l_per_day || 260;
      cumulativeWater += 50;
      
      return {
        date: format(new Date(tree.planted_date), "MMM d"),
        trees: cumulativeTrees,
        co2: Math.round(cumulativeCO2),
        o2: Math.round(cumulativeO2),
        water: Math.round(cumulativeWater),
      };
    }).filter((_, idx, arr) => {
      // Show max 12 data points for readability
      const step = Math.max(1, Math.floor(arr.length / 12));
      return idx % step === 0 || idx === arr.length - 1;
    });
  })() : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-3 p-8 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl border-2 border-emerald-500/20">
        <div className="inline-block p-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full mb-2">
          <TreeDeciduous className="h-12 w-12 text-emerald-600 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
          🌍 {t.impactCounter}
        </h2>
        <p className="text-muted-foreground text-lg">{t.impactGlance}</p>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.treesPlanted}
            </CardTitle>
            <TreeDeciduous className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {plantedTrees.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Growing strong together
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.co2Reduced}
            </CardTitle>
            <Leaf className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {totalCO2Reduced.toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Equivalent to driving {(totalCO2Reduced / 0.404).toFixed(0)} km less
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.oxygenGenerated}
            </CardTitle>
            <Wind className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {totalO2Generated.toFixed(0)} L/day
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Supports {Math.floor(totalO2Generated / 550)} people daily
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Water Saved
            </CardTitle>
            <Droplets className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {totalWaterSaved.toFixed(0)} L
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Annual water conservation
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Energy Saved
            </CardTitle>
            <Zap className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {totalEnergySaved.toFixed(0)} kWh
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Annual energy savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-cyan-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.greenAreaExpanded}
            </CardTitle>
            <Sun className="h-5 w-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600">
              {totalAreaExpanded.toFixed(1)} m²
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Green space created
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wildlife Sheltered
            </CardTitle>
            <TreeDeciduous className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {wildlifeSheltered}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Animals supported
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Impact Timeline Chart */}
      {timelineData.length > 0 && (
        <Card className="border-2 border-teal-500/20">
          <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-teal-600">
              <Sparkles className="h-5 w-5" />
              Your Impact Over Time
            </CardTitle>
            <p className="text-xs text-muted-foreground">Cumulative environmental progress</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timelineData}>
                <defs>
                  <linearGradient id="treesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '2px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="trees" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ fill: '#10b981', r: 6, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                  name="Trees 🌳"
                  fill="url(#treesGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="co2" 
                  stroke="#0ea5e9" 
                  strokeWidth={4} 
                  dot={{ fill: '#0ea5e9', r: 6, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                  name="CO₂ (kg) 🍃"
                  fill="url(#co2Gradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="water" 
                  stroke="#a855f7" 
                  strokeWidth={4} 
                  dot={{ fill: '#a855f7', r: 6, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                  name="Water (L) 💧"
                  fill="url(#waterGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="text-muted-foreground">Trees Planted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0ea5e9]" />
                <span className="text-muted-foreground">CO₂ Reduced (kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#a855f7]" />
                <span className="text-muted-foreground">Water Saved (L)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Your Impact Journey */}
      {achievements.length > 0 && (
        <Card className="border-2 border-purple-500/30">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              Your Impact Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {achievements.map((achievement, idx) => (
                  <div key={achievement.id} className="flex gap-4 items-start animate-fade-in">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {idx < achievements.length - 1 && (
                        <div className="w-0.5 h-16 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(achievement.created_at), "MMM d, yyyy")}
                      </p>
                      <p className="font-medium">{achievement.achievement_text}</p>
                      <Badge variant="secondary" className="mt-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        +{achievement.seeds_earned} Seeds
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Planted Trees Gallery */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            Your Forest ({plantedTrees.length} {t.treesPlanted})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plantedTrees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.noTreesYet}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantedTrees.map((tree) => {
                // Try to find tree info from both treeData and expandedTreeData
                const treeInfo = treeData.find((t) => t.id === tree.tree_name) || 
                                expandedTreeData.find((t) => t.id === tree.tree_name) ||
                                expandedTreeData.find((t) => t.nameEn.toLowerCase() === tree.tree_name.toLowerCase());
                
                // Get tree image with proper fallback
                const getTreeImage = () => {
                  // First try user uploaded image (image_path is already a full URL)
                  if (tree.image_path) {
                    return tree.image_path;
                  }
                  // Then try tree info image
                  if (treeInfo?.image) {
                    return treeInfo.image;
                  }
                  // Default fallback
                  return "/placeholder.svg";
                };

                const imageUrl = getTreeImage();

                return (
                  <Card
                    key={tree.id}
                    className="overflow-hidden border-2 border-muted hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                  >
                    <div 
                      className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 cursor-pointer"
                      onClick={() => setLightboxImage({ url: imageUrl, name: tree.tree_name })}
                    >
                      <img
                        src={imageUrl}
                        alt={tree.tree_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (treeInfo?.image && target.src !== treeInfo.image) {
                            target.src = treeInfo.image;
                          } else {
                            target.src = "/placeholder.svg";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Zoom indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 rounded-full p-2">
                          <ZoomIn className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-lg">
                          {tree.tree_name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {format(new Date(tree.planted_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    
                    {tree.description && (
                      <div className="p-3 border-t border-border">
                        <p className="text-sm text-muted-foreground line-clamp-2">{tree.description}</p>
                      </div>
                    )}
                    
                    <div className="p-3 border-t border-border flex items-center justify-between">
                      {tree.location ? (
                        <Badge variant="secondary" className="text-xs">
                          📍 {tree.location}
                        </Badge>
                      ) : (
                        <span />
                      )}
                      
                      {/* Edit/Delete buttons */}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTree(tree);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingTree(tree);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      <TreeImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage?.url || ""}
        treeName={lightboxImage?.name || ""}
      />

      {/* Edit Dialog */}
      <TreeEditDialog
        isOpen={!!editingTree}
        onClose={() => setEditingTree(null)}
        tree={editingTree}
        onUpdate={() => onRefresh?.()}
      />

      {/* Delete Dialog */}
      <TreeDeleteDialog
        isOpen={!!deletingTree}
        onClose={() => setDeletingTree(null)}
        tree={deletingTree}
        onDelete={() => onRefresh?.()}
      />
    </div>
  );
};
