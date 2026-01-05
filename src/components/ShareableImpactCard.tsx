import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Share2, Download, TreePine, Leaf, Droplets, Award, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ShareableImpactCardProps {
  userId: string | undefined;
}

interface ImpactData {
  treesPlanted: number;
  co2Reduced: number;
  o2Generated: number;
  waterSaved: number;
  badges: number;
  displayName: string;
}

export const ShareableImpactCard = ({ userId }: ShareableImpactCardProps) => {
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchImpactData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchImpactData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const [treesRes, progressRes, badgesRes, profileRes] = await Promise.all([
        supabase.from('planted_trees').select('impact_co2_kg, impact_o2_l_per_day').eq('user_id', userId),
        supabase.from('user_progress').select('water_saved').eq('user_id', userId).single(),
        supabase.from('user_badges').select('id').eq('user_id', userId),
        supabase.from('profiles').select('display_name').eq('id', userId).single(),
      ]);

      const trees = treesRes.data || [];
      const treesPlanted = trees.length;
      const co2Reduced = trees.reduce((sum, t) => sum + (Number(t.impact_co2_kg) || 0), 0);
      const o2Generated = trees.reduce((sum, t) => sum + (Number(t.impact_o2_l_per_day) || 0), 0);
      const waterSaved = Number(progressRes.data?.water_saved) || 0;
      const badges = badgesRes.data?.length || 0;
      const displayName = profileRes.data?.display_name || "Eco Warrior";

      setImpactData({
        treesPlanted,
        co2Reduced,
        o2Generated,
        waterSaved,
        badges,
        displayName,
      });
    } catch (error) {
      console.error('Error fetching impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsImage = async () => {
    if (!cardRef.current || !impactData) return;
    
    setDownloading(true);
    
    try {
      // Use html2canvas approach with dynamic import
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `my-environmental-impact-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Impact card downloaded!");
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error("Failed to download image");
    } finally {
      setDownloading(false);
    }
  };

  const shareCard = async () => {
    if (!impactData) return;

    const shareText = `🌳 My Environmental Impact 🌍\n\n🌲 ${impactData.treesPlanted} Trees Planted\n🍃 ${impactData.co2Reduced.toFixed(1)} kg CO₂ Reduced\n💨 ${impactData.o2Generated.toFixed(0)} L/day O₂ Generated\n💧 ${impactData.waterSaved.toFixed(0)} L Water Saved\n🏆 ${impactData.badges} Badges Earned\n\nJoin me in making a difference! 🌱`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Environmental Impact',
          text: shareText,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Impact summary copied to clipboard!");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!impactData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Your Impact
        </CardTitle>
        <CardDescription>
          Download or share your environmental achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shareable Card Preview */}
        <div 
          ref={cardRef}
          className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 text-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <pattern id="leaf-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 5 Q25 15 20 25 Q15 15 20 5" fill="currentColor" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-1">🌍 My Environmental Impact</h3>
              <p className="text-green-100 text-sm">{impactData.displayName}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <TreePine className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{impactData.treesPlanted}</div>
                <div className="text-xs text-green-100">Trees Planted</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <Leaf className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{impactData.co2Reduced.toFixed(1)}</div>
                <div className="text-xs text-green-100">kg CO₂ Reduced</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{impactData.o2Generated.toFixed(0)}</div>
                <div className="text-xs text-green-100">L/day O₂ Generated</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{impactData.badges}</div>
                <div className="text-xs text-green-100">Badges Earned</div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-green-100">
                🌱 Making a difference, one tree at a time
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={downloadAsImage} 
            disabled={downloading}
            className="flex-1 gap-2"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Downloading..." : "Download Image"}
          </Button>
          <Button 
            variant="outline" 
            onClick={shareCard}
            className="flex-1 gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
