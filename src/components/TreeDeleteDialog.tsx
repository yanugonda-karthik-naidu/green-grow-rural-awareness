import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlantedTree } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TreeDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tree: PlantedTree | null;
  onDelete: () => void;
}

export const TreeDeleteDialog = ({ isOpen, onClose, tree, onDelete }: TreeDeleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!tree) return;

    setIsLoading(true);
    try {
      // Delete the tree record
      const { error } = await supabase
        .from("planted_trees")
        .delete()
        .eq("id", tree.id);

      if (error) throw error;

      // Also delete associated community post if exists
      await supabase
        .from("community_posts")
        .delete()
        .ilike("content", `%${tree.tree_name}%`)
        .eq("user_id", tree.user_id);

      toast.success("Tree removed successfully");
      onDelete();
      onClose();
    } catch (error: any) {
      console.error("Error deleting tree:", error);
      toast.error("Failed to delete tree: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tree</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{tree?.tree_name}"? This action cannot be undone.
            This will also remove any associated community posts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
