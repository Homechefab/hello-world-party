import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Provider {
  id: string;
  name: string;
  type: "chef" | "business";
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  itemCount: number;
  hasDelivery: boolean;
  specialties: string[];
  imageUrl: string | null;
}

export const useProviders = (filters?: {
  location?: string;
  eventType?: string;
}) => {
  return useQuery({
    queryKey: ["providers", filters],
    queryFn: async (): Promise<Provider[]> => {
      // Fetch approved chefs from public view
      let chefsQuery = supabase
        .from("public_chef_profiles")
        .select(`
          id,
          business_name,
          full_name,
          bio,
          city,
          specialties,
          profile_image_url
        `);

      // Apply location filter if provided
      if (filters?.location) {
        chefsQuery = chefsQuery.ilike("city", `%${filters.location}%`);
      }

      const { data: chefs, error: chefsError } = await chefsQuery;

      if (chefsError) {
        console.error("Error fetching chefs:", chefsError);
        throw chefsError;
      }

      // Fetch dishes count and reviews for each chef
      const providerPromises = (chefs || []).map(async (chef) => {
        if (!chef.id) return null;

        // Get dish count
        const { count: dishCount } = await supabase
          .from("dishes")
          .select("*", { count: "exact", head: true })
          .eq("chef_id", chef.id)
          .eq("available", true);

        // Get reviews
        const { data: reviews } = await supabase
          .from("reviews")
          .select("rating")
          .eq("chef_id", chef.id);

        const totalRating = reviews?.reduce((sum, r) => sum + r.rating, 0) || 0;
        const avgRating = reviews?.length ? totalRating / reviews.length : 0;

        // Parse specialties
        const specialtiesArray = chef.specialties 
          ? chef.specialties.split(",").map((s: string) => s.trim())
          : [];

        return {
          id: chef.id,
          name: chef.business_name || chef.full_name || "Okänd kock",
          type: "chef" as "chef" | "business",
          location: chef.city || "Ej angiven",
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews?.length || 0,
          description: chef.bio || "Passionerad hemlagad mat med kärlek",
          itemCount: dishCount || 0,
          hasDelivery: true,
          specialties: specialtiesArray,
          imageUrl: chef.profile_image_url,
        } as Provider;
      });

      const results = await Promise.all(providerPromises);
      const providers = results.filter((p): p is Provider => p !== null);

      return providers;
    },
  });
};
