import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Clock, CheckCircle, XCircle, Star, MapPin, Calendar, Package, Truck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Order {
  id: string;
  chef_name: string;
  dish_name: string;
  dish_image: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  delivery_time: string | null;
  created_at: string;
  items: Array<{
    dish_name: string;
    quantity: number;
    unit_price: number;
  }>;
}

const MyOrders = () => {
  const { user } = useAuth();
  const { usingMockData } = useRole();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      // Fetch real orders from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedOrders = (data || []).map(order => ({
        id: order.id,
        chef_name: 'Okänd kock',
        dish_name: 'Okänd rätt',
        dish_image: '/placeholder.svg',
        total_amount: order.total_amount,
        status: order.status,
        delivery_address: order.delivery_address,
        delivery_time: order.delivery_time,
        created_at: order.created_at,
        items: []
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Kunde inte hämta beställningar');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (usingMockData) {
      // Use mock data for testing
      setOrders(mockOrders);
      setLoading(false);
    } else if (user) {
      fetchOrders();
    }
  }, [fetchOrders, user, usingMockData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Väntar';
      case 'confirmed': return 'Bekräftad';
      case 'preparing': return 'Tillagas';
      case 'ready': return 'Klar för avhämtning';
      case 'delivered': return 'Levererad';
      case 'cancelled': return 'Avbruten';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <Truck className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.dish_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.chef_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-32 bg-secondary rounded"></div>
              <div className="h-32 bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Mina beställningar</h1>
            <p className="text-muted-foreground">Håll koll på dina beställningar och tidigare köp</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Sök efter rätt eller kock..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrera status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla beställningar</SelectItem>
              <SelectItem value="pending">Väntar</SelectItem>
              <SelectItem value="confirmed">Bekräftad</SelectItem>
              <SelectItem value="preparing">Tillagas</SelectItem>
              <SelectItem value="ready">Klar</SelectItem>
              <SelectItem value="delivered">Levererad</SelectItem>
              <SelectItem value="cancelled">Avbruten</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {orders.length === 0 ? 'Inga beställningar än' : 'Inga matchande beställningar'}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {orders.length === 0 
                  ? 'Du har inte gjort några beställningar än. Börja handla för att se dina köp här!'
                  : 'Försök ändra dina sökfilter för att hitta beställningar.'
                }
              </p>
              {orders.length === 0 && (
                <Button asChild>
                  <a href="/">Börja handla</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Order Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={order.dish_image}
                        alt={order.dish_name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{order.dish_name}</h3>
                          <p className="text-muted-foreground">från {order.chef_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Beställning #{order.id.slice(0, 8)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={`${getStatusColor(order.status)} mb-2`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                          <p className="text-xl font-bold">{order.total_amount} kr</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {item.quantity}x {item.dish_name} - {item.unit_price} kr
                          </div>
                        ))}
                      </div>

                      {/* Delivery Info */}
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {order.delivery_address}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.delivery_time 
                            ? new Date(order.delivery_time).toLocaleDateString('sv-SE')
                            : 'Avhämtning'
                          }
                        </div>
                        
                        <div className="text-xs">
                          Beställd: {new Date(order.created_at).toLocaleDateString('sv-SE')}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          Se detaljer
                        </Button>
                        
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            <Star className="w-4 h-4 mr-1" />
                            Lämna recension
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">
                          Beställ igen
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data for testing
const mockOrders: Order[] = [
  {
    id: '1',
    chef_name: 'Chef Maria',
    dish_name: 'Pasta Carbonara',
    dish_image: '/lovable-uploads/pasta.jpg',
    total_amount: 245,
    status: 'delivered',
    delivery_address: 'Storgatan 15, 111 29 Stockholm',
    delivery_time: '2025-01-03T18:30:00Z',
    created_at: '2025-01-03T16:00:00Z',
    items: [
      { dish_name: 'Pasta Carbonara', quantity: 1, unit_price: 245 }
    ]
  },
  {
    id: '2',
    chef_name: 'Chef Erik',
    dish_name: 'Köttbullar med potatismos',
    dish_image: '/lovable-uploads/meatballs.jpg',
    total_amount: 195,
    status: 'preparing',
    delivery_address: 'Vasagatan 8, 111 20 Stockholm',
    delivery_time: null,
    created_at: '2025-01-05T12:30:00Z',
    items: [
      { dish_name: 'Köttbullar med potatismos', quantity: 1, unit_price: 195 }
    ]
  },
  {
    id: '3',
    chef_name: 'Chef Anna',
    dish_name: 'Tomatsoppa',
    dish_image: '/lovable-uploads/soup.jpg',
    total_amount: 125,
    status: 'ready',
    delivery_address: 'Kungsgatan 42, 111 35 Stockholm',
    delivery_time: null,
    created_at: '2025-01-05T14:15:00Z',
    items: [
      { dish_name: 'Tomatsoppa', quantity: 1, unit_price: 125 }
    ]
  },
  {
    id: '4',
    chef_name: 'Chef Lisa',
    dish_name: 'Äppelpaj',
    dish_image: '/lovable-uploads/apple-pie.jpg',
    total_amount: 85,
    status: 'confirmed',
    delivery_address: 'Drottninggatan 67, 111 21 Stockholm',
    delivery_time: '2025-01-06T15:00:00Z',
    created_at: '2025-01-05T10:45:00Z',
    items: [
      { dish_name: 'Äppelpaj', quantity: 1, unit_price: 85 }
    ]
  }
];

export default MyOrders;