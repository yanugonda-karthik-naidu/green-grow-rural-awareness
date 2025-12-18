import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TreeImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  treeName: string;
}

export const TreeImageLightbox = ({ isOpen, onClose, imageUrl, treeName }: TreeImageLightboxProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="relative flex items-center justify-center min-h-[60vh] p-4">
          <img
            src={imageUrl}
            alt={treeName}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white text-lg font-semibold">{treeName}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
