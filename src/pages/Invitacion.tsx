
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Download, ArrowLeft, XCircle, Check, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Invitado {
  id: string;
  name: string;
  email: string;
  phone: string;
  invitation_code: string;
  qr_code_data: string;
}

interface Evento {
  id: string;
  name: string;
  description: string;
  date: string;
  start_date: string;
  end_date: string;
  location: string;
  event_type: string;
  dress_code: string;
}

interface RsvpResponse {
  id: string;
  response: string;
}

const Invitacion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [rsvpResponse, setRsvpResponse] = useState<RsvpResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  useEffect(() => {
    const codigo = searchParams.get("codigo");
    if (codigo) {
      cargarInvitacion(codigo);
    } else {
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
            start_date,
            end_date,
            location,
            event_type,
            dress_code
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

      // Cargar respuesta RSVP existente
      const { data: rsvpData } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('guest_id', invitadoData.id)
        .eq('event_id', invitadoData.events.id)
        .single();

      if (rsvpData) {
        setRsvpResponse(rsvpData);
      }
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

  const responderInvitacion = async (response: 'attending' | 'not_attending') => {
    if (!invitado || !evento) return;

    setSubmittingRsvp(true);

    try {
      if (rsvpResponse) {
        // Actualizar respuesta existente
        const { error } = await supabase
          .from('rsvp_responses')
          .update({ 
            response,
            updated_at: new Date().toISOString()
          })
          .eq('id', rsvpResponse.id);

        if (error) throw error;

        setRsvpResponse({ ...rsvpResponse, response });
      } else {
        // Crear nueva respuesta
        const { data, error } = await supabase
          .from('rsvp_responses')
          .insert({
            guest_id: invitado.id,
            event_id: evento.id,
            response
          })
          .select()
          .single();

        if (error) throw error;

        setRsvpResponse(data);
      }

      toast({
        title: response === 'attending' ? "¡Confirmado!" : "Respuesta registrada",
        description: response === 'attending' 
          ? "Tu asistencia ha sido confirmada" 
          : "Hemos registrado que no podrás asistir",
      });
    } catch (error) {
      console.error('Error enviando respuesta:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar tu respuesta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const descargarInvitacion = () => {
    toast({
      title: "Función en desarrollo",
      description: "La descarga de invitaciones estará disponible pronto",
    });
  };

  const formatearTipoEvento = (tipo: string) => {
    const tipos = {
      conference: "Conferencia",
      wedding: "Boda", 
      birthday: "Cumpleaños",
      corporate: "Corporativo",
      social: "Social",
      workshop: "Taller",
      seminar: "Seminario",
      other: "Otro"
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const formatearCodigoVestimenta = (codigo: string) => {
    const codigos = {
      formal: "Formal",
      "semi-formal": "Semi-formal",
      casual: "Casual",
      business: "Ejecutivo",
      cocktail: "Cocktail",
      "black-tie": "Etiqueta",
      "white-tie": "Etiqueta Rigurosa",
      theme: "Temático"
    };
    return codigos[codigo as keyof typeof codigos] || codigo;
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
                      {new Date(evento.start_date).toLocaleDateString('es-ES', {
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
                      {new Date(evento.start_date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} hrs
                      {evento.end_date && ` - ${new Date(evento.end_date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} hrs`}
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

                {evento.event_type && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Tipo de Evento</p>
                      <p className="text-gray-600">{formatearTipoEvento(evento.event_type)}</p>
                    </div>
                  </div>
                )}

                {evento.dress_code && (
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5 text-purple-600 text-lg">👔</span>
                    <div>
                      <p className="font-semibold text-gray-800">Código de Vestimenta</p>
                      <p className="text-gray-600">{formatearCodigoVestimenta(evento.dress_code)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de RSVP */}
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-purple-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  ¿Podrás acompañarnos?
                </h3>
                
                {rsvpResponse ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      {rsvpResponse.response === 'attending' ? (
                        <>
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-medium">Confirmaste tu asistencia</span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-red-600" />
                          <span className="text-red-600 font-medium">Confirmaste que no podrás asistir</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">¿Quieres cambiar tu respuesta?</p>
                  </div>
                ) : (
                  <p className="text-center text-gray-600 mb-4">
                    Por favor confirma tu asistencia
                  </p>
                )}

                <div className="flex space-x-4 justify-center">
                  <Button
                    onClick={() => responderInvitacion('attending')}
                    disabled={submittingRsvp}
                    className={`${
                      rsvpResponse?.response === 'attending' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {submittingRsvp ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Asistiré
                  </Button>
                  <Button
                    onClick={() => responderInvitacion('not_attending')}
                    disabled={submittingRsvp}
                    variant="outline"
                    className={`${
                      rsvpResponse?.response === 'not_attending' 
                        ? 'border-red-600 text-red-600 bg-red-50' 
                        : 'border-red-500 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {submittingRsvp ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    No podré asistir
                  </Button>
                </div>
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
