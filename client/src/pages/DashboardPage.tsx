import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Truck,
  Users,
  BarChart3,
  Search,
  LogOut,
  Bell,
  User,
  Home,
  Settings,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Repeat,
} from "lucide-react";

// Mock data voor het dashboard
const mockZendingen = [
  {
    id: 1,
    trackingCode: "PNL12345678",
    status: "onderweg",
    prioriteit: "standaard",
    verzendDatum: "2025-05-10T10:30:00",
    geplanndeAfleverDatum: "2025-05-13T12:00:00",
    verzender: "Kantoor Supplies B.V.",
    ontvanger: "Tech Solutions N.V.",
    ophaladres: "Industrieweg 45, 1234 AB Amsterdam",
    afleveradres: "Businesspark 12, 5678 CD Rotterdam",
    prijs: "€45,95",
    betaald: true,
    lastUpdate: {
      status: "onderweg",
      locatie: "Distributiecentrum Utrecht",
      tijdstip: "2025-05-11T14:45:00",
    },
  },
  {
    id: 2,
    trackingCode: "PNL23456789",
    status: "gepland",
    prioriteit: "spoed",
    verzendDatum: "2025-05-12T09:00:00",
    geplanndeAfleverDatum: "2025-05-12T17:00:00",
    verzender: "Fashion Store B.V.",
    ontvanger: "Boutique Elegance",
    ophaladres: "Modestraat 78, 2345 EF Den Haag",
    afleveradres: "Winkelplein 34, 6789 GH Groningen", 
    prijs: "€75,50",
    betaald: false,
    lastUpdate: {
      status: "gepland",
      locatie: "Wachtend op ophaling",
      tijdstip: "2025-05-11T15:30:00",
    },
  },
  {
    id: 3, 
    trackingCode: "PNL34567890",
    status: "afgeleverd",
    prioriteit: "standaard",
    verzendDatum: "2025-05-09T11:15:00",
    geplanndeAfleverDatum: "2025-05-11T13:00:00",
    werkelijkeAfleverDatum: "2025-05-11T12:45:00",
    verzender: "Electronics Plus",
    ontvanger: "IT Solutions",
    ophaladres: "Techstraat 12, 3456 JK Eindhoven",
    afleveradres: "Computerweg 45, 7890 LM Utrecht",
    prijs: "€32,75",
    betaald: true,
    lastUpdate: {
      status: "afgeleverd",
      locatie: "Computerweg 45, Utrecht",
      tijdstip: "2025-05-11T12:45:00",
    },
  }
];

// Statistische gegevens voor het dashboard
const statsData = {
  totaalZendingen: 156,
  actieveZendingen: 32,
  afgeleverd: 124,
  gemiddeldeLeveringstijd: "1.7 dagen",
  klanttevredenheid: "4.8 / 5",
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    gepland: "bg-blue-100 text-blue-800",
    opgehaald: "bg-indigo-100 text-indigo-800",
    onderweg: "bg-yellow-100 text-yellow-800",
    afgeleverd: "bg-green-100 text-green-800",
    vertraagd: "bg-orange-100 text-orange-800",
    geannuleerd: "bg-red-100 text-red-800",
  };

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Sidebar item component
const SidebarItem = ({ icon: Icon, label, active, onClick }: { 
  icon: React.ElementType; 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
}) => {
  return (
    <div 
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-primary text-white" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  );
};

// Formatting utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overzicht");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Mock authentication check
  useEffect(() => {
    // In een echte implementatie zou hier een check zijn of de gebruiker is ingelogd
    const isAuthenticated = true; // Mockwaarde
    
    if (!isAuthenticated) {
      toast({
        title: "Niet ingelogd",
        description: "U moet ingelogd zijn om het dashboard te bekijken.",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [setLocation, toast]);

  // Functie om zendingen te filteren op basis van zoekopdracht
  const filterZendingen = (zendingen: typeof mockZendingen) => {
    if (!searchQuery) return zendingen;
    
    return zendingen.filter(zending => 
      zending.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zending.verzender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zending.ontvanger.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredZendingen = filterZendingen(mockZendingen);

  const handleLogout = () => {
    toast({
      title: "Uitgelogd",
      description: "U bent succesvol uitgelogd.",
    });
    setLocation("/login");
  };

  // Render dashboard
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-sm border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">PriorityParcel</h2>
          <p className="text-sm text-gray-500">Klantportaal</p>
        </div>
        
        <div className="flex-1 py-4 space-y-1 px-2">
          <SidebarItem icon={Home} label="Dashboard" active={activeSidebarItem === "dashboard"} onClick={() => setActiveSidebarItem("dashboard")} />
          <SidebarItem icon={Package} label="Mijn Zendingen" onClick={() => setActiveSidebarItem("zendingen")} />
          <SidebarItem icon={Truck} label="Nieuwe Zending" onClick={() => setActiveSidebarItem("nieuw")} />
          <SidebarItem icon={Users} label="Mijn Account" onClick={() => setActiveSidebarItem("account")} />
          <SidebarItem icon={BarChart3} label="Rapportages" onClick={() => setActiveSidebarItem("rapportages")} />
          <SidebarItem icon={Settings} label="Instellingen" onClick={() => setActiveSidebarItem("instellingen")} />
        </div>
        
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Uitloggen
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Zoek zending..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </header>
        
        {/* Main dashboard */}
        <main className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="overzicht" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="overzicht">Overzicht</TabsTrigger>
                <TabsTrigger value="zendingen">Mijn Zendingen</TabsTrigger>
                <TabsTrigger value="statistieken">Statistieken</TabsTrigger>
              </TabsList>
              
              <Button>
                <Truck className="mr-2 h-4 w-4" />
                Nieuwe Zending
              </Button>
            </div>
            
            {/* Overzicht tab */}
            <TabsContent value="overzicht" className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Actieve Zendingen</CardTitle>
                    <Truck className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.actieveZendingen}</div>
                    <p className="text-xs text-gray-500">van {statsData.totaalZendingen} zendingen</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Gem. Leveringstijd</CardTitle>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.gemiddeldeLeveringstijd}</div>
                    <p className="text-xs text-gray-500">laatste 30 dagen</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Klanttevredenheid</CardTitle>
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.klanttevredenheid}</div>
                    <p className="text-xs text-gray-500">laatste 30 dagen</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent shipments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recente Zendingen</CardTitle>
                  <CardDescription>
                    Uw meest recente zendingen en hun status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredZendingen.map((zending) => (
                      <div key={zending.id} className="flex flex-col md:flex-row justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Package className="h-5 w-5 text-primary" />
                            <span className="font-bold">{zending.trackingCode}</span>
                            <StatusBadge status={zending.status} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Verzonden: {formatDate(zending.verzendDatum)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>Van: {zending.ophaladres}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>Naar: {zending.afleveradres}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 self-center">
                          <Button variant="outline" size="sm" className="gap-1">
                            Details <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Zendingen tab */}
            <TabsContent value="zendingen" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alle Zendingen</CardTitle>
                  <CardDescription>
                    Een overzicht van al uw zendingen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="py-3 px-4 font-medium">Tracking Code</th>
                          <th className="py-3 px-4 font-medium">Status</th>
                          <th className="py-3 px-4 font-medium">Verzonden</th>
                          <th className="py-3 px-4 font-medium">Verwachte levering</th>
                          <th className="py-3 px-4 font-medium">Ontvanger</th>
                          <th className="py-3 px-4 font-medium">Prijs</th>
                          <th className="py-3 px-4 font-medium">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredZendingen.map((zending) => (
                          <tr key={zending.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{zending.trackingCode}</td>
                            <td className="py-3 px-4">
                              <StatusBadge status={zending.status} />
                            </td>
                            <td className="py-3 px-4 text-sm">{formatDate(zending.verzendDatum)}</td>
                            <td className="py-3 px-4 text-sm">{formatDate(zending.geplanndeAfleverDatum)}</td>
                            <td className="py-3 px-4">{zending.ontvanger}</td>
                            <td className="py-3 px-4">{zending.prijs}</td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">Details</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Statistieken tab */}
            <TabsContent value="statistieken" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Uw Statistieken</CardTitle>
                  <CardDescription>
                    Gedetailleerde informatie over uw transportactiviteiten
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <Package className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-medium">Zendingen</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Totaal</span>
                          <span className="font-bold">{statsData.totaalZendingen}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Actief</span>
                          <span className="font-bold">{statsData.actieveZendingen}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Afgeleverd</span>
                          <span className="font-bold">{statsData.afgeleverd}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-medium">Tijden</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Gem. leveringstijd</span>
                          <span className="font-bold">{statsData.gemiddeldeLeveringstijd}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Op tijd geleverd</span>
                          <span className="font-bold">94%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vertraagd</span>
                          <span className="font-bold">6%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-medium">Type Zendingen</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Nationaal</span>
                          <span className="font-bold">68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Internationaal</span>
                          <span className="font-bold">32%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spoed</span>
                          <span className="font-bold">24%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <Repeat className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-medium">Trend</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Deze maand</span>
                          <span className="font-bold">43 zendingen</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Vorige maand</span>
                          <div className="flex items-center">
                            <span className="font-bold mr-1">37</span>
                            <span className="text-green-500 text-xs">(+16%)</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Prognose</span>
                          <span className="font-bold">+12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}