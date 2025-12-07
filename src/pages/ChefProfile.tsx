import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin, ChefHat, Instagram, Facebook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import ShareButtons from "@/components/ShareButtons";
import SEOHead from "@/components/SEOHead";
import { VideoDisplay } from "@/components/VideoDisplay";

// Custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom Snapchat icon
const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.12-.063-.18-.016-.24.164-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
  </svg>
);

interface Chef {
  id: string;
  business_name: string;
  user_id: string;
  full_name: string;
  address: string;
  profile_image_url?: string | null;
  tiktok_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  snapchat_url?: string | null;
}

interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url?: string | null;
  category: string | null;
  allergens: string[] | null;
  ingredients: string[] | null;
  preparation_time: number | null;
  available: boolean | null;
}

interface ChefVideo {
  id: string;
  title: string;
  description: string;
  url?: string;
  createdAt: string;
}

interface ChefVideo {
  id: string;
  title: string;
  description: string;
  url?: string;
  socialUrl?: string;
  platform?: 'tiktok' | 'instagram' | 'youtube';
  createdAt: string;
}

const ChefProfile = () => {
  const { chefId } = useParams<{ chefId: string }>();
  const [chef, setChef] = useState<Chef | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [videos, setVideos] = useState<ChefVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChefData = async () => {
      if (!chefId) return;
      
      try {
        // Fetch chef info
        const { data: chefData, error: chefError } = await supabase
          .from('chefs')
          .select(`
            id,
            business_name,
            user_id,
            profile_image_url,
            tiktok_url,
            facebook_url,
            instagram_url,
            snapchat_url
          `)
          .eq('id', chefId)
          .eq('kitchen_approved', true)
          .maybeSingle();

        if (chefError) throw chefError;
        
        if (!chefData) {
          throw new Error('Chef not found');
        }

        // Fetch profile info separately if user_id exists
        let profileFullName = 'Okänd kock';
        let profileAddress = '';
        if (chefData.user_id) {
          const { data: fetchedProfile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, address')
            .eq('id', chefData.user_id)
            .maybeSingle();

          if (profileError) throw profileError;
          profileFullName = fetchedProfile?.full_name || 'Okänd kock';
          profileAddress = fetchedProfile?.address || '';
        }

        setChef({
          id: chefData.id,
          business_name: chefData.business_name,
          user_id: chefData.user_id || '',
          full_name: profileFullName,
          address: profileAddress,
          profile_image_url: chefData.profile_image_url,
          tiktok_url: chefData.tiktok_url,
          facebook_url: chefData.facebook_url,
          instagram_url: chefData.instagram_url,
          snapchat_url: chefData.snapchat_url
        });

        // Fetch chef's dishes
        const { data: dishesData, error: dishesError } = await supabase
          .from('dishes')
          .select('*')
          .eq('chef_id', chefId)
          .eq('available', true);

        if (dishesError) throw dishesError;
        setDishes(dishesData || []);

        // Fetch chef's videos
        const { data: videosData, error: videosError } = await supabase
          .from('chef_videos')
          .select('*')
          .eq('chef_id', chefId)
          .order('created_at', { ascending: false });

        if (videosError) throw videosError;
        
        const formattedVideos: ChefVideo[] = (videosData || []).map((v: any) => ({
          id: v.id,
          title: v.title,
          description: v.description || '',
          url: v.video_url,
          createdAt: v.created_at
        }));
        setVideos(formattedVideos);
      } catch (error) {
        console.error('Error fetching chef data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefData();
  }, [chefId]);

  const handleAddToCart = (dish: Dish) => {
    if (!chef) return;

    addItem({
      id: `${dish.id}-${Date.now()}`,
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      chefId: chef.id,
      chefName: chef.business_name || chef.full_name,
      image: dish.image_url || undefined
    });

    toast({
      title: "Tillagd i varukorg",
      description: `${dish.name} har lagts till i din varukorg.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Laddar kockens profil...</p>
        </div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Kocken hittades inte</h1>
          <p className="text-muted-foreground">Denna kock finns inte eller är inte godkänd än.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={chef.business_name || chef.full_name}
        description={`Beställ hemlagad mat från ${chef.business_name || chef.full_name}. Upptäck autentiska maträtter lagade med kärlek.`}
        keywords={`${chef.business_name}, hemlagad mat, ${chef.address || "Stockholm"}`}
        localBusinessData={{
          name: chef.business_name || chef.full_name,
          description: `Hemkock på Homechef`,
          address: chef.address,
          rating: 4.8,
          reviewCount: 42,
        }}
      />
      
      <div className="min-h-screen bg-background">
        {/* Chef Header */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center relative">
              <div className="absolute top-0 right-0">
                <ShareButtons 
                  title={chef.business_name || chef.full_name}
                  description={`Beställ hemlagad mat från ${chef.business_name || chef.full_name} på Homechef`}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                />
              </div>
              
              {/* Profile Image */}
              {chef.profile_image_url ? (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white/30 overflow-hidden">
                  <img 
                    src={chef.profile_image_url} 
                    alt={chef.business_name || chef.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <ChefHat className="w-16 h-16 text-white mx-auto mb-4" />
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {chef.business_name || chef.full_name}
              </h1>
              {chef.address && (
                <div className="flex items-center justify-center text-white/90 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{chef.address}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 text-white/90">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>4.8 (42 recensioner)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>30-45 min tillagning</span>
                </div>
              </div>
              
              {/* Social Media Links */}
              {(chef.instagram_url || chef.facebook_url || chef.tiktok_url || chef.snapchat_url) && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  {chef.instagram_url && (
                    <a 
                      href={chef.instagram_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {chef.facebook_url && (
                    <a 
                      href={chef.facebook_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {chef.tiktok_url && (
                    <a 
                      href={chef.tiktok_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      aria-label="TikTok"
                    >
                      <TikTokIcon className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {chef.snapchat_url && (
                    <a 
                      href={chef.snapchat_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      aria-label="Snapchat"
                    >
                      <SnapchatIcon className="w-5 h-5 text-white" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <VideoDisplay videos={videos} showAll className="mb-0" />
            </div>
          </section>
        )}

        {/* Dishes Section */}
        <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Maträtter från {chef.business_name || chef.full_name}</h2>
          
          {dishes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Denna kock har inga tillgängliga rätter just nu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <Card key={dish.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {dish.image_url ? (
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-secondary rounded-t-lg flex items-center justify-center">
                        <ChefHat className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    {dish.category && (
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                        {dish.category}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{dish.name}</h3>
                      <span className="font-bold text-primary text-xl">{dish.price} kr</span>
                    </div>
                    
                    {dish.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      {dish.preparation_time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{dish.preparation_time} min</span>
                        </div>
                      )}
                    </div>
                    
                    {dish.allergens && dish.allergens.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-1">Allergener:</p>
                        <div className="flex flex-wrap gap-1">
                          {dish.allergens.slice(0, 3).map((allergen) => (
                            <Badge key={allergen} variant="outline" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="food" 
                      className="w-full"
                      onClick={() => handleAddToCart(dish)}
                    >
                      Lägg till i varukorg
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        </section>
      </div>
    </>
  );
};

export default ChefProfile;