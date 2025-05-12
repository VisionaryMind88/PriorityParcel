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
      } else if (user && user.role !== "admin") {
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
      if (!isAuthenticated || !user || user.role !== "admin") return;
      
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
      if (!isAuthenticated || !user || user.role !== "admin") return;
      
      try {
        setLoadingKlanten(true);
        // In een echte implementatie zou dit een aparte API endpoint zijn
        const response = await fetch("/api/admin/klanten");
        
        if (!response.ok) {
          // Voor demo gebruiken we de gegevens die we hebben
          // In een echte implementatie zou dit een foutmelding geven
          const demoKlanten: Klant[] = [
            {
              id: 1,
              username: "husobosna",
              email: "husobosna8@gmail.com",
              firstName: "Huso",
              lastName: "Bosna",
              bedrijf: "Huso Logistics B.V.",
              telefoon: "+31 6 12345678",
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              isActive: true
            },
            {
              id: 2,
              username: "johndoe",
              email: "john.doe@example.com",
              firstName: "John",
              lastName: "Doe",
              bedrijf: "Voorbeeld BV",
              telefoon: "+31 6 87654321",
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              isActive: true
            }
          ];
          setKlanten(demoKlanten);
          return;
        }
        
        const data = await response.json();
        setKlanten(data);
      } catch (error) {
        console.error("Error fetching klanten:", error);
        // Voor demo gebruiken we de gegevens die we hebben
        const demoKlanten: Klant[] = [
          {
            id: 1,
            username: "husobosna",
            email: "husobosna8@gmail.com",
            firstName: "Huso",
            lastName: "Bosna",
            bedrijf: "Huso Logistics B.V.",
            telefoon: "+31 6 12345678",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true
          },
          {
            id: 2,
            username: "johndoe",
            email: "john.doe@example.com",
            firstName: "John",
            lastName: "Doe",
            bedrijf: "Voorbeeld BV",
            telefoon: "+31 6 87654321",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          }
        ];
        setKlanten(demoKlanten);
      } finally {
        setLoadingKlanten(false);
      }
    };
    
    fetchKlanten();
  }, [isAuthenticated, user, toast]);
  
  // Haal alle zendingen op
  useEffect(() => {
    const fetchZendingen = async () => {
      if (!isAuthenticated || !user || user.role !== "admin") return;
      
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
      if (!isAuthenticated || !user || user.role !== "admin") return;
      
      try {
        setLoadingContactMessages(true);
        // In een echte implementatie zou dit een aparte API endpoint zijn
        const response = await fetch("/api/admin/contact");
        
        if (!response.ok) {
          // Voor demo gebruiken we mock data
          const demoContactMessages: ContactMessage[] = [
            {
              id: 1,
              naam: "Peter Jansen",
              email: "p.jansen@example.com",
              telefoon: "+31 6 12345678",
              bedrijf: "Jansen Transport",
              bericht: "Ik zou graag meer informatie willen over jullie internationale transportdiensten.",
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              isBeantwoord: false
            },
            {
              id: 2,
              naam: "Anna de Vries",
              email: "anna.devries@example.com",
              telefoon: "+31 6 23456789",
              bedrijf: null,
              bericht: "Kunnen jullie ook kleine pakketten bezorgen in België?",
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              isBeantwoord: true
            }
          ];
          setContactMessages(demoContactMessages);
          return;
        }
        
        const data = await response.json();
        setContactMessages(data);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
        // Voor demo gebruiken we mock data
        const demoContactMessages: ContactMessage[] = [
          {
            id: 1,
            naam: "Peter Jansen",
            email: "p.jansen@example.com",
            telefoon: "+31 6 12345678",
            bedrijf: "Jansen Transport",
            bericht: "Ik zou graag meer informatie willen over jullie internationale transportdiensten.",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isBeantwoord: false
          },
          {
            id: 2,
            naam: "Anna de Vries",
            email: "anna.devries@example.com",
            telefoon: "+31 6 23456789",
            bedrijf: null,
            bericht: "Kunnen jullie ook kleine pakketten bezorgen in België?",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            isBeantwoord: true
          }
        ];
        setContactMessages(demoContactMessages);
      } finally {
        setLoadingContactMessages(false);
      }
    };
    
    fetchContactMessages();
  }, [isAuthenticated, user, toast]);
  
  // Haal alle prijsoffertes op
  useEffect(() => {
    const fetchPrijsOffertes = async () => {
      if (!isAuthenticated || !user || user.role !== "admin") return;
      
      try {
        setLoadingPrijsOffertes(true);
        // In een echte implementatie zou dit een aparte API endpoint zijn
        const response = await fetch("/api/admin/prijsoffertes");
        
        if (!response.ok) {
          // Voor demo gebruiken we mock data
          const demoPrijsOffertes: PrijsOfferte[] = [
            {
              id: 1,
              naam: "Karel Bakker",
              email: "k.bakker@example.com",
              telefoon: "+31 6 34567890",
              bedrijf: "Bakker & Zonen",
              transportType: "nationaal",
              gewicht: "20-50",
              afmetingen: "groot",
              spoed: "standaard",
              opmerkingen: "Levering moet op werkdagen tussen 9 en 17 uur.",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              isVerwerkt: false
            },
            {
              id: 2,
              naam: "Sophie van Dijk",
              email: "sophie.vandijk@example.com",
              telefoon: "+31 6 45678901",
              bedrijf: null,
              transportType: "internationaal",
              gewicht: "10-20",
              afmetingen: "middel",
              spoed: "spoed",
              opmerkingen: null,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              isVerwerkt: true
            }
          ];
          setPrijsOffertes(demoPrijsOffertes);
          return;
        }
        
        const data = await response.json();
        setPrijsOffertes(data);
      } catch (error) {
        console.error("Error fetching prijsoffertes:", error);
        // Voor demo gebruiken we mock data
        const demoPrijsOffertes: PrijsOfferte[] = [
          {
            id: 1,
            naam: "Karel Bakker",
            email: "k.bakker@example.com",
            telefoon: "+31 6 34567890",
            bedrijf: "Bakker & Zonen",
            transportType: "nationaal",
            gewicht: "20-50",
            afmetingen: "groot",
            spoed: "standaard",
            opmerkingen: "Levering moet op werkdagen tussen 9 en 17 uur.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isVerwerkt: false
          },
          {
            id: 2,
            naam: "Sophie van Dijk",
            email: "sophie.vandijk@example.com",
            telefoon: "+31 6 45678901",
            bedrijf: null,
            transportType: "internationaal",
            gewicht: "10-20",
            afmetingen: "middel",
            spoed: "spoed",
            opmerkingen: null,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isVerwerkt: true
          }
        ];
        setPrijsOffertes(demoPrijsOffertes);
      } finally {
        setLoadingPrijsOffertes(false);
      }
    };
    
    fetchPrijsOffertes();
  }, [isAuthenticated, user, toast]);

  // Filter functies
  const filterZendingen = (zendingenData: Zending[]) => {
    let filteredData = zendingenData;
    
    // Filter op status indien niet 'alle'
    if (statusFilter !== "alle") {
      filteredData = filteredData.filter(zending => zending.status === statusFilter);
    }
    
    // Filter op zoekopdracht
    if (searchQuery) {
      filteredData = filteredData.filter(zending => 
        zending.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zending.verzender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zending.ontvanger.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredData;
  };
  
  const filterKlanten = (klantenData: Klant[]) => {
    if (!searchQuery) return klantenData;
    
    return klantenData.filter(klant => 
      (klant.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (klant.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      ((klant.firstName || "") + " " + (klant.lastName || "")).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (klant.bedrijf?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  };
  
  const filterContactMessages = (messagesData: ContactMessage[]) => {
    if (!searchQuery) return messagesData;
    
    return messagesData.filter(message => 
      message.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (message.bedrijf?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      message.bericht.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filterPrijsOffertes = (offertesData: PrijsOfferte[]) => {
    if (!searchQuery) return offertesData;
    
    return offertesData.filter(offerte => 
      offerte.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offerte.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offerte.bedrijf?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (offerte.opmerkingen?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  };

  // Gefilterde data
  const filteredZendingen = filterZendingen(zendingen);
  const filteredKlanten = filterKlanten(klanten);
  const filteredContactMessages = filterContactMessages(contactMessages);
  const filteredPrijsOffertes = filterPrijsOffertes(prijsOffertes);
  
  // Aantal onbeantwoorde berichten en niet-verwerkte offertes
  const nieuweBerichtenCount = contactMessages.filter(message => !message.isBeantwoord).length;
  const nieuweOffertesCount = prijsOffertes.filter(offerte => !offerte.isVerwerkt).length;

  // Logout handler
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-sm border-r">
        <div className="p-4 border-b bg-primary text-white">
          <h2 className="text-xl font-bold">PriorityParcel</h2>
          <p className="text-sm opacity-80">Admin Dashboard</p>
        </div>
        
        <div className="flex-1 py-4 space-y-1 px-2">
          <SidebarItem icon={Home} label="Dashboard" active={activeSidebarItem === "dashboard"} onClick={() => {
            setActiveSidebarItem("dashboard");
            setActiveTab("overzicht");
          }} />
          <SidebarItem icon={Users} label="Klanten" onClick={() => {
            setActiveSidebarItem("klanten");
            setActiveTab("klanten");
          }} />
          <SidebarItem icon={Package} label="Zendingen" onClick={() => {
            setActiveSidebarItem("zendingen");
            setActiveTab("zendingen");
          }} />
          <SidebarItem 
            icon={MessageSquare} 
            label={"Contactberichten" + (nieuweBerichtenCount > 0 ? ` (${nieuweBerichtenCount})` : "")}
            onClick={() => {
              setActiveSidebarItem("berichten");
              setActiveTab("berichten");
            }} 
          />
          <SidebarItem 
            icon={FileText}
            label={"Prijsoffertes" + (nieuweOffertesCount > 0 ? ` (${nieuweOffertesCount})` : "")}
            onClick={() => {
              setActiveSidebarItem("offertes");
              setActiveTab("offertes");
            }} 
          />
          <SidebarItem icon={BarChart3} label="Rapportages" onClick={() => {
            setActiveSidebarItem("rapportages");
            setActiveTab("rapportages");
          }} />
          <SidebarItem icon={Settings} label="Instellingen" onClick={() => {
            setActiveSidebarItem("instellingen");
            setActiveTab("instellingen");
          }} />
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
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Zoeken..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              {(nieuweBerichtenCount + nieuweOffertesCount) > 0 && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">
                {user ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) : "Admin"}
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
                <TabsTrigger value="klanten">Klanten</TabsTrigger>
                <TabsTrigger value="zendingen">Zendingen</TabsTrigger>
                <TabsTrigger value="berichten">Berichten {nieuweBerichtenCount > 0 && `(${nieuweBerichtenCount})`}</TabsTrigger>
                <TabsTrigger value="offertes">Offertes {nieuweOffertesCount > 0 && `(${nieuweOffertesCount})`}</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Overzicht tab */}
            <TabsContent value="overzicht" className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <CardTitle className="text-sm font-medium">Klanten</CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    {loadingKlanten ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-100 rounded mt-1"></div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{klanten.length}</div>
                        <p className="text-xs text-gray-500">geregistreerde klanten</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Berichten</CardTitle>
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    {loadingContactMessages ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-100 rounded mt-1"></div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{nieuweBerichtenCount}</div>
                        <p className="text-xs text-gray-500">onbeantwoorde berichten</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Offertes</CardTitle>
                    <FileText className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    {loadingPrijsOffertes ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-100 rounded mt-1"></div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{nieuweOffertesCount}</div>
                        <p className="text-xs text-gray-500">nieuwe prijsaanvragen</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Recente activiteiten */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recente zendingen */}
                <Card>
                  <CardHeader className="flex justify-between">
                    <div>
                      <CardTitle>Recente Zendingen</CardTitle>
                      <CardDescription>Meest recente verzendingen</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("zendingen")}>
                      Alle zendingen
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loadingZendingen ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="animate-pulse">
                              <div className="flex justify-between mb-2">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                              </div>
                              <div className="h-3 w-48 bg-gray-100 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : zendingen.length === 0 ? (
                      <div className="text-center py-6">
                        <Package className="h-10 w-10 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-500">Geen zendingen beschikbaar</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {zendingen.slice(0, 5).map((zending) => (
                          <div key={zending.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{zending.trackingCode}</span>
                                <StatusBadge status={zending.status} />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {zending.ontvanger} • {formatDate(zending.verzendDatum)}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recente berichten */}
                <Card>
                  <CardHeader className="flex justify-between">
                    <div>
                      <CardTitle>Nieuwe Berichten</CardTitle>
                      <CardDescription>Onbeantwoorde contactberichten</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("berichten")}>
                      Alle berichten
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loadingContactMessages ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="animate-pulse">
                              <div className="flex justify-between mb-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                              </div>
                              <div className="h-3 w-full bg-gray-100 rounded"></div>
                              <div className="h-3 w-3/4 bg-gray-100 rounded mt-1"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : contactMessages.filter(msg => !msg.isBeantwoord).length === 0 ? (
                      <div className="text-center py-6">
                        <MessageSquare className="h-10 w-10 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-500">Geen nieuwe berichten</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {contactMessages.filter(msg => !msg.isBeantwoord).slice(0, 5).map((message) => (
                          <div key={message.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start">
                            <div>
                              <div className="font-medium">{message.naam}</div>
                              <p className="text-xs text-gray-500">{message.email} • {formatDate(message.createdAt)}</p>
                              <p className="text-sm mt-1 line-clamp-2">{message.bericht}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Klanten tab */}
            <TabsContent value="klanten" className="space-y-6">
              <Card>
                <CardHeader className="flex justify-between">
                  <div>
                    <CardTitle>Klantenoverzicht</CardTitle>
                    <CardDescription>Beheer alle klantaccounts</CardDescription>
                  </div>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nieuwe Klant
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingKlanten ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>
                        ))}
                      </div>
                    </div>
                  ) : filteredKlanten.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="flex justify-center">
                        <Users className="h-16 w-16 text-gray-300" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Geen klanten gevonden</h3>
                      <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        {searchQuery 
                          ? "Er zijn geen klanten die overeenkomen met uw zoekopdracht"
                          : "Er zijn nog geen klanten aangemaakt in het systeem."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="py-3 px-4 font-medium">Naam</th>
                            <th className="py-3 px-4 font-medium">Email</th>
                            <th className="py-3 px-4 font-medium">Bedrijf</th>
                            <th className="py-3 px-4 font-medium">Telefoon</th>
                            <th className="py-3 px-4 font-medium">Geregistreerd</th>
                            <th className="py-3 px-4 font-medium">Laatst ingelogd</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Acties</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredKlanten.map((klant) => (
                            <tr key={klant.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">
                                {klant.firstName && klant.lastName 
                                  ? `${klant.firstName} ${klant.lastName}` 
                                  : klant.username}
                              </td>
                              <td className="py-3 px-4">{klant.email}</td>
                              <td className="py-3 px-4">{klant.bedrijf || "-"}</td>
                              <td className="py-3 px-4">{klant.telefoon || "-"}</td>
                              <td className="py-3 px-4 text-sm">{formatDate(klant.createdAt)}</td>
                              <td className="py-3 px-4 text-sm">{klant.lastLogin ? formatDate(klant.lastLogin) : "Nooit"}</td>
                              <td className="py-3 px-4">
                                <Badge variant={klant.isActive ? "default" : "destructive"}>
                                  {klant.isActive ? "Actief" : "Inactief"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
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
            </TabsContent>
            
            {/* Zendingen tab */}
            <TabsContent value="zendingen" className="space-y-6">
              <Card>
                <CardHeader className="flex justify-between">
                  <div>
                    <CardTitle>Alle Zendingen</CardTitle>
                    <CardDescription>Beheer en monitor alle zendingen</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Alle statussen" />
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
                    <Button>
                      <Truck className="mr-2 h-4 w-4" />
                      Nieuwe Zending
                    </Button>
                  </div>
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
                        {searchQuery || statusFilter !== "alle"
                          ? "Er zijn geen zendingen die overeenkomen met uw filters"
                          : "Er zijn nog geen zendingen aangemaakt in het systeem."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="py-3 px-4 font-medium">Tracking Code</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Verzender</th>
                            <th className="py-3 px-4 font-medium">Ontvanger</th>
                            <th className="py-3 px-4 font-medium">Verzonden</th>
                            <th className="py-3 px-4 font-medium">Verwachte levering</th>
                            <th className="py-3 px-4 font-medium">Prioriteit</th>
                            <th className="py-3 px-4 font-medium">Prijs</th>
                            <th className="py-3 px-4 font-medium">Betaald</th>
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
                              <td className="py-3 px-4">{zending.verzender}</td>
                              <td className="py-3 px-4">{zending.ontvanger}</td>
                              <td className="py-3 px-4 text-sm">{formatDate(zending.verzendDatum)}</td>
                              <td className="py-3 px-4 text-sm">{formatDate(zending.geplanndeAfleverDatum)}</td>
                              <td className="py-3 px-4">
                                <Badge variant={zending.prioriteit === "spoed" ? "destructive" : zending.prioriteit === "extra-spoed" ? "destructive" : "outline"}>
                                  {zending.prioriteit}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 font-medium">{zending.prijs}</td>
                              <td className="py-3 px-4">
                                <Badge variant={zending.betaald ? "default" : "destructive"}>
                                  {zending.betaald ? "Betaald" : "Niet betaald"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
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
            </TabsContent>
            
            {/* Berichten tab */}
            <TabsContent value="berichten" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contactberichten</CardTitle>
                  <CardDescription>Beheer berichten van de contactpagina</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingContactMessages ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-24 bg-gray-100 rounded w-full"></div>
                        ))}
                      </div>
                    </div>
                  ) : filteredContactMessages.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="flex justify-center">
                        <MessageSquare className="h-16 w-16 text-gray-300" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Geen berichten gevonden</h3>
                      <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        {searchQuery 
                          ? "Er zijn geen berichten die overeenkomen met uw zoekopdracht"
                          : "Er zijn nog geen contactberichten ontvangen."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredContactMessages.map((message) => (
                        <Card key={message.id} className={`overflow-hidden ${!message.isBeantwoord ? 'border-l-4 border-l-blue-500' : ''}`}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <CardTitle className="flex items-center">
                                  <span>{message.naam}</span>
                                  {!message.isBeantwoord && (
                                    <Badge className="ml-2" variant="default">Nieuw</Badge>
                                  )}
                                </CardTitle>
                                <CardDescription>
                                  {message.email} • {message.telefoon} {message.bedrijf ? `• ${message.bedrijf}` : ''}
                                </CardDescription>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(message.createdAt)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="whitespace-pre-line">{message.bericht}</p>
                          </CardContent>
                          <div className="px-6 pb-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              {message.isBeantwoord ? "Al beantwoord" : "Markeer als beantwoord"}
                            </Button>
                            <Button size="sm">
                              <Mail className="mr-2 h-4 w-4" />
                              Beantwoorden
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Offertes tab */}
            <TabsContent value="offertes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prijsoffertes</CardTitle>
                  <CardDescription>Beheer prijsaanvragen van klanten</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPrijsOffertes ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-24 bg-gray-100 rounded w-full"></div>
                        ))}
                      </div>
                    </div>
                  ) : filteredPrijsOffertes.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="flex justify-center">
                        <FileText className="h-16 w-16 text-gray-300" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Geen offertes gevonden</h3>
                      <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        {searchQuery 
                          ? "Er zijn geen offertes die overeenkomen met uw zoekopdracht"
                          : "Er zijn nog geen prijsoffertes aangevraagd."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredPrijsOffertes.map((offerte) => (
                        <Card key={offerte.id} className={`overflow-hidden ${!offerte.isVerwerkt ? 'border-l-4 border-l-green-500' : ''}`}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <CardTitle className="flex items-center">
                                  <span>{offerte.naam}</span>
                                  {!offerte.isVerwerkt && (
                                    <Badge className="ml-2" variant="default">Nieuw</Badge>
                                  )}
                                </CardTitle>
                                <CardDescription>
                                  {offerte.email} • {offerte.telefoon} {offerte.bedrijf ? `• ${offerte.bedrijf}` : ''}
                                </CardDescription>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(offerte.createdAt)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Transport Type</p>
                                <p className="font-medium">{offerte.transportType}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Gewicht</p>
                                <p className="font-medium">{offerte.gewicht} kg</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Afmetingen</p>
                                <p className="font-medium">{offerte.afmetingen}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Spoed</p>
                                <p className="font-medium">{offerte.spoed}</p>
                              </div>
                            </div>
                            {offerte.opmerkingen && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Opmerkingen</p>
                                <p className="text-sm whitespace-pre-line">{offerte.opmerkingen}</p>
                              </div>
                            )}
                          </CardContent>
                          <div className="px-6 pb-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              {offerte.isVerwerkt ? "Al verwerkt" : "Markeer als verwerkt"}
                            </Button>
                            <Button size="sm">
                              <Mail className="mr-2 h-4 w-4" />
                              Offerte opstellen
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Instellingen tab - eenvoudige placeholder versie */}
            <TabsContent value="instellingen" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Systeeminstellingen</CardTitle>
                  <CardDescription>Beheer de instellingen van het admin dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Algemene instellingen</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1.5">Bedrijfsnaam</label>
                          <Input defaultValue="PriorityParcel" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1.5">Contact Email</label>
                          <Input defaultValue="info@priorityparcel.nl" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notificatie instellingen</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email notificaties</p>
                          <p className="text-sm text-gray-500">Ontvang email bij nieuwe berichten</p>
                        </div>
                        <div>
                          <Button variant="outline">Inschakelen</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dashboard notificaties</p>
                          <p className="text-sm text-gray-500">Toon notificaties in het dashboard</p>
                        </div>
                        <div>
                          <Button>Uitschakelen</Button>
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