import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Validatieschema voor het prijzen/offerte formulier
const priceFormSchema = z.object({
  transportType: z.enum(["nationaal", "internationaal"]),
  gewicht: z.enum(["0-5", "5-10", "10-20", "20-50", "50+"]),
  afmetingen: z.enum(["klein", "middel", "groot", "extra-groot"]),
  spoed: z.enum(["standaard", "spoed", "extra-spoed"]),
  naam: z.string().min(2, { message: "Naam moet minimaal 2 tekens bevatten" }),
  bedrijf: z.string().optional(),
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
  telefoon: z.string().min(10, { message: "Voer een geldig telefoonnummer in" }),
  ophaladres: z.string().min(5, { message: "Vul een geldig ophaladres in" }),
  afleveradres: z.string().min(5, { message: "Vul een geldig afleveradres in" }),
  bericht: z.string().optional(),
});

type PriceFormValues = z.infer<typeof priceFormSchema>;

// Indicatieve prijsinformatie
const prijsIndicaties = [
  {
    type: "nationaal",
    spoed: "standaard",
    gewicht: "0-5",
    prijs: "€7,95 - €12,95",
  },
  {
    type: "nationaal",
    spoed: "spoed",
    gewicht: "0-5",
    prijs: "€15,95 - €19,95",
  },
  {
    type: "internationaal",
    spoed: "standaard",
    gewicht: "0-5",
    prijs: "€24,95 - €39,95",
  }
];

export default function PrijzenPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prijsIndicatie, setPrijsIndicatie] = useState<string | null>(null);

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      transportType: "nationaal",
      gewicht: "0-5",
      afmetingen: "klein",
      spoed: "standaard",
      naam: "",
      bedrijf: "",
      email: "",
      telefoon: "",
      ophaladres: "",
      afleveradres: "",
      bericht: "",
    },
  });

  // Functie om een prijsindicatie op te halen
  const berekenPrijsIndicatie = (data: Partial<PriceFormValues>) => {
    // Controleer of de benodigde velden zijn ingevuld
    if (!data.transportType || !data.gewicht || !data.spoed) {
      return null;
    }

    // Zoek een match in de prijsindicaties
    const match = prijsIndicaties.find(
      (p) => 
        p.type === data.transportType && 
        p.gewicht === data.gewicht && 
        p.spoed === data.spoed
    );

    if (match) {
      return match.prijs;
    }

    // Als geen exacte match, genereer een schatting op basis van gewicht en transportType
    if (data.transportType === "nationaal") {
      switch (data.gewicht) {
        case "0-5": return data.spoed === "standaard" ? "€7,95 - €12,95" : "€15,95 - €19,95";
        case "5-10": return data.spoed === "standaard" ? "€10,95 - €15,95" : "€18,95 - €24,95";
        case "10-20": return data.spoed === "standaard" ? "€14,95 - €19,95" : "€22,95 - €29,95";
        case "20-50": return data.spoed === "standaard" ? "€19,95 - €29,95" : "€29,95 - €39,95";
        case "50+": return "Prijs op aanvraag";
        default: return "Prijs op aanvraag";
      }
    } else {
      // Internationaal
      switch (data.gewicht) {
        case "0-5": return data.spoed === "standaard" ? "€24,95 - €39,95" : "€34,95 - €49,95";
        case "5-10": return data.spoed === "standaard" ? "€29,95 - €44,95" : "€39,95 - €59,95";
        case "10-20": return data.spoed === "standaard" ? "€39,95 - €59,95" : "€49,95 - €79,95";
        case "20-50": return data.spoed === "standaard" ? "€59,95 - €99,95" : "€79,95 - €119,95";
        case "50+": return "Prijs op aanvraag";
        default: return "Prijs op aanvraag";
      }
    }
  };

  // Update prijs wanneer relevante waardes wijzigen
  const updatePrijsIndicatie = () => {
    const values = form.getValues();
    const prijs = berekenPrijsIndicatie(values);
    setPrijsIndicatie(prijs);
  };

  // Handler voor het versturen van het formulier
  const onSubmit = async (data: PriceFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("/api/prijsofferte", "POST", {
        ...data,
        // Voeg timestamp toe
        timestamp: new Date().toISOString(),
        // Het email adres waar de offerte naartoe moet
        toEmail: "info@priorityparcel.nl",
        // Voeg de prijsindicatie toe
        prijsIndicatie: prijsIndicatie || "Onbekend"
      });

      toast({
        title: "Offerte aangevraagd!",
        description: "We sturen u zo spoedig mogelijk een nauwkeurige prijsopgave",
      });

      form.reset();
      setPrijsIndicatie(null);
    } catch (error) {
      console.error("Error submitting price form:", error);
      toast({
        title: "Er is iets misgegaan",
        description: "Probeer het later nog eens of neem telefonisch contact op.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Prijzen en offertes
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bereken direct een prijsindicatie voor uw zending door onderstaand formulier in te vullen. 
                Voor een exacte offerte op maat, vul dan het hele formulier in en wij nemen contact met u op.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="md:col-span-2">
                <Card className="bg-white shadow-md">
                  <CardContent className="pt-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary flex items-center">
                              <Package className="mr-2" size={20} />
                              Zendingsinformatie
                            </h3>
                            
                            <FormField
                              control={form.control}
                              name="transportType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type transport</FormLabel>
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      updatePrijsIndicatie();
                                    }} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecteer type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="nationaal">Nationaal (binnen Nederland)</SelectItem>
                                      <SelectItem value="internationaal">Internationaal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="gewicht"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gewicht</FormLabel>
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      updatePrijsIndicatie();
                                    }} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecteer gewicht" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="0-5">0-5 kg</SelectItem>
                                      <SelectItem value="5-10">5-10 kg</SelectItem>
                                      <SelectItem value="10-20">10-20 kg</SelectItem>
                                      <SelectItem value="20-50">20-50 kg</SelectItem>
                                      <SelectItem value="50+">50+ kg</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="afmetingen"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Afmetingen pakket</FormLabel>
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      updatePrijsIndicatie();
                                    }} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecteer afmetingen" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="klein">Klein (max. 30x20x10 cm)</SelectItem>
                                      <SelectItem value="middel">Middel (max. 60x40x30 cm)</SelectItem>
                                      <SelectItem value="groot">Groot (max. 100x60x50 cm)</SelectItem>
                                      <SelectItem value="extra-groot">Extra groot (groter)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="spoed"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bezorgsnelheid</FormLabel>
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      updatePrijsIndicatie();
                                    }} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecteer snelheid" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="standaard">Standaard (2-3 werkdagen)</SelectItem>
                                      <SelectItem value="spoed">Spoed (volgende werkdag)</SelectItem>
                                      <SelectItem value="extra-spoed">Extra spoed (vandaag)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary">Uw gegevens</h3>
                            
                            <FormField
                              control={form.control}
                              name="naam"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Naam</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Uw volledige naam" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="bedrijf"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bedrijfsnaam (optioneel)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Uw bedrijfsnaam" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>E-mailadres</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="uw@email.nl" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="telefoon"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Telefoonnummer</FormLabel>
                                  <FormControl>
                                    <Input type="tel" placeholder="06 12345678" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="ophaladres"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ophaladres</FormLabel>
                                <FormControl>
                                  <Input placeholder="Straat, huisnummer, postcode, plaats" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="afleveradres"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Afleveradres</FormLabel>
                                <FormControl>
                                  <Input placeholder="Straat, huisnummer, postcode, plaats" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="bericht"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Extra informatie (optioneel)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Speciale instructies of vragen..."
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-center mt-6">
                          <Button 
                            type="submit" 
                            className="bg-accent hover:bg-accent/90 text-white px-8 py-2" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Bezig met verzenden..." : "Offerte aanvragen"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">Prijsindicatie</h3>
                  
                  {prijsIndicatie ? (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Op basis van de door u ingevulde gegevens schatten wij de kosten op:
                      </p>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <span className="block text-2xl font-bold text-primary">{prijsIndicatie}</span>
                        <span className="text-sm text-gray-500">Indicatieve prijs (excl. BTW)</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Dit is een schatting op basis van standaard tarieven. Voor een exacte offerte 
                        die rekening houdt met alle details, vul het volledige formulier in.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-3">
                        Selecteer uw transporttype, gewicht en bezorgsnelheid voor een prijsindicatie.
                      </p>
                      <Button 
                        type="button" 
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={updatePrijsIndicatie}
                      >
                        Bereken indicatie
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-primary mb-4">Waarom PriorityParcel?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">
                        <Package size={18} />
                      </div>
                      <span className="ml-3 text-gray-700">
                        Voordelige tarieven voor alle formaten
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">
                        <Package size={18} />
                      </div>
                      <span className="ml-3 text-gray-700">
                        Snelle en betrouwbare bezorging
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">
                        <Package size={18} />
                      </div>
                      <span className="ml-3 text-gray-700">
                        24/7 online volgen van uw zending
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">
                        <Package size={18} />
                      </div>
                      <span className="ml-3 text-gray-700">
                        Verschillende verzekerings­opties
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Veelgestelde vragen
              </h2>
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-primary">Wat is er inbegrepen bij de prijs?</h3>
                  <p className="text-gray-600 mt-2">
                    Onze prijzen zijn inclusief ophalen, transport en afleveren van uw zending. De tracking van uw zending, basisverzekering en standaard customer service zijn altijd inbegrepen.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-primary">Hoe werkt de verzekering?</h3>
                  <p className="text-gray-600 mt-2">
                    Elke zending is standaard verzekerd tot €100. Extra verzekering kan worden aangevraagd tegen een meerprijs. Bij internationaal transport gelden andere voorwaarden.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-primary">Zijn er extra kosten?</h3>
                  <p className="text-gray-600 mt-2">
                    Voor bijzondere diensten zoals zaterdaglevering, leveringen naar afgelegen gebieden of extra grote of zware pakketten kunnen aanvullende kosten worden berekend. Dit wordt altijd vooraf duidelijk gecommuniceerd.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}