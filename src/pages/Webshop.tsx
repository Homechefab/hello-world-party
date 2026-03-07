import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

import imgKoksutrustning from '@/assets/webshop/koksutrustning.jpg';
import imgHygien from '@/assets/webshop/hygien.jpg';
import imgForpackningar from '@/assets/webshop/forpackningar.jpg';
import imgEtiketter from '@/assets/webshop/etiketter.jpg';
import imgForvaring from '@/assets/webshop/forvaring.jpg';
import imgLeverans from '@/assets/webshop/leverans.jpg';
import imgStartpaket from '@/assets/webshop/startpaket.jpg';

const CATEGORY_IMAGES: Record<string, string> = {
  'Köksutrustning': imgKoksutrustning,
  'Hygien & Säkerhet': imgHygien,
  'Förpackningar': imgForpackningar,
  'Etiketter & Branding': imgEtiketter,
  'Förvaring': imgForvaring,
  'Leverans & Transport': imgLeverans,
  'Startpaket': imgStartpaket,
};
interface WebshopProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  available: boolean;
  stock_quantity: number | null;
}

const CATEGORIES = ['Alla', 'Köksutrustning', 'Hygien & Säkerhet', 'Förpackningar', 'Etiketter & Branding', 'Förvaring', 'Leverans & Transport', 'Startpaket'];

const Webshop = () => {
  const [selectedCategory, setSelectedCategory] = useState('Alla');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addItem } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ['webshop-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webshop_products' as any)
        .select('*')
        .eq('available', true)
        .order('category');
      if (error) throw error;
      return data as unknown as WebshopProduct[];
    },
  });

  const filtered = products?.filter((p) => {
    const matchCategory = selectedCategory === 'Alla' || p.category === selectedCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getQty = (id: string) => quantities[id] || 1;
  const setQty = (id: string, val: number) => setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));

  const handleAddToCart = (product: WebshopProduct) => {
    const qty = getQty(product.id);
    for (let i = 0; i < qty; i++) {
      addItem({
        id: `webshop-${product.id}`,
        dishId: product.id,
        name: product.name,
        price: product.price,
        chefId: 'webshop',
        chefName: 'Homechef Webbshop',
        image: product.image_url || undefined,
      });
    }
    toast.success(`${product.name} x${qty} tillagd i varukorgen`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Package className="w-5 h-5" />
            <span className="font-medium text-sm">Professionella kökstillbehör</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Webbshop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Allt du behöver som hemkock – matlådor, förpackningsmaterial, hygienartiklar och köksredskap.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Sök produkter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-48 bg-gradient-to-br from-muted to-secondary flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image_url || CATEGORY_IMAGES[product.category] || ''}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">{product.category}</Badge>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary">{product.price} kr</span>
                    {product.stock_quantity !== null && product.stock_quantity < 10 && (
                      <span className="text-xs text-destructive">Få kvar</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(product.id, getQty(product.id) - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{getQty(product.id)}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(product.id, getQty(product.id) + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button className="flex-1" size="sm" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Köp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Inga produkter hittades</h3>
            <p className="text-muted-foreground">Prova att ändra filter eller sökord.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Webshop;
