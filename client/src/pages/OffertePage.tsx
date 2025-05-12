import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { apiRequest } from "@/lib/queryClient";

// Formulier validatieschema
const offerteSchema = z.object({
  naam: z.string().min(2, { message: "Naam moet minimaal 2 tekens bevatten" }),
  bedrijf: z.string().optional(),
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
  telefoon: z.string().min(10, { message: "Voer een geldig telefoonnummer in" }),
  type: z.enum(["spoedlevering", "standaardlevering", "routinelevering"]),
  volume: z.enum(["klein", "middel", "groot"]),
  frequentie: z.enum(["eenmalig", "wekelijks", "maandelijks", "dagelijks"]),
  bericht: z.string().min(10, { message: "Beschrijf uw aanvraag (minimaal 10 tekens)" }),
});

type OfferteFormValues = z.infer<typeof offerteSchema>;

export default function OffertePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OfferteFormValues>({
    resolver: zodResolver(offerteSchema),
    defaultValues: {
      naam: "",
      bedrijf: "",
      email: "",
      telefoon: "",
      type: "standaardlevering",
      volume: "middel",
      frequentie: "eenmalig",
      bericht: "",
    },
  });

  const onSubmit = async (data: OfferteFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("/api/offerte", "POST", {
        ...data,
        // Voeg timestamp toe
        timestamp: new Date().toISOString(),
        // Het email adres waar de offerte naartoe moet
        toEmail: "info@priorityparcel.nl"
      });

      toast({
        title: "Offerte aangevraagd!",
        description: "We nemen zo spoedig mogelijk contact met u op.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting offerte form:", error);
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
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Vraag een offerte aan
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Vul het formulier in voor een op maat gemaakte offerte. We streven ernaar binnen 24 uur te reageren met een passend voorstel voor uw transportbehoeften.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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

                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type bezorging</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecteer type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spoedlevering">Spoedlevering</SelectItem>
                              <SelectItem value="standaardlevering">Standaardlevering</SelectItem>
                              <SelectItem value="routinelevering">Routinelevering</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecteer volume" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="klein">Klein (&lt; 5kg)</SelectItem>
                              <SelectItem value="middel">Middel (5-20kg)</SelectItem>
                              <SelectItem value="groot">Groot (&gt; 20kg)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="frequentie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequentie</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecteer frequentie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="eenmalig">Eenmalige zending</SelectItem>
                              <SelectItem value="wekelijks">Wekelijks</SelectItem>
                              <SelectItem value="maandelijks">Maandelijks</SelectItem>
                              <SelectItem value="dagelijks">Dagelijks</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <FormLabel>Specificaties en details van uw aanvraag</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Beschrijf uw wensen en eisen voor de transportdienst. Vermeld afmetingen, gewicht, speciale behandeling, etc."
                            className="min-h-[120px]"
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
                      {isSubmitting ? "Bezig met verzenden..." : "Verstuur offerteaanvraag"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}