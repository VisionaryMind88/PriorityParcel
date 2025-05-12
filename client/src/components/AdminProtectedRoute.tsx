import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AdminProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AdminProtectedRoute({ 
  children, 
  redirectTo = "/dashboard" 
}: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Toegang geweigerd",
          description: "U moet ingelogd zijn om het admin dashboard te bekijken.",
          variant: "destructive",
        });
        setLocation("/login");
      } 
      else if (user && (user as any).role !== "admin") {
        toast({
          title: "Geen toegang",
          description: "U heeft geen admin rechten om deze pagina te bekijken.",
          variant: "destructive",
        });
        setLocation(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, user, redirectTo, setLocation, toast]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/30"></div>
          <p className="text-gray-500">Inloggegevens controleren...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated and is an admin
  return isAuthenticated && (user as any)?.role === "admin" ? <>{children}</> : null;
}