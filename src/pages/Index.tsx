
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Users, UserCheck, Settings, LogIn, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const buscarPorId = async () => {
    if (!searchId.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un ID",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      // Primero buscar si es un código de evento
      const { data: evento, error: eventoError } = await supabase
        .from('events')
        .select('*')
        .eq('event_code', searchId.trim())
        .maybeSingle();

      if (evento) {
        // Es un evento, redirigir a la pantalla de asistencia
        navigate(`/tomar-asistencia/${evento.id}`);
        return;
      }

      // Si no es evento, buscar si es código de invitación
      const { data: invitacion, error: invitacionError } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_code', searchId.trim())
        .maybeSingle();

      if (invitacion) {
        // Es una invitación, redirigir a mostrar QR
        navigate(`/invitacion?codigo=${invitacion.invitation_code}`);
        return;
      }

      // No se encontró nada
      toast({
        title: "No encontrado",
        description: "No se encontró ningún evento o invitación con ese código",
        variant: "destructive",
      });

    } catch (error) {
      console.error('Error buscando:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al buscar",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarPorId();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <div className="flex space-x-4">
              {user ? (
                <Button asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/auth" className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Asistencia QR
          </h1>
          <p className="text-xl text-gray-600">
            Ingresa el código de evento o invitación
          </p>
        </header>

        {/* Búsqueda principal */}
        <div className="max-w-md mx-auto mb-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Buscar por Código</span>
              </CardTitle>
              <CardDescription>
                Ingresa el código del evento o de tu invitación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="searchId">Código</Label>
                <Input
                  id="searchId"
                  type="text"
                  placeholder="Ej: EVT123 o INV456"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={buscarPorId}
                disabled={isSearching || !searchId.trim()}
                className="w-full"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Información sobre tipos de código */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Código de Evento</CardTitle>
              <CardDescription>
                Si tienes un código de evento, podrás acceder a la pantalla para tomar asistencia de los participantes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Código de Invitación</CardTitle>
              <CardDescription>
                Si tienes un código de invitación, podrás ver tu invitación personalizada con código QR
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sección informativa */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p>Ingresa tu código de evento o invitación en el campo de búsqueda</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p>El sistema identificará automáticamente el tipo de código</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p>Serás redirigido a la pantalla correspondiente: asistencia o invitación</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
