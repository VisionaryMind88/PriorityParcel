import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Lock, User, Mail, EyeOff, Eye, LogIn } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password, data.rememberMe);
      
      // Successfully logged in, redirect to dashboard after a short delay
      setTimeout(() => {
        setLocation("/dashboard");
      }, 500);
    } catch (error) {
      // Error is handled in the auth hook
      console.error("Login submission error:", error);
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
                  
                  <div className="text-center text-xs text-gray-600 mt-2">
                    Admin login: admin@priorityparcel.nl / admin123
                  </div>
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