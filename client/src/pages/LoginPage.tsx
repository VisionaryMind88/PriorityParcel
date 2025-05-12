import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Mail, EyeOff, Eye, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const loginSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
  password: z.string().min(6, { message: "Het wachtwoord moet minimaal 6 tekens bevatten" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // In een echte implementatie zou dit een API-call naar de server zijn
      await apiRequest("/api/login", "POST", data);

      toast({
        title: "Succesvol ingelogd",
        description: "U wordt doorgestuurd naar het dashboard.",
      });

      // Simuleer een korte vertraging voor de UX
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Inloggen mislukt",
        description: "Controleer uw e-mailadres en wachtwoord en probeer het opnieuw.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-primary">Inloggen bij PriorityParcel</CardTitle>
              <CardDescription className="text-center">
                Log in op uw account om uw zendingen te beheren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mailadres</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="uw@email.nl" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wachtwoord</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              className="pl-10" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        {...form.register("rememberMe")}
                      />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        Onthoud mij
                      </label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Wachtwoord vergeten?
                    </a>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Inloggen..." : "Inloggen"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center text-sm text-gray-600">
                Heeft u nog geen account?{" "}
                <a href="#" className="text-primary hover:underline">
                  Neem contact op met ons
                </a>
              </div>
              <div className="text-center text-xs text-gray-500">
                Door in te loggen gaat u akkoord met onze{" "}
                <a href="#" className="underline">
                  Algemene voorwaarden
                </a>{" "}
                en{" "}
                <a href="#" className="underline">
                  Privacybeleid
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}