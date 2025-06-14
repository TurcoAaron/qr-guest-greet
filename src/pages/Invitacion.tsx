
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Download, ArrowLeft, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Invitado {
  id: string;
  name: string;
  email: string;
  invitation_code: string;
  qr_code_data: string;
}

interface Evento {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
}

const Invitacion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const codigo = searchParams.get("codigo");
    if (codigo) {
      cargarInvitacion(codigo);
    } else {
      // Si no hay código, mostrar error
      setLoading(false);
    }
  }, [searchParams]);

  const cargarInvitacion = async (codigo: string) => {
    try {
      // Cargar información del invitado
      const { data: invitadoData, error: invitadoError } = await supabase
        .from('guests')
        .select(`
          *,
          events (
            id,
            name,
            description,
            date,
            location
          )
        `)
        .eq('invitation_code', codigo)
        .single();

      if (invitadoError || !invitadoData) {
        toast({
          title: "Error",
          description: "No se encontró la invitación",
          variant: "destructive",
        });
        return;
      }

      setInvitado(invitadoData);
      setEvento(invitadoData.events);
    } catch (error) {
      console.error('Error cargando invitación:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la invitación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const descargarInvitacion = () => {
    toast({
      title: "Función en desarrollo",
      description: "La descarga de invitaciones estará disponible pronto",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (!invitado || !evento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-2xl border-0">
              <CardContent className="p-8 text-center">
                <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Invitación no encontrada</h2>
                <p className="text-gray-600 mb-6">
                  No se pudo encontrar la invitación. Verifica que el código sea correcto.
                </p>
                <Button onClick={() => navigate('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 overflow-hidden">
            {/* Header decorativo */}
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10 flex items-center justify-between h-full px-6">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
                <h1 className="text-white text-2xl font-bold">INVITACIÓN</h1>
                <div></div>
              </div>
            </div>

            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                ¡Estás Invitado!
              </CardTitle>
              <p className="text-xl text-purple-600 font-semibold">
                Querido/a {invitado.name}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {evento.name}
                </h2>
                {evento.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {evento.description}
                  </p>
                )}
              </div>

              {/* Detalles del evento */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Fecha</p>
                    <p className="text-gray-600">
                      {new Date(evento.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Hora</p>
                    <p className="text-gray-600">
                      {new Date(evento.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} hrs
                    </p>
                  </div>
                </div>
                
                {evento.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Lugar</p>
                      <p className="text-gray-600">{evento.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Código QR */}
              <div className="text-center bg-white p-6 rounded-lg border-2 border-dashed border-purple-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tu Código de Acceso
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <QRCodeSVG
                      value={invitado.qr_code_data}
                      size={150}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Presenta este código QR al llegar al evento
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Código: {invitado.invitation_code}
                </p>
              </div>

              {/* Mensaje especial */}
              <div className="text-center bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-800 font-medium">
                  "La alegría compartida es doble alegría"
                </p>
                <p className="text-sm text-purple-600 mt-2">
                  ¡Esperamos verte pronto!
                </p>
              </div>

              {/* Botón de descarga */}
              <div className="text-center">
                <Button 
                  onClick={descargarInvitacion}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Invitación
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Invitacion;
