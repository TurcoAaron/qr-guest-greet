
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CheckCircle, XCircle, User, ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Evento {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  event_code: string;
}

interface Asistencia {
  guest_id: string;
  guest_name: string;
  checked_in_at: string;
}

const TomarAsistencia = () => {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [codigoManual, setCodigoManual] = useState("");
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [ultimoRegistrado, setUltimoRegistrado] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    cargarEvento();
    cargarAsistencias();
  }, [eventoId]);

  const cargarEvento = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventoId)
        .single();

      if (error) throw error;
      setEvento(data);
    } catch (error) {
      console.error('Error cargando evento:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del evento",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const cargarAsistencias = async () => {
    try {
      const { data, error } = await supabase
        .from('attendances')
        .select(`
          guest_id,
          checked_in_at,
          guests (
            name
          )
        `)
        .eq('event_id', eventoId)
        .order('checked_in_at', { ascending: false });

      if (error) throw error;
      
      const asistenciasFormateadas = data.map(item => ({
        guest_id: item.guest_id,
        guest_name: item.guests?.name || 'Nombre no disponible',
        checked_in_at: item.checked_in_at
      }));
      
      setAsistencias(asistenciasFormateadas);
    } catch (error) {
      console.error('Error cargando asistencias:', error);
    }
  };

  const registrarAsistencia = async (codigoInvitacion: string) => {
    if (!codigoInvitacion.trim()) {
      toast({
        title: "Error",
        description: "Código de invitación inválido",
        variant: "destructive",
      });
      return;
    }

    try {
      // Buscar el invitado por código de invitación
      const { data: invitado, error: errorInvitado } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_code', codigoInvitacion.trim())
        .eq('event_id', eventoId)
        .single();

      if (errorInvitado || !invitado) {
        toast({
          title: "Error",
          description: "Código de invitación no válido para este evento",
          variant: "destructive",
        });
        return;
      }

      // Verificar si ya está registrado
      const { data: asistenciaExistente } = await supabase
        .from('attendances')
        .select('*')
        .eq('guest_id', invitado.id)
        .eq('event_id', eventoId)
        .single();

      if (asistenciaExistente) {
        toast({
          title: "Ya Registrado",
          description: `${invitado.name} ya registró su asistencia`,
          variant: "destructive",
        });
        return;
      }

      // Registrar asistencia
      const { error: errorAsistencia } = await supabase
        .from('attendances')
        .insert({
          guest_id: invitado.id,
          event_id: eventoId,
          checked_in_by: null // Como no hay autenticación requerida para esto
        });

      if (errorAsistencia) throw errorAsistencia;

      setUltimoRegistrado(invitado.name);
      toast({
        title: "¡Asistencia Registrada!",
        description: `Bienvenido/a ${invitado.name}`,
      });

      setCodigoManual("");
      cargarAsistencias(); // Recargar la lista
    } catch (error) {
      console.error('Error registrando asistencia:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la asistencia",
        variant: "destructive",
      });
    }
  };

  const iniciarEscaneo = () => {
    // En una implementación real, aquí se abriría la cámara
    const codigoSimulado = prompt("Simular código escaneado (código de invitación):");
    if (codigoSimulado) {
      registrarAsistencia(codigoSimulado);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Evento no encontrado</h2>
            <p className="text-gray-600 mb-4">No se pudo cargar la información del evento</p>
            <Button onClick={() => navigate('/')}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header con información del evento */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </Button>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Código del evento</div>
                  <div className="font-mono font-bold">{evento.event_code}</div>
                </div>
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl mb-4">{evento.name}</CardTitle>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(evento.date).toLocaleString()}</span>
                  </div>
                  {evento.location && (
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{evento.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Estadísticas */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <User className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{asistencias.length}</div>
                <div className="text-sm text-gray-600">Asistencias Registradas</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {ultimoRegistrado || "---"}
                </div>
                <div className="text-sm text-gray-600">Último Registrado</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">0</div>
                <div className="text-sm text-gray-600">Códigos Inválidos</div>
              </CardContent>
            </Card>
          </div>

          {/* Escáner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Registrar Asistencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Escáner de cámara */}
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Escanear con Cámara</h3>
                  <div className="bg-gray-100 rounded-lg p-12 min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Área de escaneo de QR</p>
                      <Button
                        onClick={iniciarEscaneo}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Iniciar Escaneo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Entrada manual */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Entrada Manual</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="codigo" className="text-base">
                        Código de Invitación
                      </Label>
                      <Input
                        id="codigo"
                        type="text"
                        placeholder="Código de invitación"
                        value={codigoManual}
                        onChange={(e) => setCodigoManual(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && registrarAsistencia(codigoManual)}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button
                      onClick={() => registrarAsistencia(codigoManual)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!codigoManual.trim()}
                    >
                      Registrar Asistencia
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de asistencias recientes */}
          {asistencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Asistencias Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {asistencias.slice(0, 10).map((asistencia, index) => {
                    const fecha = new Date(asistencia.checked_in_at).toLocaleString();
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">{asistencia.guest_name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{fecha}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TomarAsistencia;
