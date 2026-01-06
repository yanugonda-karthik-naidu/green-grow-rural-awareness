import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, MapPin, Mail, Phone, Loader2, ArrowLeft, ShoppingBag, Settings, Bell, History } from "lucide-react";
import { z } from "zod";
import { PurchasedItems } from "@/components/PurchasedItems";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { NotificationHistory } from "@/components/NotificationHistory";
import { ActivitySummary } from "@/components/ActivitySummary";
import { GoalSetting } from "@/components/GoalSetting";
import { GoalLeaderboard } from "@/components/GoalLeaderboard";
import { ShareableImpactCard } from "@/components/ShareableImpactCard";
const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters");
const locationSchema = z.string().trim().min(2, "Location must be at least 2 characters").max(200, "Location must be less than 200 characters");

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setDisplayName(profile.display_name || "");
        setLocation(profile.location || "");
        setEmail(profile.email || "");
        setPhone(profile.phone_number || "");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      nameSchema.parse(displayName);
      locationSchema.parse(location);
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Please check your input");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        location: location,
      })
      .eq('id', userId);

    if (error) {
      toast.error("Failed to update profile");
      console.error('Update error:', error);
    } else {
      toast.success("Profile updated successfully!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account and view your collection</p>
            </div>
          </div>

          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="collection" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Collection</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="display-name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Display Name
                      </Label>
                      <Input
                        id="display-name"
                        type="text"
                        placeholder="Your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="Your city or village"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    {phone && (
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Phone number cannot be changed
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              {userId && <NotificationPreferences userId={userId} />}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              {userId && (
                <>
                  <GoalSetting userId={userId} />
                  <GoalLeaderboard currentUserId={userId} />
                  <ActivitySummary userId={userId} />
                  <ShareableImpactCard userId={userId} />
                  <NotificationHistory userId={userId} />
                </>
              )}
            </TabsContent>

            <TabsContent value="collection">
              {userId && <PurchasedItems userId={userId} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
