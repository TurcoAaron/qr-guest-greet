
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Calendar, Users, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Invitado {
  name: string;
  email: string;
}

const CrearEvento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estado del evento
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  
  // Estado de invitados
  const [invitados, setInvitados] = useState<Invitado[]>([
    { name: "", email: "" }
  ]);

  const agregarInvitado = () => {
    setInvitados([...invitados, { name: "", email: "" }]);
  };

  const eliminarInvitado = (index: number) => {
    if (invitados.length > 1) {
      setInvitados(invitados.filter((_, i) => i !== index));
    }
  };

  const actualizarInvitado = (index: number, field: keyof Invitado, value: string) => {
    const nuevosInvitados = [...invitados];
    nuevosInvitados[index][field] = value;
    setInvitados(nuevosInvitados);
  };

  const generarCodigoEvento = () => {
    return `EVT${Date.now().toString().slice(-6)}`;
  };

  const generarCodigoInvitacion = (index: number) => {
    return `INV${Date.now().toString().slice(-6)}${(index + 1).toString().padStart(2, '0')}`;
  };

  const crearEvento = async () => {
    // Validaciones
    if (!nombreEvento.trim()) {
      toast({
        title: "Error",
        description: "El nombre del evento es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!fecha) {
      toast({
        title: "Error",
        description: "La fecha del evento es requerida",
        variant: "destructive",
      });
      return;
    }

    const invitadosValidos = invitados.filter(inv => inv.name.trim());
    if (invitadosValidos.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un invitado",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Debe estar autenticado para crear eventos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Crear el evento
      const codigoEvento = generarCodigoEvento();
      const { data: evento, error: errorEvento } = await supabase
        .from('events')
        .insert({
          name: nombreEvento.trim(),
          description: descripcion.trim() || null,
          date: fecha,
          location: ubicacion.trim() || null,
          organizer_id: user.id,
          event_code: codigoEvento,
          status: 'upcoming'
        })
        .select()
        .single();

      if (errorEvento) throw errorEvento;

      // Crear los invitados
      const invitadosParaCrear = invitadosValidos.map((invitado, index) => {
        const codigoInvitacion = generarCodigoInvitacion(index);
        const qrData = JSON.stringify({
          event_id: evento.id,
          event_name: nombreEvento,
          guest_name: invitado.name,
          invitation_code: codigoInvitacion
        });

        return {
          event_id: evento.id,
          name: invitado.name.trim(),
          email: invitado.email.trim() || null,
          invitation_code: codigoInvitacion,
          qr_code_data: qrData
        };
      });

      const { error: errorInvitados } = await supabase
        .from('guests')
        .insert(invitadosParaCrear);

      if (errorInvitados) throw errorInvitados;

      toast({
        title: "¡Evento Creado!",
        description: `Se creó el evento "${nombreEvento}" con ${invitadosValidos.length} invitados`,
      });

      // Redirigir al dashboard o a la página del evento
      navigate('/dashboard');

    } catch (error) {
      console.error('Error creando evento:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el evento. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al Dashboard</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-2xl">Crear Nuevo Evento</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Información del evento */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Información del Evento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombre">Nombre del Evento *</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Nombre del evento"
                    value={nombreEvento}
                    onChange={(e) => setNombreEvento(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fecha">Fecha y Hora *</Label>
                  <Input
                    id="fecha"
                    type="datetime-local"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  type="text"
                  placeholder="Lugar donde se realizará el evento"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción del evento (opcional)"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de invitados */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Invitados ({invitados.filter(inv => inv.name.trim()).length})</span>
                </CardTitle>
                <Button onClick={agregarInvitado} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Invitado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitados.map((invitado, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Nombre del invitado"
                        value={invitado.name}
                        onChange={(e) => actualizarInvitado(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Email (opcional)"
                        value={invitado.email}
                        onChange={(e) => actualizarInvitado(index, 'email', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => eliminarInvitado(index)}
                      disabled={invitados.length === 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={crearEvento}
                  disabled={loading || !nombreEvento.trim() || !fecha}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Creando..." : "Crear Evento"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrearEvento;
