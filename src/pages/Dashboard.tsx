// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users,
  Settings,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

// Mock data för säljare
const sellerStats = {
  totalEarnings: 2850,
  totalOrders: 47,
  averageRating: 4.8,
  activeListings: 3
};

const recentOrders = [
  {
    id: "1",
    dishName: "Mormors köttbullar",
    buyerName: "Maria S.",
    quantity: 2,
    total: 178,
    status: "Hämtad",
    time: "2 tim sedan"
  },
  {
    id: "2", 
    dishName: "Krämig tomatsoppa",
    buyerName: "Erik L.",
    quantity: 1,
    total: 65,
    status: "Bekräftad",
    time: "4 tim sedan"
  },
  {
    id: "3",
    dishName: "Äppelpaj farmors stil",
    buyerName: "Anna K.",
    quantity: 3,
    total: 225,
    status: "Väntar",
    time: "6 tim sedan"
  }
];

const myListings = [
  {
    id: "1",
    title: "Mormors köttbullar",
    price: 89,
    available: 3,
    total: 8,
    views: 142,
    orders: 12,
    rating: 4.8,
    status: "Aktiv"
  },
  {
    id: "2",
    title: "Krämig tomatsoppa", 
    price: 65,
    available: 6,
    total: 10,
    views: 89,
    orders: 4,
    rating: 4.7,
    status: "Aktiv"
  },
  {
    id: "3",
    title: "Äppelpaj farmors stil",
    price: 75,
    available: 0,
    total: 6,
    views: 76,
    orders: 6,
    rating: 4.6,
    status: "Slutsåld"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hämtad": return "bg-green-100 text-green-800";
    case "Bekräftad": return "bg-blue-100 text-blue-800";
    case "Väntar": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredListings = myListings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Säljarpanel</h1>
            <p className="text-muted-foreground">Hantera dina rätter och beställningar</p>
          </div>
          <Link to="/sell">
            <Button variant="food" size="lg">
              Lägg till ny rätt
            </Button>
          </Link>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Totala intäkter</p>
                  <p className="text-2xl font-bold">{sellerStats.totalEarnings} kr</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Beställningar</p>
                  <p className="text-2xl font-bold">{sellerStats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Genomsnittligt betyg</p>
                  <p className="text-2xl font-bold">{sellerStats.averageRating}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktiva annonser</p>
                  <p className="text-2xl font-bold">{sellerStats.activeListings}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Beställningar</TabsTrigger>
            <TabsTrigger value="listings">Mina annonser</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Senaste beställningar</CardTitle>
                <CardDescription>
                  Håll koll på dina senaste beställningar och deras status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{order.dishName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Beställd av {order.buyerName} • {order.quantity} portioner
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{order.total} kr</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{order.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mina annonser</CardTitle>
                    <CardDescription>
                      Hantera och redigera dina maträtter
                    </CardDescription>
                  </div>
                  <Input
                    placeholder="Sök bland dina rätter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{listing.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{listing.price} kr</span>
                            <span>{listing.available}/{listing.total} kvar</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{listing.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={listing.status === "Aktiv" ? "default" : "secondary"}>
                          {listing.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{listing.views} visningar</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>{listing.orders} beställningar</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Redigera
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Ta bort
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profilinställningar</CardTitle>
                <CardDescription>
                  Hantera din säljarprofil och inställningar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    AL
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Anna Lindström</h3>
                    <p className="text-muted-foreground">Medlem sedan mars 2024</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">4.8 betyg (47 recensioner)</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">E-post</label>
                    <Input value="anna.lindstrom@email.com" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefon</label>
                    <Input value="070-123 45 67" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Adress</label>
                  <Input value="Hornsgatan 45, 118 49 Stockholm" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Om mig</label>
                  <textarea 
                    className="w-full mt-1 p-3 border rounded-md resize-none"
                    rows={4}
                    defaultValue="Passionerad hemkock med 15 års erfarenhet. Specialiserad på traditionell svensk husmanskost med moderna influenser."
                  />
                </div>
                
                <Button variant="food">
                  Spara ändringar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;