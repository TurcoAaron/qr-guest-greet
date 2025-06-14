
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Invitacion from "./pages/Invitacion";
import GenerarQR from "./pages/GenerarQR";
import EscanearQR from "./pages/EscanearQR";
import Administrar from "./pages/Administrar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/invitacion" element={<Invitacion />} />
            <Route 
              path="/generar-qr" 
              element={
                <ProtectedRoute>
                  <GenerarQR />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/escanear" 
              element={
                <ProtectedRoute>
                  <EscanearQR />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/administrar" 
              element={
                <ProtectedRoute>
                  <Administrar />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
