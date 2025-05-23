import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import OffertePage from "@/pages/OffertePage";
import TrackAndTracePage from "@/pages/TrackAndTracePage";
import PrijzenPage from "@/pages/PrijzenPage";
import DienstenPage from "@/pages/DienstenPage";
import OverOnsPage from "@/pages/OverOnsPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/diensten" component={DienstenPage} />
      <Route path="/over-ons" component={OverOnsPage} />
      <Route path="/prijzen" component={PrijzenPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/offerte" component={OffertePage} />
      <Route path="/track-and-trace" component={TrackAndTracePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <AdminProtectedRoute>
          <AdminDashboardPage />
        </AdminProtectedRoute>
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
