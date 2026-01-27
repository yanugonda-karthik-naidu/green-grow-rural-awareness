import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, Sun, Cloud, Snowflake, Flower2, 
  Droplets, Scissors, Bug, Leaf, TreeDeciduous,
  ThermometerSun, Wind
} from "lucide-react";

interface PlantedTree {
  id: string;
  tree_name: string;
  species: string | null;
}

interface SeasonalCareCalendarProps {
  userId: string;
  language?: string;
}

type Season = "spring" | "summer" | "monsoon" | "autumn" | "winter";

interface CareActivity {
  activity: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
  description: string;
  plants?: string[];
}

const seasonalCareData: Record<Season, CareActivity[]> = {
  spring: [
    {
      activity: "Pruning",
      icon: <Scissors className="h-4 w-4" />,
      priority: "high",
      description: "Best time to prune most trees and shrubs before new growth begins",
    },
    {
      activity: "Fertilizing",
      icon: <Leaf className="h-4 w-4" />,
      priority: "high",
      description: "Apply balanced fertilizer to support new growth",
    },
    {
      activity: "Pest Inspection",
      icon: <Bug className="h-4 w-4" />,
      priority: "medium",
      description: "Check for overwintering pests and treat early",
    },
    {
      activity: "Transplanting",
      icon: <TreeDeciduous className="h-4 w-4" />,
      priority: "medium",
      description: "Ideal time to transplant or add new plants",
    },
    {
      activity: "Mulching",
      icon: <Flower2 className="h-4 w-4" />,
      priority: "low",
      description: "Add fresh mulch to retain moisture and suppress weeds",
    },
  ],
  summer: [
    {
      activity: "Deep Watering",
      icon: <Droplets className="h-4 w-4" />,
      priority: "high",
      description: "Water deeply in early morning or evening to prevent heat stress",
    },
    {
      activity: "Shade Protection",
      icon: <Sun className="h-4 w-4" />,
      priority: "high",
      description: "Provide shade cloth for sensitive plants during peak heat",
    },
    {
      activity: "Pest Control",
      icon: <Bug className="h-4 w-4" />,
      priority: "high",
      description: "Monitor and treat for summer pests and diseases",
    },
    {
      activity: "Light Pruning",
      icon: <Scissors className="h-4 w-4" />,
      priority: "medium",
      description: "Remove dead or damaged branches only",
    },
    {
      activity: "Harvest",
      icon: <Leaf className="h-4 w-4" />,
      priority: "medium",
      description: "Harvest fruits and vegetables at peak ripeness",
    },
  ],
  monsoon: [
    {
      activity: "Drainage Check",
      icon: <Droplets className="h-4 w-4" />,
      priority: "high",
      description: "Ensure proper drainage to prevent root rot",
    },
    {
      activity: "Fungal Prevention",
      icon: <Bug className="h-4 w-4" />,
      priority: "high",
      description: "Apply fungicides to prevent monsoon-related diseases",
    },
    {
      activity: "Staking",
      icon: <TreeDeciduous className="h-4 w-4" />,
      priority: "medium",
      description: "Stake tall plants to protect from strong winds",
    },
    {
      activity: "Reduce Watering",
      icon: <Cloud className="h-4 w-4" />,
      priority: "medium",
      description: "Let rain provide most of the water needs",
    },
    {
      activity: "Weed Control",
      icon: <Leaf className="h-4 w-4" />,
      priority: "medium",
      description: "Remove weeds that thrive in wet conditions",
    },
  ],
  autumn: [
    {
      activity: "Fertilizer Reduction",
      icon: <Leaf className="h-4 w-4" />,
      priority: "high",
      description: "Reduce fertilizing to allow plants to harden for winter",
    },
    {
      activity: "Leaf Cleanup",
      icon: <Wind className="h-4 w-4" />,
      priority: "high",
      description: "Remove fallen leaves to prevent disease",
    },
    {
      activity: "Planting",
      icon: <TreeDeciduous className="h-4 w-4" />,
      priority: "medium",
      description: "Good time to plant trees and perennials",
    },
    {
      activity: "Watering Adjustment",
      icon: <Droplets className="h-4 w-4" />,
      priority: "medium",
      description: "Reduce watering as temperatures drop",
    },
    {
      activity: "Tool Maintenance",
      icon: <Scissors className="h-4 w-4" />,
      priority: "low",
      description: "Clean and sharpen tools before storage",
    },
  ],
  winter: [
    {
      activity: "Frost Protection",
      icon: <Snowflake className="h-4 w-4" />,
      priority: "high",
      description: "Cover sensitive plants during frost warnings",
    },
    {
      activity: "Minimal Watering",
      icon: <Droplets className="h-4 w-4" />,
      priority: "medium",
      description: "Water only when soil is dry, avoid frozen ground",
    },
    {
      activity: "Winter Pruning",
      icon: <Scissors className="h-4 w-4" />,
      priority: "medium",
      description: "Prune dormant deciduous trees and shrubs",
    },
    {
      activity: "Planning",
      icon: <Calendar className="h-4 w-4" />,
      priority: "low",
      description: "Plan next year's garden and order seeds",
    },
    {
      activity: "Indoor Care",
      icon: <ThermometerSun className="h-4 w-4" />,
      priority: "medium",
      description: "Move sensitive potted plants indoors",
    },
  ],
};

const seasonIcons: Record<Season, React.ReactNode> = {
  spring: <Flower2 className="h-4 w-4" />,
  summer: <Sun className="h-4 w-4" />,
  monsoon: <Cloud className="h-4 w-4" />,
  autumn: <Wind className="h-4 w-4" />,
  winter: <Snowflake className="h-4 w-4" />,
};

const getCurrentSeason = (): Season => {
  const month = new Date().getMonth();
  // Adjusted for Indian climate
  if (month >= 2 && month <= 4) return "spring"; // Mar-May
  if (month >= 5 && month <= 6) return "summer"; // Jun-Jul
  if (month >= 7 && month <= 8) return "monsoon"; // Aug-Sep
  if (month >= 9 && month <= 10) return "autumn"; // Oct-Nov
  return "winter"; // Dec-Feb
};

export const SeasonalCareCalendar = ({ userId, language = "en" }: SeasonalCareCalendarProps) => {
  const [userPlants, setUserPlants] = useState<PlantedTree[]>([]);
  const [currentSeason, setCurrentSeason] = useState<Season>(getCurrentSeason());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlants = async () => {
      const { data } = await supabase
        .from('planted_trees')
        .select('id, tree_name, species')
        .eq('user_id', userId);

      if (data) {
        setUserPlants(data);
      }
      setLoading(false);
    };

    fetchUserPlants();
  }, [userId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-200";
      default:
        return "bg-muted";
    }
  };

  const getPlantSpecificTips = (season: Season): string[] => {
    const tips: string[] = [];
    const plantNames = userPlants.map(p => p.tree_name.toLowerCase());

    // Fruit trees
    if (plantNames.some(n => ["mango", "guava", "papaya", "banana"].includes(n))) {
      if (season === "spring") tips.push("🥭 Apply organic fertilizer to fruit trees for better yield");
      if (season === "summer") tips.push("🥭 Protect young fruits from sunburn with shade cloth");
      if (season === "monsoon") tips.push("🥭 Watch for fungal diseases on fruit trees");
    }

    // Flowering plants
    if (plantNames.some(n => ["rose", "hibiscus", "jasmine", "marigold"].includes(n))) {
      if (season === "spring") tips.push("🌺 Deadhead flowers regularly for continuous blooming");
      if (season === "summer") tips.push("🌺 Mist flowering plants in early morning");
    }

    // Vegetables
    if (plantNames.some(n => ["tomato", "chili", "brinjal", "okra"].includes(n))) {
      if (season === "monsoon") tips.push("🍅 Stake tomato plants and improve air circulation");
      if (season === "summer") tips.push("🍅 Harvest vegetables early morning for best flavor");
    }

    // Tropical trees
    if (plantNames.some(n => ["coconut", "palm", "banana", "areca"].includes(n))) {
      if (season === "winter") tips.push("🌴 Tropical plants need protection from cold winds");
    }

    return tips;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Seasonal Care Calendar
        </CardTitle>
        <CardDescription>
          Recommended care activities based on the current season
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentSeason} onValueChange={(v) => setCurrentSeason(v as Season)}>
          <TabsList className="grid grid-cols-5 mb-4">
            {(Object.keys(seasonalCareData) as Season[]).map((season) => (
              <TabsTrigger 
                key={season} 
                value={season}
                className="gap-1 capitalize text-xs sm:text-sm"
              >
                {seasonIcons[season]}
                <span className="hidden sm:inline">{season}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(seasonalCareData) as Season[]).map((season) => (
            <TabsContent key={season} value={season} className="space-y-4">
              {/* Current Season Indicator */}
              {season === getCurrentSeason() && (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  📅 Current Season
                </Badge>
              )}

              {/* Plant-specific tips */}
              {userPlants.length > 0 && getPlantSpecificTips(season).length > 0 && (
                <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <TreeDeciduous className="h-4 w-4" />
                    Tips for Your Plants
                  </h4>
                  <ul className="space-y-1">
                    {getPlantSpecificTips(season).map((tip, idx) => (
                      <li key={idx} className="text-sm">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* General care activities */}
              <div className="space-y-3">
                {seasonalCareData[season].map((activity, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${getPriorityColor(activity.priority)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-medium">
                        {activity.icon}
                        {activity.activity}
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {activity.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* User plants summary */}
              {userPlants.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Your Plants ({userPlants.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userPlants.slice(0, 10).map((plant) => (
                      <Badge key={plant.id} variant="secondary">
                        {plant.tree_name}
                      </Badge>
                    ))}
                    {userPlants.length > 10 && (
                      <Badge variant="outline">+{userPlants.length - 10} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
