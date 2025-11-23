import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Cart } from '@/components/Cart';
import { useToast } from '@/hooks/use-toast';
import meatballsImg from '@/assets/meatballs.jpg';
import pastaImg from '@/assets/pasta.jpg';
import soupImg from '@/assets/soup.jpg';

const dishes = [
  {
    id: '1',
    dishId: 'dish_1',
    name: 'Köttbullar med potatismos',
    price: 89,
    chefId: 'chef_demo',
    chefName: 'Demo Kock',
    image: meatballsImg,
    description: 'Klassiska svenska köttbullar med krämigt potatismos',
    priceId: 'price_1SKl5741rPpIJXZ0RGnIxSzt'
  },
  {
    id: '2',
    dishId: 'dish_2',
    name: 'Hemlagad Lasagne',
    price: 149,
    chefId: 'chef_demo',
    chefName: 'Demo Kock',
    image: pastaImg,
    description: 'Hemlagad lasagne med köttfärs och generösa lager av ost',
    priceId: 'price_1SKl5O41rPpIJXZ0nSXiiEVh'
  },
  {
    id: '3',
    dishId: 'dish_3',
    name: 'Thai Röd Curry',
    price: 129,
    chefId: 'chef_demo',
    chefName: 'Demo Kock',
    image: soupImg,
    description: 'Kryddig thailändsk röd curry med kokosmjölk',
    priceId: 'price_1SKl5j41rPpIJXZ0hISmjkUX'
  }
];

/**
 * Payment Demo Page - Visar exempel på Stripe-betalningar med varukorg
 */
const PaymentDemo = () => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (dish: typeof dishes[0]) => {
    addItem({
      id: dish.id,
      dishId: dish.dishId,
      name: dish.name,
      price: dish.price,
      chefId: dish.chefId,
      chefName: dish.chefName,
      image: dish.image
    });
    
    toast({
      title: "Tillagd i varukorgen",
      description: `${dish.name} har lagts till i din varukorg`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold">Betalningsdemo med Stripe</h1>
            <p className="text-muted-foreground mt-2">
              Lägg till maträtter i varukorgen, logga in och betala säkert
            </p>
          </div>
          <Cart />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hur provisionen fungerar</CardTitle>
            <CardDescription>
              Homechef tar 20% provision på varje försäljning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Totalpris kunden betalar</div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">20%</div>
                <div className="text-sm text-muted-foreground">Homechef provision</div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600">80%</div>
                <div className="text-sm text-muted-foreground">Kockens intäkt</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Välj maträtter</h2>
          <p className="text-muted-foreground">
            Lägg till maträtter i varukorgen för att testa betalningsflödet
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-lg">{dish.name}</CardTitle>
                  <CardDescription>{dish.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{dish.price} kr</span>
                    <Button 
                      onClick={() => handleAddToCart(dish)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Lägg till
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-600">💳 Stripe Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <p className="font-medium">Testkort för lyckad betalning:</p>
              <code className="bg-background px-3 py-2 rounded block">4242 4242 4242 4242</code>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Utgångsdatum:</p>
              <p className="text-sm text-muted-foreground">Valfritt framtida datum (t.ex. 12/25)</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">CVC:</p>
              <p className="text-sm text-muted-foreground">Valfria 3 siffror (t.ex. 123)</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Postnummer:</p>
              <p className="text-sm text-muted-foreground">Valfritt postnummer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDemo;
