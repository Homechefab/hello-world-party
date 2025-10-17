import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  TrendingUp, 
  Package,
  Star,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Calendar,
  Truck
} from "lucide-react";

const RestaurantDashboard = () => {
  // Mock data för dashboard
  const stats = [
    {
      title: "Totala beställningar",
      value: "847",
      change: "+12%",
      icon: Package,
      trend: "up"
    },
    {
      title: "Omsättning denna månad",
      value: "42,580 kr",
      change: "+8%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Aktiva rätter",
      value: "23",
      change: "+3",
      icon: Store,
      trend: "up"
    },
    {
      title: "Genomsnittligt betyg",
      value: "4.7",
      change: "+0.2",
      icon: Star,
      trend: "up"
    }
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "Anna Andersson",
      items: "Pasta Carbonara x2, Tiramisu x1",
      amount: "380 kr",
      status: "levererad",
      time: "14:30"
    },
    {
      id: "#12344",
      customer: "Erik Nilsson",
      items: "Pizza Margherita x1",
      amount: "165 kr",
      status: "tillagning",
      time: "13:45"
    },
    {
      id: "#12343",
      customer: "Maria Johansson",
      items: "Lasagne x1, Sallad x1",
      amount: "245 kr",
      status: "ny",
      time: "13:20"
    }
  ];

  const popularDishes = [
    {
      name: "Pasta Carbonara",
      orders: 89,
      rating: 4.8,
      revenue: "8,900 kr"
    },
    {
      name: "Pizza Margherita",
      orders: 76,
      rating: 4.6,
      revenue: "7,200 kr"
    },
    {
      name: "Lasagne",
      orders: 45,
      rating: 4.9,
      revenue: "5,400 kr"
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      ny: "bg-blue-100 text-blue-800",
      tillagning: "bg-yellow-100 text-yellow-800",
      levererad: "bg-green-100 text-green-800"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Restaurangdashboard</h1>
            <p className="text-muted-foreground">Hantera dina beställningar och följ upp försäljningen</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Visa profil
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Lägg till rätt
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">
                  {stat.change} från förra månaden
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Senaste beställningarna
                </CardTitle>
                <CardDescription>
                  Hantera inkommande och pågående beställningar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={getStatusBadge(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{order.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{order.customer}</p>
                        <p className="text-sm">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Edit className="w-4 h-4 mr-1" />
                          Hantera
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Dishes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Populära rätter
                </CardTitle>
                <CardDescription>
                  Dina mest sålda rätter denna månad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularDishes.map((dish, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{dish.name}</h4>
                        <span className="text-sm font-semibold">{dish.revenue}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{dish.orders} beställningar</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{dish.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Försäljningsrapport
              </CardTitle>
              <CardDescription>
                Se detaljerad försäljningsstatistik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Visa rapport
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Öppettider
              </CardTitle>
              <CardDescription>
                Hantera när ni tar emot beställningar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ändra tider
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Leveransinställningar
              </CardTitle>
              <CardDescription>
                Konfigurera leveransområden och avgifter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Konfigurera
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;