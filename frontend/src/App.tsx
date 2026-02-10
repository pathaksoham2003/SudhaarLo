import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProvidersPage from "./pages/ProvidersPage";
import ProviderDetailPage from "./pages/ProviderDetailPage";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import CustomerBookingsPage from "./pages/customer/BookingsPage";
import BookingDetailPage from "./pages/customer/BookingDetailPage";
import CustomerProfilePage from "./pages/customer/ProfilePage";
import ProviderDashboard from "./pages/provider/Dashboard";
import ProviderServicesPage from "./pages/provider/ServicesPage";
import ProviderBookingsPage from "./pages/provider/BookingsPage";
import SubscriptionPage from "./pages/provider/SubscriptionPage";
import ProviderProfilePage from "./pages/provider/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/provider/:id" element={<ProviderDetailPage />} />
          <Route path="/services" element={<ProvidersPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Customer Routes */}
          <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
          <Route path="/customer/booking/:id" element={<BookingDetailPage />} />
          <Route path="/customer/profile" element={<CustomerProfilePage />} />
          
          {/* Provider Routes */}
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/services" element={<ProviderServicesPage />} />
          <Route path="/provider/bookings" element={<ProviderBookingsPage />} />
          <Route path="/provider/subscription" element={<SubscriptionPage />} />
          <Route path="/provider/profile" element={<ProviderProfilePage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
