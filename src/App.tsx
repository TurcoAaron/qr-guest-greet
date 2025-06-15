
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Invitacion from "./pages/Invitacion";
import TomarAsistencia from "./pages/TomarAsistencia";
import GenerarQR from "./pages/GenerarQR";
import EscanearQR from "./pages/EscanearQR";
import Administrar from "./pages/Administrar";
import CrearEvento from "./pages/CrearEvento";
import EditarEvento from "./pages/EditarEvento";
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
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/auth" element={<Layout><Auth /></Layout>} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="/invitacion" element={<Layout><Invitacion /></Layout>} />
            <Route path="/tomar-asistencia/:eventoId" element={<Layout><TomarAsistencia /></Layout>} />
            <Route 
              path="/crear-evento" 
              element={
                <ProtectedRoute>
                  <Layout><CrearEvento /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editar-evento/:eventoId" 
              element={
                <ProtectedRoute>
                  <Layout><EditarEvento /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generar-qr" 
              element={
                <ProtectedRoute>
                  <Layout><GenerarQR /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/escanear" 
              element={
                <ProtectedRoute>
                  <Layout><EscanearQR /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/administrar" 
              element={
                <ProtectedRoute>
                  <Layout><Administrar /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
