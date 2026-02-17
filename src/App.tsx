
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { trackPageView } from "@/lib/metrika";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import ListingPage from "./pages/ListingPage";
import RoomDetails from "./pages/RoomDetails";
import OfflineIndicator from "./components/OfflineIndicator";

import OwnerLogin from "./pages/OwnerLogin";
import OwnerForgotPassword from "./pages/OwnerForgotPassword";
import OwnerDashboard from "./pages/OwnerDashboard";
import CompanyInfo from "./pages/CompanyInfo";
import Offer from "./pages/Offer";
import NotFound from "./pages/NotFound";
import AddListing from "./pages/AddListing";
import Accounting from "./pages/Accounting";
import CityPage from "./pages/CityPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import Career from "./pages/Career";
import ListingEditor from "./pages/ListingEditor";
import SalesScripts from "./pages/SalesScripts";
import InterviewScript from "./pages/InterviewScript";
import InactiveListings from "./pages/InactiveListings";
import ProtectedRoute from "./components/ProtectedRoute";
import MetrikaScrollTracker from "./components/MetrikaScrollTracker";

const queryClient = new QueryClient();

function MetrikaTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OfflineIndicator />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MetrikaTracker />
        <MetrikaScrollTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/forgot-password" element={<OwnerForgotPassword />} />
          <Route path="/owner/dashboard" element={<ProtectedRoute redirectTo="/owner/login"><OwnerDashboard /></ProtectedRoute>} />
          
          <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/inactive-listings" element={<ProtectedRoute><InactiveListings /></ProtectedRoute>} />
          <Route path="/manager/listing/:id" element={<ProtectedRoute><ListingEditor /></ProtectedRoute>} />
          <Route path="/om" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/um" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/accounting" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
          <Route path="/career" element={<Career />} />
          <Route path="/sales-scripts" element={<ProtectedRoute><SalesScripts /></ProtectedRoute>} />
          <Route path="/interview-script" element={<ProtectedRoute><InterviewScript /></ProtectedRoute>} />
          <Route path="/listing/:id/edit" element={<ProtectedRoute><ListingEditor /></ProtectedRoute>} />
          
          <Route path="/company-info" element={<CompanyInfo />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/listing/:listingId" element={<ListingPage />} />
          <Route path="/listing/:listingId/room/:roomIndex" element={<RoomDetails />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/city/:citySlug" element={<CityPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;