import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
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

// Statische type definitie voor Zending
interface Zending {
  id: number;
  trackingCode: string;
  status: string;
  prioriteit: string;
  verzendDatum: string;
  geplanndeAfleverDatum: string;
  werkelijkeAfleverDatum?: string;
  verzender: string;
  ontvanger: string;
  ophaladres: string;
  afleveradres: string;
  prijs: string;
  betaald: boolean;
  lastUpdate: {
    status: string;
    locatie: string;
    tijdstip: string;
  };
}

// Type definitie voor statistieken
interface DashboardStats {
  totaalZendingen: number;
  actieveZendingen: number;
  afgeleverd: number;
  gemiddeldeLeveringstijd: string;
  klanttevredenheid: string;
}

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
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  
  // State voor zendingen en statistieken
  const [zendingen, setZendingen] = useState<Zending[]>([]);
  const [statsData, setStatsData] = useState<DashboardStats>({
    totaalZendingen: 0,
    actieveZendingen: 0,
    afgeleverd: 0,
    gemiddeldeLeveringstijd: "0.0 dagen",
    klanttevredenheid: "0.0 / 5"
  });
  const [loadingZendingen, setLoadingZendingen] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Authentication check
  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Niet ingelogd",
        description: "U moet ingelogd zijn om het dashboard te bekijken.",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation, toast]);
  
  // Haal zendingen op van de API
  useEffect(() => {
    const fetchZendingen = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoadingZendingen(true);
        const response = await fetch("/api/zendingen");
        
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van zendingen");
        }
        
        const data = await response.json();
        setZendingen(data);
      } catch (error) {
        console.error("Error fetching zendingen:", error);
        toast({
          title: "Fout bij het laden van zendingen",
          description: "Er is een probleem opgetreden bij het ophalen van uw zendingen.",
          variant: "destructive",
        });
      } finally {
        setLoadingZendingen(false);
      }
    };
    
    fetchZendingen();
  }, [isAuthenticated, toast]);
  
  // Haal dashboard statistieken op
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoadingStats(true);
        const response = await fetch("/api/dashboard/stats");
        
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van statistieken");
        }
        
        const data = await response.json();
        setStatsData(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Fout bij het laden van statistieken",
          description: "Er is een probleem opgetreden bij het ophalen van dashboardgegevens.",
          variant: "destructive",
        });
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchStats();
  }, [isAuthenticated, toast]);

  // Functie om zendingen te filteren op basis van zoekopdracht
  const filterZendingen = (zendingenData: Zending[]) => {
    if (!searchQuery) return zendingenData;
    
    return zendingenData.filter(zending => 
      zending.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zending.verzender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zending.ontvanger.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredZendingen = filterZendingen(zendingen);

  const handleLogout = () => {
    logout(); // This will use the logout function from useAuth
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
              <span className="text-sm font-medium">
                {user ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) : "Laden..."}
              </span>
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
                    {loadingStats ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-100 rounded mt-1"></div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{statsData.actieveZendingen}</div>
                        <p className="text-xs text-gray-500">van {statsData.totaalZendingen} zendingen</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Gem. Leveringstijd</CardTitle>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-100 rounded mt-1"></div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{statsData.gemiddeldeLeveringstijd}</div>
                        <p className="text-xs text-gray-500">laatste 30 dagen</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Klanttevredenheid</CardTitle>
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-100 rounded mt-1"></div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{statsData.klanttevredenheid}</div>
                        <p className="text-xs text-gray-500">laatste 30 dagen</p>
                      </>
                    )}
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
                  {loadingZendingen ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg">
                          <div className="animate-pulse">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                              <div className="h-4 w-32 bg-gray-200 rounded"></div>
                              <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-48 bg-gray-100 rounded"></div>
                              <div className="h-4 w-56 bg-gray-100 rounded"></div>
                              <div className="h-4 w-56 bg-gray-100 rounded"></div>
                            </div>
                            <div className="flex justify-end mt-3">
                              <div className="h-8 w-24 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredZendingen.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="flex justify-center">
                        <Package className="h-16 w-16 text-gray-300" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Geen zendingen gevonden</h3>
                      <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        {searchQuery 
                          ? "Er zijn geen zendingen die overeenkomen met uw zoekopdracht"
                          : "U heeft nog geen zendingen. Klik op 'Nieuwe Zending' om te beginnen."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredZendingen.map((zending: Zending) => (
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
                  )}
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
                  {loadingZendingen ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>
                        ))}
                      </div>
                    </div>
                  ) : filteredZendingen.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="flex justify-center">
                        <Package className="h-16 w-16 text-gray-300" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Geen zendingen gevonden</h3>
                      <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        {searchQuery 
                          ? "Er zijn geen zendingen die overeenkomen met uw zoekopdracht"
                          : "U heeft nog geen zendingen. Klik op 'Nieuwe Zending' om te beginnen."}
                      </p>
                    </div>
                  ) : (
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
                          {filteredZendingen.map((zending: Zending) => (
                            <tr key={zending.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{zending.trackingCode}</td>
                              <td className="py-3 px-4">
                                <StatusBadge status={zending.status} />
                              </td>
                              <td className="py-3 px-4 text-sm">{formatDate(zending.verzendDatum)}</td>
                              <td className="py-3 px-4 text-sm">{formatDate(zending.geplanndeAfleverDatum)}</td>
                              <td className="py-3 px-4">{zending.ontvanger}</td>
                              <td className="py-3 px-4 font-medium">{zending.prijs}</td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm">Details</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Statistieken tab */}
            <TabsContent value="statistieken" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Uw Statistieken</CardTitle>
                  <CardDescription>
                    Inzicht in uw transportactiviteiten
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="animate-pulse space-y-6">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-64 bg-gray-100 rounded w-full"></div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Zendingen per Status</CardTitle>
                          </CardHeader>
                          <CardContent className="h-64 flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="h-16 w-16 mx-auto text-gray-300" />
                              <p className="mt-4 text-sm text-gray-500">Grafiek met statusverdeling</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Zendingen over Tijd</CardTitle>
                          </CardHeader>
                          <CardContent className="h-64 flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="h-16 w-16 mx-auto text-gray-300" />
                              <p className="mt-4 text-sm text-gray-500">Grafiek met zendingen per periode</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Gedetailleerde Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Totaal Zendingen</div>
                              <div className="text-2xl font-bold">{statsData.totaalZendingen}</div>
                            </div>
                            <div className="border rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Actieve Zendingen</div>
                              <div className="text-2xl font-bold">{statsData.actieveZendingen}</div>
                            </div>
                            <div className="border rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Gem. Leveringstijd</div>
                              <div className="text-2xl font-bold">{statsData.gemiddeldeLeveringstijd}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}