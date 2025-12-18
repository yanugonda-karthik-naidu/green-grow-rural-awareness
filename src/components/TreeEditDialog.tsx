import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlantedTree } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TreeEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tree: PlantedTree | null;
  onUpdate: () => void;
}

export const TreeEditDialog = ({ isOpen, onClose, tree, onUpdate }: TreeEditDialogProps) => {
  const [treeName, setTreeName] = useState(tree?.tree_name || "");
  const [description, setDescription] = useState(tree?.description || "");
  const [location, setLocation] = useState(tree?.location || "");
  const [isPublic, setIsPublic] = useState(tree?.is_public ?? true);
  const [isLoading, setIsLoading] = useState(false);

  // Update state when tree changes
  useState(() => {
    if (tree) {
      setTreeName(tree.tree_name);
      setDescription(tree.description || "");
      setLocation(tree.location || "");
      setIsPublic(tree.is_public ?? true);
    }
  });

  const handleSave = async () => {
    if (!tree) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("planted_trees")
        .update({
          tree_name: treeName,
          description,
          location,
          is_public: isPublic,
        })
        .eq("id", tree.id);

      if (error) throw error;

      toast.success("Tree updated successfully!");
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("Error updating tree:", error);
      toast.error("Failed to update tree: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Tree</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Tree Name</Label>
            <Input
              id="edit-name"
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
              placeholder="Enter tree name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="edit-public">Share on Community Wall</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !treeName}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
