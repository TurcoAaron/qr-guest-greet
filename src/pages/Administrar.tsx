
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  CheckCircle,
  RefreshCw,
  Eye,
  Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Evento {
  id: string;
  name: string;
  date: string;
  start_date: string;
  status: string;
}

interface Invitado {
  id: string;
  event_id: string;
  adults_count: number;
  children_count: number;
  pets_count: number;
}

interface Asistencia {
  id: string;
  guest_id: string;
  event_id: string;
  actual_adults_count: number | null;
  actual_children_count: number | null;
  actual_pets_count: number | null;
  guests: {
    name: string;
    adults_count: number;
    children_count: number;
    pets_count: number;
  };
}

const Administrar = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const cargarDatos = async () => {
    setLoadingEventos(true);
    try {
      const { data: eventosData, error: eventosError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventosError) throw eventosError;
      setEventos(eventosData || []);

      // Cargar invitados con mascotas
      const { data: invitadosData, error: invitadosError } = await supabase
        .from('guests')
        .select('*');

      if (invitadosError) throw invitadosError;
      setInvitados((invitadosData || []).map(inv => ({
        id: inv.id,
        event_id: inv.event_id,
        adults_count: inv.adults_count || 0,
        children_count: inv.children_count || 0,
        pets_count: (inv as any).pets_count || 0,
      })));

      // Cargar asistencias
      const { data: asistenciasData, error: asistenciasError } = await supabase
        .from('attendances')
        .select(`
          *,
          guests (*),
          events (*)
        `);

      if (asistenciasError) throw asistenciasError;
      setAsistencias((asistenciasData || []).map(a => ({
        id: a.id,
        guest_id: a.guest_id,
        event_id: a.event_id,
        actual_adults_count: (a as any).actual_adults_count || null,
        actual_children_count: (a as any).actual_children_count || null,
        actual_pets_count: (a as any).actual_pets_count || null,
        guests: {
          name: a.guests?.name || "Invitado Desconocido",
          adults_count: a.guests?.adults_count || 0,
          children_count: a.guests?.children_count || 0,
          pets_count: (a.guests as any)?.pets_count || 0,
        }
      })));

    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoadingEventos(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Estadísticas globales simplificadas
  const estadisticasGlobales = {
    totalEventos: eventos.length,
    totalInvitados: invitados.length,
    totalAsistencias: asistencias.length,
  };

  // Estadísticas por evento
  const getEstadisticasEvento = (evento: any) => {
    const invitadosEvento = invitados.filter(inv => inv.event_id === evento.id);
    const asistenciasEvento = asistencias.filter(a => a.event_id === evento.id);
    
    return {
      confirmados: {
        adultos: invitadosEvento.reduce((total, inv) => total + (inv.adults_count || 0), 0),
        niños: invitadosEvento.reduce((total, inv) => total + (inv.children_count || 0), 0),
        mascotas: invitadosEvento.reduce((total, inv) => total + (inv.pets_count || 0), 0),
      },
      presentes: {
        adultos: asistenciasEvento.reduce((total, a) => total + (a.actual_adults_count || a.guests?.adults_count || 0), 0),
        niños: asistenciasEvento.reduce((total, a) => total + (a.actual_children_count || a.guests?.children_count || 0), 0),
        mascotas: asistenciasEvento.reduce((total, a) => total + (a.actual_pets_count || a.guests?.pets_count || 0), 0),
      },
      totalInvitados: invitadosEvento.length,
      totalPresentes: asistenciasEvento.length,
    };
  };

  if (loadingEventos) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <div className="space-x-2">
          <Button onClick={cargarDatos} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas Globales Simplificadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-3xl font-bold text-blue-600">{estadisticasGlobales.totalEventos}</div>
            <div className="text-sm text-gray-600">Eventos Totales</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <div className="text-3xl font-bold text-green-600">{estadisticasGlobales.totalInvitados}</div>
            <div className="text-sm text-gray-600">Invitados Totales</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <div className="text-3xl font-bold text-purple-600">{estadisticasGlobales.totalAsistencias}</div>
            <div className="text-sm text-gray-600">Asistencias Confirmadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Eventos con Estadísticas Resumidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Eventos y Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventos.map((evento) => {
              const stats = getEstadisticasEvento(evento);
              const porcentajeAsistencia = stats.totalInvitados > 0 
                ? Math.round((stats.totalPresentes / stats.totalInvitados) * 100) 
                : 0;

              return (
                <div key={evento.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{evento.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(evento.start_date || evento.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <Badge variant={evento.status === 'active' ? 'default' : 'secondary'}>
                      {evento.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Confirmados */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-medium text-blue-800 mb-2">Confirmados</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Adultos:</span>
                          <span className="font-semibold">{stats.confirmados.adultos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Niños:</span>
                          <span className="font-semibold">{stats.confirmados.niños}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mascotas:</span>
                          <span className="font-semibold">{stats.confirmados.mascotas}</span>
                        </div>
                      </div>
                    </div>

                    {/* Presentes */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-medium text-green-800 mb-2">Presentes</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Adultos:</span>
                          <span className="font-semibold">{stats.presentes.adultos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Niños:</span>
                          <span className="font-semibold">{stats.presentes.niños}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mascotas:</span>
                          <span className="font-semibold">{stats.presentes.mascotas}</span>
                        </div>
                      </div>
                    </div>

                    {/* Resumen */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-800 mb-2">Resumen</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Invitados:</span>
                          <span className="font-semibold">{stats.totalInvitados}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Asistencia:</span>
                          <span className="font-semibold">{porcentajeAsistencia}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/evento/${evento.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/editar-evento/${evento.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Administrar;
