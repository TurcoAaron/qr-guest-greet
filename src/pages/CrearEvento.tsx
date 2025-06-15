import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Calendar, Users, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Invitado {
  name: string;
  email: string;
  phone: string;
}

const CrearEvento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estado del evento
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [codigoVestimenta, setCodigoVestimenta] = useState("");
  const [codigoEvento, setCodigoEvento] = useState("");
  const [templateId, setTemplateId] = useState("modern");
  
  // Estado de invitados
  const [invitados, setInvitados] = useState<Invitado[]>([
    { name: "", email: "", phone: "" }
  ]);

  const agregarInvitado = () => {
    setInvitados([...invitados, { name: "", email: "", phone: "" }]);
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

  const validarCodigoUnico = async (codigo: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('event_code', codigo)
      .maybeSingle();

    if (error) {
      console.error('Error validando código:', error);
      return false;
    }

    return !data; // Retorna true si no existe (es único)
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

    if (!codigoEvento.trim()) {
      toast({
        title: "Error",
        description: "El código del evento es requerido",
        variant: "destructive",
      });
      return;
    }

    // Validar formato del código (solo letras, números y guiones)
    const codigoLimpio = codigoEvento.trim().toUpperCase();
    if (!/^[A-Z0-9-]+$/.test(codigoLimpio)) {
      toast({
        title: "Error",
        description: "El código solo puede contener letras, números y guiones",
        variant: "destructive",
      });
      return;
    }

    if (!fechaInicio) {
      toast({
        title: "Error",
        description: "La fecha de inicio es requerida",
        variant: "destructive",
      });
      return;
    }

    if (fechaFin && fechaFin < fechaInicio) {
      toast({
        title: "Error",
        description: "La fecha de fin no puede ser anterior a la fecha de inicio",
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
      // Verificar que el código sea único
      const esUnico = await validarCodigoUnico(codigoLimpio);
      if (!esUnico) {
        toast({
          title: "Error",
          description: "Este código de evento ya existe. Por favor usa otro código",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 1. Crear el evento con el código personalizado
      const { data: evento, error: errorEvento } = await supabase
        .from('events')
        .insert({
          name: nombreEvento.trim(),
          description: descripcion.trim() || null,
          date: fechaInicio,
          start_date: fechaInicio,
          end_date: fechaFin || null,
          location: ubicacion.trim() || null,
          organizer_id: user.id,
          event_code: codigoLimpio,
          status: 'upcoming',
          event_type: tipoEvento.trim() || null,
          dress_code: codigoVestimenta.trim() || null,
          template_id: templateId
        })
        .select()
        .single();

      if (errorEvento) throw errorEvento;

      // 2. Crear invitados con código INV-{codigoEvento}-{NN}
      const invitadosParaCrear = invitadosValidos.map((invitado, index) => {
        // Código personalizado de invitación:
        const numeracion = (index + 1).toString().padStart(2, '0');
        const codigoInvitacion = `INV-${codigoLimpio}-${numeracion}`;
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
          phone: invitado.phone.trim() || null,
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
        description: `Se creó el evento "${nombreEvento}" con código "${codigoLimpio}" y ${invitadosValidos.length} invitados`,
      });

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
                  <Label htmlFor="codigoEvento">Código del Evento *</Label>
                  <Input
                    id="codigoEvento"
                    type="text"
                    placeholder="ej: BODA2024, CONF-TECH, CUMPLE-JUAN"
                    value={codigoEvento}
                    onChange={(e) => setCodigoEvento(e.target.value.toUpperCase())}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo letras, números y guiones. Debe ser único.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="tipo">Tipo de Evento</Label>
                  <Select value={tipoEvento} onValueChange={setTipoEvento}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona el tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conferencia</SelectItem>
                      <SelectItem value="wedding">Boda</SelectItem>
                      <SelectItem value="birthday">Cumpleaños</SelectItem>
                      <SelectItem value="corporate">Corporativo</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="workshop">Taller</SelectItem>
                      <SelectItem value="seminar">Seminario</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="codigoVestimenta">Código de Vestimenta</Label>
                  <Select value={codigoVestimenta} onValueChange={setCodigoVestimenta}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona el código de vestimenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="semi-formal">Semi-formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="business">Ejecutivo</SelectItem>
                      <SelectItem value="cocktail">Cocktail</SelectItem>
                      <SelectItem value="black-tie">Etiqueta</SelectItem>
                      <SelectItem value="white-tie">Etiqueta Rigurosa</SelectItem>
                      <SelectItem value="theme">Temático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="template">Template de Invitación</Label>
                  <Select value={templateId} onValueChange={setTemplateId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona el template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="elegant">Elegante</SelectItem>
                      <SelectItem value="festive">Festivo</SelectItem>
                      <SelectItem value="corporate">Corporativo</SelectItem>
                      <SelectItem value="minimalist">Minimalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fechaInicio">Fecha y Hora de Inicio *</Label>
                  <Input
                    id="fechaInicio"
                    type="datetime-local"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
                  <Input
                    id="fechaFin"
                    type="datetime-local"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
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
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-xs text-gray-600">Nombre</Label>
                      <Input
                        type="text"
                        placeholder="Nombre del invitado"
                        value={invitado.name}
                        onChange={(e) => actualizarInvitado(index, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Email</Label>
                      <Input
                        type="email"
                        placeholder="Email (opcional)"
                        value={invitado.email}
                        onChange={(e) => actualizarInvitado(index, 'email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Teléfono</Label>
                      <Input
                        type="tel"
                        placeholder="Teléfono (opcional)"
                        value={invitado.phone}
                        onChange={(e) => actualizarInvitado(index, 'phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
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
                  disabled={loading || !nombreEvento.trim() || !codigoEvento.trim() || !fechaInicio}
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
