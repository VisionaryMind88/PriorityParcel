import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, { message: "Naam moet minimaal 2 karakters bevatten" }),
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
  phone: z.string().min(10, { message: "Voer een geldig telefoonnummer in" }).optional(),
  location: z.string().optional(),
  message: z.string().min(5, { message: "Bericht moet minimaal 5 karakters bevatten" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    
    try {
      const response = await apiRequest('POST', '/api/contact', data);
      
      if (response.ok) {
        toast({
          title: "Formulier verzonden!",
          description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Er is iets misgegaan",
        description: "Probeer het later nog eens of neem telefonisch contact met ons op.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naam</FormLabel>
              <FormControl>
                <Input placeholder="Uw naam" {...field} />
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
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="uw@email.nl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefoonnummer</FormLabel>
              <FormControl>
                <Input placeholder="+31 6 12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regio</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een regio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Selecteer een regio</SelectItem>
                  <SelectItem value="noord">Noord-Nederland</SelectItem>
                  <SelectItem value="midden">Midden-Nederland</SelectItem>
                  <SelectItem value="zuid">Zuid-Nederland</SelectItem>
                  <SelectItem value="oost">Oost-Nederland</SelectItem>
                  <SelectItem value="west">West-Nederland</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bericht</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Schrijf hier uw bericht..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-secondary text-white"
          disabled={submitting}
        >
          {submitting ? "Bezig met verzenden..." : "Verstuur bericht"}
        </Button>
      </form>
    </Form>
  );
}
