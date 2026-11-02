import { useEffect } from "react";
import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { GlassCard } from "@/shared/components/liquid-glass/GlassCard";

interface TrailerModalProps {
  trailerKey: string | null;
  onClose: () => void;
  title?: string;
}

/**
 * Full-screen YouTube embed for a movie trailer.
 * Escape key closes it; clicking the backdrop closes it too.
 */
export const TrailerModal = ({ trailerKey, onClose, title = "Movie trailer" }: TrailerModalProps) => {
  useEffect(() => {
    if (!trailerKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trailerKey, onClose]);

  if (!trailerKey) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative aspect-video w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard
          cornerRadius={14}
          blurAmount={10}
          displacementScale={50}
          padding="0"
          shadowMode
          className="overflow-hidden"
        >
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title={title}
            className="block aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </GlassCard>
        <Button
          variant="glass"
          size="icon"
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute -top-12 right-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TrailerModal;
