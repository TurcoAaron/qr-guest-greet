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
  UserCheck,
  Baby,
  Heart,
  RefreshCw,
  Download,
  Eye,
  Edit,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [filtro, setFiltro] = useState("");
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
      setInvitados(invitadosData || []);

      // Cargar asistencias
      const { data: asistenciasData, error: asistenciasError } = await supabase
        .from('attendances')
        .select(`
          *,
          guests (*),
          events (*)
        `);

      if (asistenciasError) throw asistenciasError;
      setAsistencias(asistenciasData || []);

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

  const procesarAsistencias = () => {
    return asistencias.map((asistencia) => {
      const invitado = invitados.find((invitado) => invitado.id === asistencia.guest_id);
      const evento = eventos.find((evento) => evento.id === asistencia.event_id);

      return {
        id: asistencia.id,
        nombre: asistencia.guests?.name || "Invitado Desconocido",
        evento: evento?.name || "Evento Desconocido",
        fecha: evento?.date || evento?.start_date || "Fecha Desconocida",
        adultosConfirmados: invitado?.adults_count || 0,
        niñosConfirmados: invitado?.children_count || 0,
        mascotasConfirmadas: (invitado as any)?.pets_count || 0,
        adultosPresentes: asistencia.actual_adults_count !== null ? asistencia.actual_adults_count : asistencia.guests?.adults_count || 0,
        niñosPresentes: asistencia.actual_children_count !== null ? asistencia.actual_children_count : asistencia.guests?.children_count || 0,
        mascotasPresentes: asistencia.actual_pets_count !== null ? asistencia.actual_pets_count : (asistencia.guests as any)?.pets_count || 0,
      };
    });
  };

  const exportarCSV = () => {
    const data = asistencias.map((asistencia) => {
      const invitado = invitados.find((invitado) => invitado.id === asistencia.guest_id);
      const evento = eventos.find((evento) => evento.id === asistencia.event_id);

      return {
        Nombre: asistencia.guests?.name || "Invitado Desconocido",
        Evento: evento?.name || "Evento Desconocido",
        Fecha: evento?.date || evento?.start_date || "Fecha Desconocida",
        AdultosConfirmados: invitado?.adults_count || 0,
        NiñosConfirmados: invitado?.children_count || 0,
        MascotasConfirmadas: (invitado as any)?.pets_count || 0,
        AdultosPresentes: asistencia.actual_adults_count !== null ? asistencia.actual_adults_count : asistencia.guests?.adults_count || 0,
        NiñosPresentes: asistencia.actual_children_count !== null ? asistencia.actual_children_count : asistencia.guests?.children_count || 0,
        MascotasPresentes: asistencia.actual_pets_count !== null ? asistencia.actual_pets_count : (asistencia.guests as any)?.pets_count || 0,
      };
    });

    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'asistencias.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const asistenciasProcesadas = procesarAsistencias();
  const asistenciasFiltradas = asistenciasProcesadas.filter(asistencia =>
    filtro === "" || asistencia.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // Estadísticas globales simplificadas
  const estadisticasGlobales = {
    totalEventos: eventos.length,
    totalInvitados: invitados.length,
    totalAsistencias: asistencias.length,
    totalAdultos: invitados.reduce((total, inv) => total + (inv.adults_count || 0), 0),
    totalNiños: invitados.reduce((total, inv) => total + (inv.children_count || 0), 0),
    totalMascotas: invitados.reduce((total, inv) => total + ((inv as any).pets_count || 0), 0),
  };

  // Estadísticas por evento
  const getEstadisticasEvento = (evento: any) => {
    const invitadosEvento = invitados.filter(inv => inv.event_id === evento.id);
    const asistenciasEvento = asistencias.filter(a => a.event_id === evento.id);
    
    return {
      confirmados: {
        adultos: invitadosEvento.reduce((total, inv) => total + (inv.adults_count || 0), 0),
        niños: invitadosEvento.reduce((total, inv) => total + (inv.children_count || 0), 0),
        mascotas: invitadosEvento.reduce((total, inv) => total + ((inv as any).pets_count || 0), 0),
      },
      presentes: {
        adultos: asistenciasEvento.reduce((total, a) => total + (a.actual_adults_count || (a.guests as any)?.adults_count || 0), 0),
        niños: asistenciasEvento.reduce((total, a) => total + (a.actual_children_count || (a.guests as any)?.children_count || 0), 0),
        mascotas: asistenciasEvento.reduce((total, a) => total + (a.actual_pets_count || (a.guests as any)?.pets_count || 0), 0),
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
          <Button onClick={exportarCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Estadísticas Globales Simplificadas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{estadisticasGlobales.totalEventos}</div>
            <div className="text-sm text-gray-600">Eventos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{estadisticasGlobales.totalInvitados}</div>
            <div className="text-sm text-gray-600">Invitados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{estadisticasGlobales.totalAdultos}</div>
            <div className="text-sm text-gray-600">Adultos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Baby className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{estadisticasGlobales.totalNiños}</div>
            <div className="text-sm text-gray-600">Niños</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">{estadisticasGlobales.totalMascotas}</div>
            <div className="text-sm text-gray-600">Mascotas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{estadisticasGlobales.totalAsistencias}</div>
            <div className="text-sm text-gray-600">Presentes</div>
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
