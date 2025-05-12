import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import OffertePage from "@/pages/OffertePage";
import TrackAndTracePage from "@/pages/TrackAndTracePage";
import PrijzenPage from "@/pages/PrijzenPage";
import DienstenPage from "@/pages/DienstenPage";
import OverOnsPage from "@/pages/OverOnsPage";
import ContactPage from "@/pages/ContactPage";

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
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
