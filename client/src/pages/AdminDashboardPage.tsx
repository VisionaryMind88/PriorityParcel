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
  UserPlus,
  FileText,
  MessageSquare,
  Mail,
  Eye,
  Pencil,
  Trash,
  Filter,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
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

interface DashboardStats {
  totaalZendingen: number;
  actieveZendingen: number;
  afgeleverd: number;
  gemiddeldeLeveringstijd: string;
  klanttevredenheid: string;
}

interface Klant {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  bedrijf: string | null;
  telefoon: string | null;
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
}

interface ContactMessage {
  id: number;
  naam: string;
  email: string;
  telefoon: string;
  bedrijf: string | null;
  bericht: string;
  createdAt: string;
  isBeantwoord: boolean;
}

interface PrijsOfferte {
  id: number;
  naam: string;
  email: string;
  telefoon: string;
  bedrijf: string | null;
  transportType: string;
  gewicht: string;
  afmetingen: string;
  spoed: string;
  opmerkingen: string | null;
  createdAt: string;
  isVerwerkt: boolean;
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
        active ? "bg-amber-600 text-white" : "hover:bg-gray-100"
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
  if (!dateString) return "Niet beschikbaar";
  
  const date = new Date(dateString);
  return date.toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overzicht");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  
  // States voor alle data
  const [statsData, setStatsData] = useState<DashboardStats>({
    totaalZendingen: 0,
    actieveZendingen: 0,
    afgeleverd: 0,
    gemiddeldeLeveringstijd: "0.0 dagen",
    klanttevredenheid: "0.0 / 5"
  });
  const [zendingen, setZendingen] = useState<Zending[]>([]);
  const [klanten, setKlanten] = useState<Klant[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [prijsOffertes, setPrijsOffertes] = useState<PrijsOfferte[]>([]);
  
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingZendingen, setLoadingZendingen] = useState(true);
  const [loadingKlanten, setLoadingKlanten] = useState(true);
  const [loadingContactMessages, setLoadingContactMessages] = useState(true);
  const [loadingPrijsOffertes, setLoadingPrijsOffertes] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("alle");
  
  // Authentication en admin-check
  useEffect(() => {
    // Check of de gebruiker is ingelogd en admin is
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Niet ingelogd",
          description: "U moet ingelogd zijn om het admin dashboard te bekijken.",
          variant: "destructive",
        });
        setLocation("/login");
      } else if (user && (user as any).role !== "admin") {
        toast({
          title: "Geen toegang",
          description: "U heeft geen admin rechten om deze pagina te bekijken.",
          variant: "destructive",
        });
        setLocation("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, setLocation, toast]);

  // Haal dashboard statistieken op
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || !user || (user as any).role !== "admin") return;
      
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
  }, [isAuthenticated, user, toast]);
  
  // Haal alle klanten op
  useEffect(() => {
    const fetchKlanten = async () => {
      if (!isAuthenticated || !user || (user as any).role !== "admin") return;
      
      try {
        setLoadingKlanten(true);
        const response = await fetch("/api/admin/klanten", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van klanten");
        }
        
        const data = await response.json();
        setKlanten(data);
      } catch (error) {
        console.error("Error fetching klanten:", error);
        toast({
          title: "Fout bij het laden van klanten",
          description: "Er is een probleem opgetreden bij het ophalen van klantgegevens.",
          variant: "destructive",
        });
      } finally {
        setLoadingKlanten(false);
      }
    };
    
    fetchKlanten();
  }, [isAuthenticated, user, toast]);
  
  // Haal alle zendingen op
  useEffect(() => {
    const fetchZendingen = async () => {
      if (!isAuthenticated || !user || (user as any).role !== "admin") return;
      
      try {
        setLoadingZendingen(true);
        const response = await fetch("/api/zendingen", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van zendingen");
        }
        
        const data = await response.json();
        setZendingen(data);
      } catch (error) {
        console.error("Error fetching zendingen:", error);
        toast({
          title: "Fout bij het laden van zendingen",
          description: "Er is een probleem opgetreden bij het ophalen van zendingen.",
          variant: "destructive",
        });
      } finally {
        setLoadingZendingen(false);
      }
    };
    
    fetchZendingen();
  }, [isAuthenticated, user, toast]);
  
  // Haal alle contactberichten op
  useEffect(() => {
    const fetchContactMessages = async () => {
      if (!isAuthenticated || !user || (user as any).role !== "admin") return;
      
      try {
        setLoadingContactMessages(true);
        const response = await fetch("/api/admin/contact", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van contactberichten");
        }
        
        const data = await response.json();
        setContactMessages(data);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
        toast({
          title: "Fout bij het laden van berichten",
          description: "Er is een probleem opgetreden bij het ophalen van contactberichten.",
          variant: "destructive",
        });
      } finally {
        setLoadingContactMessages(false);
      }
    };
    
    fetchContactMessages();
  }, [isAuthenticated, user, toast]);
  
  // Haal alle prijsoffertes op
  useEffect(() => {
    const fetchPrijsOffertes = async () => {
      if (!isAuthenticated || !user || (user as any).role !== "admin") return;
      
      try {
        setLoadingPrijsOffertes(true);
        const response = await fetch("/api/admin/prijsoffertes", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van prijsoffertes");
        }
        
        const data = await response.json();
        setPrijsOffertes(data);
      } catch (error) {
        console.error("Error fetching prijsoffertes:", error);
        toast({
          title: "Fout bij het laden van offertes",
          description: "Er is een probleem opgetreden bij het ophalen van prijsoffertes.",
          variant: "destructive",
        });
      } finally {
        setLoadingPrijsOffertes(false);
      }
    };
    
    fetchPrijsOffertes();
  }, [isAuthenticated, user, toast]);

  // Filter functies
  const filterZendingen = (zendingenData: Zending[]) => {
    // Filter op status indien van toepassing
    let filteredData = statusFilter !== "alle" 
      ? zendingenData.filter(z => z.status === statusFilter)
      : zendingenData;
      
    // Filter op zoekterm indien van toepassing
    if (!searchQuery) return filteredData;
    
    return filteredData.filter(zending => 
      zending.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zending.verzender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zending.ontvanger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zending.afleveradres.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filterKlanten = (klantenData: Klant[]) => {
    if (!searchQuery) return klantenData;
    
    return klantenData.filter(klant => 
      `${klant.firstName} ${klant.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      klant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (klant.bedrijf && klant.bedrijf.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  const filterContactMessages = (messagesData: ContactMessage[]) => {
    if (!searchQuery) return messagesData;
    
    return messagesData.filter(message => 
      message.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.bericht.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (message.bedrijf && message.bedrijf.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  const filterPrijsOffertes = (offertesData: PrijsOfferte[]) => {
    if (!searchQuery) return offertesData;
    
    return offertesData.filter(offerte => 
      offerte.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offerte.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offerte.bedrijf && offerte.bedrijf.toLowerCase().includes(searchQuery.toLowerCase())) ||
      offerte.transportType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Render de admin dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col bg-white border-r">
          <div className="flex flex-col flex-grow overflow-y-auto">
            <div className="flex items-center h-16 px-4 border-b bg-amber-600 text-white">
              <Package className="mr-2 h-6 w-6" />
              <span className="text-xl font-semibold">Admin Dashboard</span>
            </div>
            
            <div className="px-3 py-4 space-y-1">
              <SidebarItem 
                icon={Home} 
                label="Dashboard" 
                active={activeSidebarItem === "dashboard"} 
                onClick={() => setActiveSidebarItem("dashboard")}
              />
              <SidebarItem 
                icon={Truck} 
                label="Zendingen" 
                active={activeSidebarItem === "zendingen"} 
                onClick={() => {
                  setActiveSidebarItem("zendingen");
                  setActiveTab("zendingen");
                }}
              />
              <SidebarItem 
                icon={Users} 
                label="Klanten" 
                active={activeSidebarItem === "klanten"} 
                onClick={() => {
                  setActiveSidebarItem("klanten");
                  setActiveTab("klanten");
                }}
              />
              <SidebarItem 
                icon={MessageSquare} 
                label="Contactberichten" 
                active={activeSidebarItem === "berichten"} 
                onClick={() => {
                  setActiveSidebarItem("berichten");
                  setActiveTab("berichten");
                }}
              />
              <SidebarItem 
                icon={FileText} 
                label="Prijsoffertes" 
                active={activeSidebarItem === "offertes"} 
                onClick={() => {
                  setActiveSidebarItem("offertes");
                  setActiveTab("offertes");
                }}
              />
              <SidebarItem 
                icon={BarChart3} 
                label="Rapporten" 
                active={activeSidebarItem === "rapporten"} 
                onClick={() => {
                  toast({
                    title: "Rapporten",
                    description: "De rapportage functie is nog in ontwikkeling.",
                  });
                }}
              />
              <SidebarItem 
                icon={Settings} 
                label="Instellingen" 
                active={activeSidebarItem === "instellingen"} 
                onClick={() => {
                  toast({
                    title: "Instellingen",
                    description: "De instellingen functie is nog in ontwikkeling.",
                  });
                }}
              />
            </div>
            
            <div className="mt-auto">
              <div className="px-3 py-4 border-t">
                <SidebarItem 
                  icon={LogOut} 
                  label="Uitloggen" 
                  onClick={() => {
                    logout();
                    setLocation("/login");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
          {/* Top navbar */}
          <div className="bg-amber-600 shadow-sm z-10 flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center space-x-3 md:hidden">
              <button className="text-white hover:text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="text-xl font-semibold text-white">Admin Dashboard</div>
            </div>
            <div className="hidden md:block text-xl font-semibold text-white">Admin Dashboard</div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="relative text-white hover:bg-amber-700"
                onClick={() => toast({
                  title: "Meldingen",
                  description: "U heeft geen nieuwe meldingen.",
                })}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-white hover:bg-amber-700"
                  onClick={() => toast({
                    title: "Gebruikersprofiel",
                    description: "Gebruikersprofiel wordt nog ontwikkeld.",
                  })}
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="hidden md:block text-sm font-medium">
                    {user?.firstName} {user?.lastName || 'Admin'}
                  </div>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <main className="flex-1 p-4 md:p-6">
            {/* Conditionally render main content based on the active tab */}
            {activeSidebarItem === "dashboard" && (
              <div className="space-y-6">
                {/* Welcome banner for admin dashboard */}
                <div className="bg-amber-600 text-white rounded-lg p-6 shadow-md">
                  <h2 className="text-2xl font-bold mb-2">Welkom in het Admin Dashboard</h2>
                  <p className="opacity-90">
                    Hier kunt u alle zendingen, klanten, contactberichten en prijsoffertes beheren en overzien.
                  </p>
                </div>
                
                {/* Stats overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Totaal Zendingen</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {loadingStats ? (
                              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                              statsData.totaalZendingen
                            )}
                          </h3>
                        </div>
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Actieve Zendingen</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {loadingStats ? (
                              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                              statsData.actieveZendingen
                            )}
                          </h3>
                        </div>
                        <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                          <Truck className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Afgeleverd</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {loadingStats ? (
                              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                              statsData.afgeleverd
                            )}
                          </h3>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Gem. Leveringstijd</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {loadingStats ? (
                              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                              statsData.gemiddeldeLeveringstijd
                            )}
                          </h3>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Additional admin stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Klanten Overzicht</CardTitle>
                      <CardDescription>Totaal aantal: {klanten.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingKlanten ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {klanten.slice(0, 5).map((klant) => (
                            <div key={klant.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User size={16} className="text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{klant.firstName} {klant.lastName}</p>
                                  <p className="text-xs text-gray-500">{klant.email}</p>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full mt-2" 
                        onClick={() => {
                          setActiveSidebarItem("klanten");
                          setActiveTab("klanten");
                        }}
                      >
                        Bekijk alle klanten
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recente Berichten</CardTitle>
                      <CardDescription>Ongelezen: {contactMessages.filter(m => !m.isBeantwoord).length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingContactMessages ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {contactMessages.slice(0, 5).map((message) => (
                            <div key={message.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <MessageSquare size={16} className="text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{message.naam}</p>
                                  <p className="text-xs text-gray-500">{message.email}</p>
                                </div>
                              </div>
                              {!message.isBeantwoord && (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Nieuw</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full mt-2" 
                        onClick={() => {
                          setActiveSidebarItem("berichten");
                          setActiveTab("berichten");
                        }}
                      >
                        Bekijk alle berichten
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Zendingen tab */}
            {activeSidebarItem === "zendingen" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-2xl font-bold">Alle Zendingen</h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Zoek op tracking code, naam, etc." 
                        className="pl-10 w-full md:w-64" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alle">Alle statussen</SelectItem>
                        <SelectItem value="gepland">Gepland</SelectItem>
                        <SelectItem value="opgehaald">Opgehaald</SelectItem>
                        <SelectItem value="onderweg">Onderweg</SelectItem>
                        <SelectItem value="afgeleverd">Afgeleverd</SelectItem>
                        <SelectItem value="vertraagd">Vertraagd</SelectItem>
                        <SelectItem value="geannuleerd">Geannuleerd</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Nieuwe Zending
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {loadingZendingen ? (
                      <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Code</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verzender</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ontvanger</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verzenddatum</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afleverdatum</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filterZendingen(zendingen).map((zending) => (
                              <tr key={zending.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="font-medium text-amber-600">{zending.trackingCode}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <StatusBadge status={zending.status} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">{zending.verzender}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{zending.ontvanger}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{formatDate(zending.verzendDatum)}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  {zending.werkelijkeAfleverDatum 
                                    ? formatDate(zending.werkelijkeAfleverDatum) 
                                    : formatDate(zending.geplanndeAfleverDatum)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Klanten tab */}
            {activeSidebarItem === "klanten" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-2xl font-bold">Klantenbeheer</h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Zoek op naam, bedrijf, e-mail..." 
                        className="pl-10 w-full md:w-64" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Nieuwe Klant
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {loadingKlanten ? (
                      <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrijf</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefoon</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geregistreerd</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laatste login</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filterKlanten(klanten).map((klant) => (
                              <tr key={klant.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="font-medium">
                                    {klant.firstName} {klant.lastName}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">{klant.email}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{klant.bedrijf || '-'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{klant.telefoon || '-'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{formatDate(klant.createdAt)}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{klant.lastLogin ? formatDate(klant.lastLogin) : '-'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    klant.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {klant.isActive ? 'Actief' : 'Inactief'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Berichten tab */}
            {activeSidebarItem === "berichten" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-2xl font-bold">Contactberichten</h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Zoek in berichten..." 
                        className="pl-10 w-full md:w-64" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full md:w-40">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle berichten</SelectItem>
                        <SelectItem value="unread">Onbeantwoord</SelectItem>
                        <SelectItem value="read">Beantwoord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {loadingContactMessages ? (
                      <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrijf</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bericht</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filterContactMessages(contactMessages).map((message) => (
                              <tr key={message.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    message.isBeantwoord 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {message.isBeantwoord ? 'Beantwoord' : 'Nieuw'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="font-medium">{message.naam}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">{message.email}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{message.bedrijf || '-'}</td>
                                <td className="px-4 py-4">
                                  <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    {message.bericht}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">{formatDate(message.createdAt)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Prijsoffertes tab */}
            {activeSidebarItem === "offertes" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-2xl font-bold">Prijsofferte Aanvragen</h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Zoek in offertes..." 
                        className="pl-10 w-full md:w-64" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full md:w-40">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle offertes</SelectItem>
                        <SelectItem value="pending">Niet verwerkt</SelectItem>
                        <SelectItem value="processed">Verwerkt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {loadingPrijsOffertes ? (
                      <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrijf</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gewicht</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afmetingen</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spoed</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filterPrijsOffertes(prijsOffertes).map((offerte) => (
                              <tr key={offerte.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    offerte.isVerwerkt 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {offerte.isVerwerkt ? 'Verwerkt' : 'Nieuw'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="font-medium">{offerte.naam}</div>
                                  <div className="text-xs text-gray-500">{offerte.email}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">{offerte.bedrijf || '-'}</td>
                                <td className="px-4 py-4 whitespace-nowrap capitalize">{offerte.transportType}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{offerte.gewicht} kg</td>
                                <td className="px-4 py-4 whitespace-nowrap capitalize">{offerte.afmetingen}</td>
                                <td className="px-4 py-4 whitespace-nowrap capitalize">{offerte.spoed}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{formatDate(offerte.createdAt)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}