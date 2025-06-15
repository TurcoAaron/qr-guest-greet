
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Search, Calendar, Users, CheckCircle, Camera } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [eventoId, setEventoId] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const manejarBuscarEvento = async () => {
    if (!eventoId.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un ID de evento",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: evento, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventoId.trim())
        .single();

      if (error || !evento) {
        toast({
          title: "Evento no encontrado",
          description: "No se encontró un evento con ese ID",
          variant: "destructive",
        });
        return;
      }

      navigate(`/tomar-asistencia/${eventoId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al buscar el evento",
        variant: "destructive",
      });
    }
  };

  const manejarBuscarInvitacion = async () => {
    if (!codigoInvitacion.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de invitación",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: invitado, error } = await supabase
        .from('guests')
        .select('*, events(*)')
        .eq('invitation_code', codigoInvitacion.trim())
        .single();

      if (error || !invitado) {
        toast({
          title: "Invitación no encontrada",
          description: "No se encontró una invitación con ese código",
          variant: "destructive",
        });
        return;
      }

      navigate('/invitacion', { 
        state: { 
          guest: invitado,
          event: invitado.events 
        } 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al buscar la invitación",
        variant: "destructive",
      });
    }
  };

  const iniciarEscaneoQR = () => {
    setIsScanning(true);
    navigate('/escanear');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            EventManager
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Sistema completo de gestión de eventos y asistencias
          </p>
          
          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Tomar Asistencia */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-6">
                <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-2xl">Tomar Asistencia</CardTitle>
                <p className="text-gray-600">
                  Registra la asistencia para un evento específico
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    ID del Evento
                  </label>
                  <Input
                    type="text"
                    placeholder="Ingresa el ID del evento"
                    value={eventoId}
                    onChange={(e) => setEventoId(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={manejarBuscarEvento}
                  className="w-full"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Evento
                </Button>
              </CardContent>
            </Card>

            {/* Consultar Invitación */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-6">
                <Calendar className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <CardTitle className="text-2xl">Consultar Invitación</CardTitle>
                <p className="text-gray-600">
                  Consulta los detalles de tu invitación
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Código de Invitación
                  </label>
                  <Input
                    type="text"
                    placeholder="Ingresa tu código de invitación"
                    value={codigoInvitacion}
                    onChange={(e) => setCodigoInvitacion(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={manejarBuscarInvitacion}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Consultar Invitación
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* QR Scanner Section */}
          <div className="mt-12">
            <Card className="border-0 shadow-lg max-w-md mx-auto">
              <CardHeader className="text-center">
                <QrCode className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                <CardTitle>Escanear Código QR</CardTitle>
                <p className="text-gray-600 text-sm">
                  Usa la cámara para escanear códigos QR
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={iniciarEscaneoQR}
                  className="w-full"
                  size="lg"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Abrir Escáner QR
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¿Por qué usar EventManager?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Una solución completa para la gestión de eventos, desde la creación hasta el control de asistencias
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Gestión Fácil</h3>
              <p className="text-gray-600">
                Crea y administra eventos de manera intuitiva y eficiente
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Códigos QR</h3>
              <p className="text-gray-600">
                Genera códigos QR únicos para cada invitado y evento
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Control Total</h3>
              <p className="text-gray-600">
                Monitorea asistencias en tiempo real con reportes detallados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
