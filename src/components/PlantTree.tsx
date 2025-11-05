import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sprout, Upload, Image as ImageIcon, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useOfflineDraft } from "@/hooks/useOfflineDraft";

interface PlantTreeProps {
  language: string;
  onTreePlanted: (progress: any) => void;
  addPlantedTree: (treeName: string) => Promise<void>;
  t: any;
}

export const PlantTree = ({ language, onTreePlanted, addPlantedTree, t }: PlantTreeProps) => {
  const [treeStage, setTreeStage] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);
  
  // Form state
  const [plantName, setPlantName] = useState("");
  const [species, setSpecies] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, progress: uploadProgress } = useImageUpload();
  const { saveDraft, clearDraft, loadDraft, hasDraft } = useOfflineDraft();
  
  const [user, setUser] = useState<any>(null);

  // Get current user
  useState(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  });

  const stages = [
    { label: t.stageSeed, desc: t.stageSeedDesc, progress: 0 },
    { label: t.stageGermination, desc: t.stageGerminationDesc, progress: 20 },
    { label: t.stageSprout, desc: t.stageSproutDesc, progress: 40 },
    { label: t.stageSeedling, desc: t.stageSeedlingDesc, progress: 60 },
    { label: t.stageYoungTree, desc: t.stageYoungTreeDesc, progress: 80 },
    { label: t.stageMatureTree, desc: t.stageMatureTreeDesc, progress: 100 }
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size should be less than 10MB");
        return;
      }
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setPlantName(draft.name);
      setSpecies(draft.species || "");
      setDescription(draft.description || "");
      setLocation(draft.location || "");
      setIsPublic(draft.isPublic);
      if (draft.imageData) {
        setImagePreview(draft.imageData);
      }
      toast.success("Draft loaded!");
    }
  };

  const plantTree = async () => {
    if (isGrowing || !user) return;
    
    if (!plantName || !selectedImage) {
      toast.error("Please provide a plant name and image!");
      return;
    }
    
    setIsGrowing(true);
    setTreeStage(0);
    
    let growthInterval: NodeJS.Timeout | null = null;
    
    try {
      // Save draft for offline support
      saveDraft({
        name: plantName,
        species,
        description,
        location,
        isPublic,
        imageData: imagePreview || undefined,
        timestamp: Date.now(),
      });
      
      // Start germination animation
      growthInterval = setInterval(() => {
        setTreeStage(prev => {
          if (prev >= 5) {
            clearInterval(growthInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      
      // Upload image
      const imagePath = await uploadImage(selectedImage, user.id);
      
      if (!imagePath) {
        throw new Error("Failed to upload image");
      }
      
      // Insert plant record
      const { data: plantData, error: plantError } = await supabase
        .from('planted_trees')
        .insert({
          user_id: user.id,
          tree_name: plantName,
          species: species || plantName,
          description,
          location,
          image_path: imagePath,
          is_public: isPublic,
          growth_stage: 0,
          impact_co2_kg: 25,
          impact_o2_l_per_day: 260,
          area_m2: 2,
          planted_date: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (plantError || !plantData) {
        throw new Error(plantError?.message || "Failed to save plant");
      }
      
      // Call automation edge function
      const { data: automationData, error: automationError } = await supabase.functions.invoke(
        'plant-automation',
        {
          body: { plantId: plantData.id, userId: user.id },
        }
      );
      
      if (automationError) {
        console.error('Automation error:', automationError);
      } else {
        console.log('Automation response:', automationData);
        
        // Show achievement notifications
        if (automationData?.achievements && automationData.achievements.length > 0) {
          automationData.achievements.forEach((achievement: string) => {
            toast.success(achievement, { duration: 5000 });
          });
        }
        
        toast.success(`🌳 ${t.plantTree} successful! +${automationData?.seedsAwarded || 5} ${t.seeds}`, {
          duration: 5000,
        });
      }
      
      // Update parent component
      const impact = {
        treesPlanted: 1,
        co2Reduced: 25,
        oxygenGenerated: 260,
        wildlifeSheltered: 5
      };
      
      onTreePlanted(impact);
      await addPlantedTree(plantName);
      
      // Clear draft and form
      clearDraft();
      setPlantName("");
      setSpecies("");
      setDescription("");
      setLocation("");
      setSelectedImage(null);
      setImagePreview(null);
      
      // Stop animation after completion
      setTimeout(() => {
        setIsGrowing(false);
      }, 12000); // 6 stages * 2 seconds
      
    } catch (error: any) {
      console.error('Error planting tree:', error);
      toast.error(error.message || "Failed to plant tree. Please try again.");
      setIsGrowing(false);
      if (growthInterval) clearInterval(growthInterval);
    }
  };

  return (
    <Card className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">{t.plantTree}</h2>
      
      {/* Upload Form */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="plantName">{t.plantTree} Name *</Label>
            <Input
              id="plantName"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., Neem Tree"
              disabled={isGrowing}
            />
          </div>
          
          <div>
            <Label htmlFor="species">Species</Label>
            <Select value={species} onValueChange={setSpecies} disabled={isGrowing}>
              <SelectTrigger>
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neem">Neem</SelectItem>
                <SelectItem value="peepal">Peepal</SelectItem>
                <SelectItem value="banyan">Banyan</SelectItem>
                <SelectItem value="mango">Mango</SelectItem>
                <SelectItem value="coconut">Coconut</SelectItem>
                <SelectItem value="tulsi">Tulsi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your story about this tree..."
              rows={3}
              disabled={isGrowing}
            />
          </div>
          
          <div>
            <Label htmlFor="location">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location (optional)
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Community Park, City"
              disabled={isGrowing}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isGrowing}
            />
            <Label htmlFor="public">Share on Community Wall</Label>
          </div>
          
          {hasDraft && !isGrowing && (
            <Button onClick={handleLoadDraft} variant="outline" className="w-full">
              Load Saved Draft
            </Button>
          )}
        </div>
        
        {/* Image Upload */}
        <div className="space-y-4">
          <Label>Plant Image *</Label>
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => !isGrowing && fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="space-y-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-muted-foreground">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Click to upload plant image</p>
                <p className="text-xs text-muted-foreground">Max size: 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          {uploading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
              <Progress value={uploadProgress} />
            </div>
          )}
        </div>
      </div>
      
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
          disabled={isGrowing || !plantName || !selectedImage || uploading}
          size="lg"
          className="text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all"
        >
          <Sprout className="mr-2 h-6 w-6" />
          {isGrowing ? t.growing : uploading ? `Uploading... ${uploadProgress}%` : t.plantNow}
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
