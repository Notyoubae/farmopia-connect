
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OTPVerification from "./pages/OTPVerification";
import Unauthorized from "./pages/Unauthorized";
import RoleSelection from "./pages/RoleSelection";
import Reviews from "./pages/Reviews";
import FarmersList from "./pages/FarmersList";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail"; // Import the new page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<RoleSelection />} />
              <Route path="/sign-up/farmer" element={<SignUp />} />
              <Route path="/sign-up/customer" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/farmers" element={<FarmersList />} />
              <Route path="/reviews/:farmerId" element={<Reviews />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<ProductDetail />} /> {/* Add the product detail route */}
              
              {/* Protected routes for all authenticated users */}
              {/* Add protected routes here, for example:
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              */}
              
              {/* Role-specific protected routes */}
              {/* For customer-only routes:
              <Route 
                path="/browse-farmers" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <BrowseFarmers />
                  </ProtectedRoute>
                } 
              />
              */}
              
              {/* For farmer-only routes:
              <Route 
                path="/farmer-dashboard" 
                element={
                  <ProtectedRoute requiredRole="farmer">
                    <FarmerDashboard />
                  </ProtectedRoute>
                } 
              />
              */}
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
