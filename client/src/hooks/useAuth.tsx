import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define the User type based on our schema
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  bedrijf: string | null;
  telefoon: string | null;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Provider component that wraps the app and provides auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get token from local storage on initial load
  const getStoredToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    }
    return null;
  };

  // Store auth token
  const storeToken = (token: string, remember: boolean = false) => {
    if (remember) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }
  };

  // Remove auth token
  const removeToken = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
  };

  // Set auth header for API requests
  const setAuthHeader = (token: string | null) => {
    if (token) {
      // This would be used in a real implementation to set the auth header
      // for all API requests
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  // Check if we have a token on load
  const [token, setToken] = useState<string | null>(getStoredToken());

  // Query for the current user with the token
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!token, // Only run query if we have a token
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: false,
  });

  // Mutation for login
  const loginMutation = useMutation({
    mutationFn: async ({ email, password, rememberMe = false }: { 
      email: string; 
      password: string; 
      rememberMe?: boolean;
    }) => {
      interface LoginResponse {
        user: User;
        token: string;
      }
      const response = await apiRequest<LoginResponse>("/api/login", "POST", { email, password, rememberMe });
      return { 
        ...response,
        rememberMe 
      };
    },
    onSuccess: (data) => {
      storeToken(data.token, data.rememberMe);
      setToken(data.token);
      
      // Store the user in query cache
      queryClient.setQueryData(["/api/auth/user"], data.user);
      
      toast({
        title: "Succesvol ingelogd",
        description: "U bent nu ingelogd bij PriorityParcel.",
      });
      
      // Handle appropriate redirection based on user role
      if (data.user.role === "admin") {
        setTimeout(() => setLocation("/admin"), 200);
      } else {
        setTimeout(() => setLocation("/dashboard"), 200);
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Inloggen mislukt",
        description: error.message || "Controleer uw inloggegevens en probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  // Mutation for logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/logout", "POST");
    },
    onSettled: () => {
      // Always clear authentication state on logout attempt
      setToken(null);
      removeToken();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.setQueryData(["/api/auth/user"], null);
      
      toast({
        title: "Uitgelogd",
        description: "U bent uitgelogd bij PriorityParcel.",
      });
      
      setLocation("/login");
    },
  });

  // Effect to handle authentication errors
  useEffect(() => {
    if (error && token) {
      // Token is invalid or expired
      setToken(null);
      removeToken();
      toast({
        title: "Sessie verlopen",
        description: "Uw sessie is verlopen. Log opnieuw in.",
        variant: "destructive",
      });
    }
  }, [error, token, toast]);
  
  // Verwijderd: dit deel veroorzaakte conflicten bij het redirecten

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    await loginMutation.mutateAsync({ email, password, rememberMe });
  };

  // Logout function
  const logout = () => {
    logoutMutation.mutate();
  };

  // Value object with the auth context 
  const value = {
    user: user as User | null,
    isLoading: isLoading || loginMutation.isPending,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}