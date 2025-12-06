import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Star } from "lucide-react";

export function ChefRatingDisplay() {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRatings();
    }
  }, [user]);

  const loadRatings = async () => {
    try {
      // Get chef_id for current user
      const { data: chefData, error: chefError } = await supabase
        .from("chefs")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (chefError || !chefData) {
        setLoading(false);
        return;
      }

      // Get all reviews for this chef
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("chef_id", chefData.id);

      if (reviewsError) throw reviewsError;

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setRating(Math.round(avgRating * 10) / 10);
        setReviewCount(reviews.length);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="h-4 w-4 bg-muted rounded"></div>
        <div className="h-4 w-16 bg-muted rounded"></div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= Math.floor(rating);
      const isPartial = !isFilled && starValue === Math.ceil(rating) && rating % 1 !== 0;
      
      return (
        <Star
          key={i}
          className={`h-4 w-4 ${
            isFilled
              ? "fill-yellow-400 text-yellow-400"
              : isPartial
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      );
    });
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <p className="text-sm text-muted-foreground mb-2">Betyg & recensioner</p>
      {reviewCount > 0 ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {renderStars(rating || 0)}
          </div>
          <span className="font-semibold text-sm">{rating}</span>
          <span className="text-sm text-muted-foreground">
            ({reviewCount} {reviewCount === 1 ? "recension" : "recensioner"})
          </span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Inga recensioner än. Börja sälja för att få dina första recensioner!
        </p>
      )}
    </div>
  );
}
