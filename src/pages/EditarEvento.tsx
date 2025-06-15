import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Calendar, Users, Save, Eye, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { QRCodeSVG } from "qrcode.react";

interface Invitado {
  id?: string;
  name: string;
  email: string;
  phone: string;
  invitation_code?: string;
  qr_code_data?: string;
}

interface Evento {
  id: string;
  name: string;
  description: string;
  date: string;
  start_date: string;
  end_date: string;
  location: string;
  event_code: string;
  status: string;
  event_type: string;
  dress_code: string;
}

const EditarEvento = () => {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Estado del evento
  const [evento, setEvento] = useState<Evento | null>(null);
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [tipoEvento, setTipoEvento] = useState("");
  const [codigoVestimenta, setCodigoVestimenta] = useState("");
  
  // Estado de invitados
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [previewInvitado, setPreviewInvitado] = useState<Invitado | null>(null);

  useEffect(() => {
    if (eventoId) {
      cargarEvento();
    }
  }, [eventoId]);

  const cargarEvento = async () => {
    try {
      // Cargar evento
      const { data: eventoData, error: eventoError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventoId)
        .eq('organizer_id', user?.id)
        .single();

      if (eventoError) throw eventoError;

      setEvento(eventoData);
      setNombreEvento(eventoData.name);
      setDescripcion(eventoData.description || "");
      setFecha(eventoData.date);
      setFechaInicio(eventoData.start_date || eventoData.date);
      setFechaFin(eventoData.end_date || "");
      setUbicacion(eventoData.location || "");
      setStatus(eventoData.status);
      setTipoEvento(eventoData.event_type || "");
      setCodigoVestimenta(eventoData.dress_code || "");

      // Cargar invitados
      const { data: invitadosData, error: invitadosError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventoId)
        .order('name');

      if (invitadosError) throw invitadosError;

      setInvitados(invitadosData || []);
    } catch (error) {
      console.error('Error cargando evento:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el evento",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoadingData(false);
    }
  };

  const agregarInvitado = () => {
    setInvitados([...invitados, { name: "", email: "", phone: "" }]);
  };

  const eliminarInvitado = async (index: number) => {
    const invitado = invitados[index];
    
    if (invitado.id) {
      try {
        const { error } = await supabase
          .from('guests')
          .delete()
          .eq('id', invitado.id);

        if (error) throw error;

        toast({
          title: "Invitado eliminado",
          description: `Se eliminó a ${invitado.name}`,
        });
      } catch (error) {
        console.error('Error eliminando invitado:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el invitado",
          variant: "destructive",
        });
        return;
      }
    }

    setInvitados(invitados.filter((_, i) => i !== index));
  };

  const actualizarInvitado = (index: number, field: keyof Invitado, value: string) => {
    const nuevosInvitados = [...invitados];
    nuevosInvitados[index][field] = value;
    setInvitados(nuevosInvitados);
  };

  const generarCodigoInvitacion = (index: number) => {
    return `INV${Date.now().toString().slice(-6)}${(index + 1).toString().padStart(2, '0')}`;
  };

  const guardarCambios = async () => {
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

    const invitadosValidos = invitados.filter(inv => inv.name.trim());

    setLoading(true);

    try {
      // Actualizar evento
      const { error: errorEvento } = await supabase
        .from('events')
        .update({
          name: nombreEvento.trim(),
          description: descripcion.trim() || null,
          date: fechaInicio,
          start_date: fechaInicio,
          end_date: fechaFin || null,
          location: ubicacion.trim() || null,
          status: status,
          event_type: tipoEvento.trim() || null,
          dress_code: codigoVestimenta.trim() || null
        })
        .eq('id', eventoId);

      if (errorEvento) throw errorEvento;

      // Procesar invitados
      for (const [index, invitado] of invitadosValidos.entries()) {
        if (invitado.id) {
          // Actualizar invitado existente
          const { error } = await supabase
            .from('guests')
            .update({
              name: invitado.name.trim(),
              email: invitado.email.trim() || null,
              phone: invitado.phone.trim() || null
            })
            .eq('id', invitado.id);

          if (error) throw error;
        } else {
          // Crear nuevo invitado
          const codigoInvitacion = generarCodigoInvitacion(index);
          const qrData = JSON.stringify({
            event_id: eventoId,
            event_name: nombreEvento,
            guest_name: invitado.name,
            invitation_code: codigoInvitacion
          });

          const { error } = await supabase
            .from('guests')
            .insert({
              event_id: eventoId,
              name: invitado.name.trim(),
              email: invitado.email.trim() || null,
              phone: invitado.phone.trim() || null,
              invitation_code: codigoInvitacion,
              qr_code_data: qrData
            });

          if (error) throw error;
        }
      }

      toast({
        title: "¡Cambios Guardados!",
        description: `Se actualizó el evento "${nombreEvento}"`,
      });

      navigate('/dashboard');

    } catch (error) {
      console.error('Error guardando cambios:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mostrarPreview = (invitado: Invitado) => {
    setPreviewInvitado(invitado);
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Evento no encontrado</h2>
            <p className="text-gray-600 mb-4">No se pudo encontrar el evento solicitado.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
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
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <CardTitle className="text-2xl">Editar Evento</CardTitle>
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

              <div className="grid md:grid-cols-2 gap-6">
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
              </div>

              <div>
                <Label htmlFor="status">Estado del Evento</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Próximo</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">Código del Evento</Label>
                <p className="font-mono bg-white px-3 py-2 rounded border mt-1">{evento.event_code}</p>
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
                  <div key={invitado.id || index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
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
                    <div className="flex items-end space-x-2">
                      {invitado.invitation_code && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => mostrarPreview(invitado)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Preview de Invitación - {invitado.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg">
                                <div className="text-center mb-4">
                                  <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Estás Invitado!</h3>
                                  <p className="text-lg text-purple-600">Querido/a {invitado.name}</p>
                                </div>
                                
                                <div className="bg-white p-4 rounded-lg mb-4">
                                  <h4 className="text-xl font-bold text-center mb-3">{nombreEvento}</h4>
                                  {descripcion && (
                                    <p className="text-gray-600 text-center mb-3">{descripcion}</p>
                                  )}
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="w-4 h-4 text-purple-600" />
                                      <span className="text-sm">
                                        {new Date(fechaInicio).toLocaleDateString('es-ES', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4 text-purple-600" />
                                      <span className="text-sm">
                                        {new Date(fechaInicio).toLocaleTimeString('es-ES', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })} hrs
                                        {fechaFin && ` - ${new Date(fechaFin).toLocaleTimeString('es-ES', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })} hrs`}
                                      </span>
                                    </div>
                                    {ubicacion && (
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm">{ubicacion}</span>
                                      </div>
                                    )}
                                    {tipoEvento && (
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm">Tipo: {tipoEvento}</span>
                                      </div>
                                    )}
                                    {codigoVestimenta && (
                                      <div className="flex items-center space-x-2">
                                        <span className="w-4 h-4 text-purple-600">👔</span>
                                        <span className="text-sm">Vestimenta: {codigoVestimenta}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {invitado.qr_code_data && (
                                  <div className="text-center">
                                    <div className="bg-white p-4 rounded-lg inline-block">
                                      <QRCodeSVG
                                        value={invitado.qr_code_data}
                                        size={120}
                                        level="M"
                                        includeMargin={true}
                                      />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Código: {invitado.invitation_code}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarInvitado(index)}
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
                  onClick={guardarCambios}
                  disabled={loading || !nombreEvento.trim() || !fechaInicio}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditarEvento;
