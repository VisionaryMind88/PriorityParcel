import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Package, Clock, CheckCircle, Truck } from "lucide-react";

const trackSchema = z.object({
  trackingCode: z.string().min(8, { message: "Voer een geldige tracking code in (minimaal 8 tekens)" }),
});

type TrackingFormValues = z.infer<typeof trackSchema>;

// Voorbeeldgegevens voor tracking status
// In een echte implementatie zou dit van de API komen
const mockShipmentStatus = {
  orderId: "PNL12345678",
  status: "in_transit",
  estimatedDelivery: "2025-05-13T14:00:00",
  sender: "Kantoor Supplies B.V.",
  recipient: "Tech Solutions N.V.",
  currentLocation: "Distributiecentrum Amsterdam",
  timestamps: [
    { time: "2025-05-11T08:15:00", status: "Pakket opgehaald bij verzender", icon: Package },
    { time: "2025-05-11T10:30:00", status: "Aangekomen bij sorteercentrum Utrecht", icon: MapPin },
    { time: "2025-05-11T14:45:00", status: "Pakket onderweg naar bestemmingslocatie", icon: Truck },
    { time: "2025-05-13T12:00:00", status: "Verwachte levering (14:00 - 16:00)", icon: Clock, isFuture: true },
  ],
};

export default function TrackAndTracePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState<typeof mockShipmentStatus | null>(null);
  
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      trackingCode: "",
    },
  });

  const onSubmit = async (data: TrackingFormValues) => {
    setIsLoading(true);
    
    try {
      // In een echte implementatie zou hier een API-call staan
      // await apiRequest(`/api/tracking/${data.trackingCode}`);
      
      // Voor demo doeleinden gebruiken we mock data
      setTimeout(() => {
        if (data.trackingCode.toUpperCase() === "PNL12345678") {
          setShipmentData(mockShipmentStatus);
        } else {
          toast({
            title: "Tracking code niet gevonden",
            description: "Controleer de ingevoerde code en probeer het opnieuw.",
            variant: "destructive",
          });
          setShipmentData(null);
        }
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error tracking shipment:", error);
      toast({
        title: "Er is iets misgegaan",
        description: "We konden de tracking informatie niet ophalen. Probeer het later nog eens.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Helper functie om datum te formatteren
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Track & Trace
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Volg de status en locatie van uw zending in realtime. Voer uw tracking code in om gedetailleerde informatie over uw pakket te zien.
              </p>
            </div>

            <Card className="bg-white shadow-md mb-8">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="trackingCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tracking Code</FormLabel>
                          <div className="flex space-x-3">
                            <FormControl>
                              <Input 
                                placeholder="Bijv. PNL12345678" 
                                className="flex-grow" 
                                {...field} 
                              />
                            </FormControl>
                            <Button 
                              type="submit" 
                              className="bg-primary hover:bg-primary/90" 
                              disabled={isLoading}
                            >
                              {isLoading ? "Zoeken..." : "Zoeken"}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                
                {isLoading && (
                  <div className="py-8 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-600">Tracking informatie ophalen...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {!isLoading && shipmentData && (
              <div className="space-y-6">
                <Card className="bg-white shadow-md">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Zending details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tracking Code:</span>
                            <span className="font-medium">{shipmentData.orderId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium capitalize text-primary">
                              {shipmentData.status === 'in_transit' ? 'Onderweg' : 'Afgeleverd'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Geschatte leverdatum:</span>
                            <span className="font-medium">{formatDate(shipmentData.estimatedDelivery)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Huidige locatie:</span>
                            <span className="font-medium">{shipmentData.currentLocation}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Verzending details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Verzender:</span>
                            <span className="font-medium">{shipmentData.sender}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ontvanger:</span>
                            <span className="font-medium">{shipmentData.recipient}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-6">Bezorgstatus</h3>
                    <div className="relative">
                      {/* Verticale tijdlijn */}
                      <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                      
                      {/* Tijdlijn gebeurtenissen */}
                      <div className="space-y-8">
                        {shipmentData.timestamps.map((event, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full mr-4 ${event.isFuture ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white'}`}>
                              {event.icon && <event.icon size={20} />}
                            </div>
                            <div>
                              <p className={`font-medium ${event.isFuture ? 'text-gray-500' : 'text-gray-900'}`}>
                                {event.status}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(event.time)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Tip sectie */}
            <div className="mt-10 text-center">
              <p className="text-gray-600 text-sm">
                <strong>TIP:</strong> Gebruik voor de demo de tracking code PNL12345678
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}