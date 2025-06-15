
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CalendarDays, MapPin, Clock, Palette } from "lucide-react";
import { TemplateSelector } from "@/components/invitation-templates/TemplateSelector";

const CrearEvento = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [codigoVestimenta, setCodigoVestimenta] = useState("");
  const [templateId, setTemplateId] = useState("modern");

  const handleBack = () => navigate('/dashboard');

  const generarCodigoEvento = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${timestamp}${random}`;
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

    setLoading(true);

    try {
      const codigoEvento = generarCodigoEvento();

      const { data, error } = await supabase
        .from('events')
        .insert({
          name: nombreEvento.trim(),
          description: descripcion?.trim() || null,
          date: fechaInicio,
          start_date: fechaInicio,
          end_date: fechaFin || null,
          location: ubicacion?.trim() || null,
          event_code: codigoEvento,
          organizer_id: user?.id,
          status: 'upcoming',
          event_type: tipoEvento?.trim() || null,
          dress_code: codigoVestimenta?.trim() || null,
          template_id: templateId
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "¡Evento Creado!",
        description: `Se creó el evento "${nombreEvento}" con código ${codigoEvento}`,
      });

      navigate(`/editar-evento/${data.id}`);

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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Dashboard</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Evento</h1>
          </div>

          <div className="space-y-8">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>Información del Evento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Evento *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Ej: Boda de María y Juan"
                      value={nombreEvento}
                      onChange={(e) => setNombreEvento(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoEvento">Tipo de Evento</Label>
                    <Select value={tipoEvento} onValueChange={setTipoEvento}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Boda</SelectItem>
                        <SelectItem value="birthday">Cumpleaños</SelectItem>
                        <SelectItem value="conference">Conferencia</SelectItem>
                        <SelectItem value="corporate">Corporativo</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="workshop">Taller</SelectItem>
                        <SelectItem value="seminar">Seminario</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe tu evento..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fecha y ubicación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Fecha y Ubicación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha y Hora de Inicio *</Label>
                    <Input
                      id="fechaInicio"
                      type="datetime-local"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
                    <Input
                      id="fechaFin"
                      type="datetime-local"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="ubicacion"
                        type="text"
                        placeholder="Ej: Salón de Eventos Plaza Mayor"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoVestimenta">Código de Vestimenta</Label>
                    <Select value={codigoVestimenta} onValueChange={setCodigoVestimenta}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el código" />
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
                </div>
              </CardContent>
            </Card>

            {/* Selector de Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Template de Invitación</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelector
                  selectedTemplate={templateId}
                  onTemplateSelect={setTemplateId}
                  eventData={{
                    name: nombreEvento,
                    description: descripcion,
                    start_date: fechaInicio,
                    end_date: fechaFin,
                    location: ubicacion,
                    event_type: tipoEvento,
                    dress_code: codigoVestimenta
                  }}
                />
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={crearEvento}
                disabled={loading || !nombreEvento.trim() || !fechaInicio}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Creando..." : "Crear Evento"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearEvento;
