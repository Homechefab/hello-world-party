import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, ThumbsUp, User as _User, Calendar } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  orderInfo?: string;
}

interface ReviewsProps {
  dishId: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Maria Andersson",
    rating: 5,
    comment: "Fantastiska köttbullar! Precis som mormor brukade göra. Perfekt kryddning och konsistens. Kommer definitivt beställa igen!",
    date: "2024-01-15",
    helpful: 12,
    verified: true,
    orderInfo: "Beställde 2 portioner"
  },
  {
    id: "2", 
    userName: "Erik Lindqvist",
    rating: 4,
    comment: "Mycket god mat och snabb upphämtning. Kanske lite för salt för min smak men annars excellent kvalitet.",
    date: "2024-01-10",
    helpful: 8,
    verified: true,
    orderInfo: "Beställde 1 portion"
  },
  {
    id: "3",
    userName: "Anna Nilsson", 
    rating: 5,
    comment: "Bästa hemlagade maten jag hittat på appen! Anna är så trevlig och maten är alltid färsk. Rekommenderar starkt!",
    date: "2024-01-05",
    helpful: 15,
    verified: true,
    orderInfo: "Beställde 3 portioner"
  }
];

const ReviewSection = ({ dishId: _dishId, averageRating, totalReviews, reviews = mockReviews }: ReviewsProps) => {
  // dishId parameter is required by the interface but not yet used in the implementation
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      toast({
        title: "Välj betyg",
        description: "Du måste ge ett betyg mellan 1-5 stjärnor",
        variant: "destructive"
      });
      return;
    }

    if (newReview.comment.trim().length < 10) {
      toast({
        title: "För kort kommentar",
        description: "Skriv minst 10 tecken i din recension",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Recension skickad!",
      description: "Tack för din feedback. Din recension kommer granskas innan publicering."
    });

    setNewReview({ rating: 0, comment: "" });
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse(); // 5 stjärnor först
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void, onStarHover?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= (interactive ? (hoveredStar || rating) : rating)
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
            onMouseEnter={() => interactive && onStarHover?.(star)}
            onMouseLeave={() => interactive && onStarHover?.(0)}
          />
        ))}
      </div>
    );
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Översikt av betyg */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Recensioner & betyg
            <Badge variant="secondary">{totalReviews} recensioner</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genomsnittligt betyg */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{averageRating}</div>
              {renderStars(averageRating)}
              <p className="text-sm text-muted-foreground mt-2">
                Baserat på {totalReviews} recensioner
              </p>
            </div>

            {/* Fördelning av betyg */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm w-3">{stars}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${totalReviews > 0 ? (ratingDistribution[index] / totalReviews) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingDistribution[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lägg till recension */}
      <Card>
        <CardHeader>
          <CardTitle>Skriv en recension</CardTitle>
          <CardDescription>
            Dela din upplevelse med andra kunder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Betyg *</label>
            {renderStars(
              newReview.rating, 
              true, 
              (rating) => setNewReview(prev => ({ ...prev, rating })),
              setHoveredStar
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Kommentar *</label>
            <Textarea
              placeholder="Berätta om din upplevelse av maten, leveransen och den övergripande kvaliteten..."
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
            />
          </div>

          <Button onClick={handleSubmitReview} variant="food">
            Skicka recension
          </Button>
        </CardContent>
      </Card>

      {/* Befintliga recensioner */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Alla recensioner</h3>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sortera efter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Nyast först</SelectItem>
              <SelectItem value="oldest">Äldst först</SelectItem>
              <SelectItem value="highest">Högsta betyg</SelectItem>
              <SelectItem value="lowest">Lägsta betyg</SelectItem>
              <SelectItem value="helpful">Mest hjälpsamma</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Verifierad köp
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(review.date).toLocaleDateString('sv-SE')}
                      {review.orderInfo && (
                        <>
                          <span>•</span>
                          <span>{review.orderInfo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              <p className="text-foreground mb-4 leading-relaxed">{review.comment}</p>
              
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Hjälpsam ({review.helpful})
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Rapportera
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rapportera recension</DialogTitle>
                      <DialogDescription>
                        Varför vill du rapportera denna recension?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Olämpligt innehåll
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Spam eller fake
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Felaktig information
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Annat
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;