import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Download, Trash2, Search, Calendar, UserCheck, UserPlus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Administrar = () => {
  const [asistencias, setAsistencias] = useState<string[]>([]);
  const [filtro, setFiltro] = useState("");
  const [eventos, setEventos] = useState<any[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>("");
  const [invitados, setInvitados] = useState<any[]>([]);
  const [asistenciasDB, setAsistenciasDB] = useState<any[]>([]);
  const [respuestasRSVP, setRespuestasRSVP] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const asistenciasGuardadas = localStorage.getItem("asistencias");
    if (asistenciasGuardadas) {
      setAsistencias(JSON.parse(asistenciasGuardadas));
    }
    cargarDatosSupabase();
  }, []);

  const cargarDatosSupabase = async () => {
    try {
      // Cargar eventos
      const { data: eventosData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (eventosData) {
        setEventos(eventosData);
        if (eventosData.length > 0 && !eventoSeleccionado) {
          setEventoSeleccionado(eventosData[0].id);
        }
      }

      // Cargar invitados
      const { data: invitadosData } = await supabase
        .from('guests')
        .select('*');
      
      if (invitadosData) {
        setInvitados(invitadosData);
      }

      // Cargar asistencias
      const { data: asistenciasData } = await supabase
        .from('attendances')
        .select(`
          *,
          guests (name, email, event_id),
          events (name)
        `);
      
      if (asistenciasData) {
        setAsistenciasDB(asistenciasData);
      }

      // Cargar respuestas RSVP
      const { data: rsvpData } = await supabase
        .from('rsvp_responses')
        .select(`
          *,
          guests (name, email, event_id),
          events (name)
        `);
      
      if (rsvpData) {
        setRespuestasRSVP(rsvpData);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const procesarAsistencias = () => {
    return asistencias.map(codigo => {
      const partes = codigo.split('-');
      const nombre = partes[0];
      const timestamp = parseInt(partes[1]);
      const fecha = new Date(timestamp);
      
      return {
        codigo,
        nombre,
        timestamp,
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString(),
      };
    });
  };

  const asistenciasProcesadas = procesarAsistencias();
  const asistenciasFiltradas = asistenciasProcesadas.filter(asistencia =>
    asistencia.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const exportarCSV = () => {
    const headers = ["Nombre", "Fecha", "Hora", "Código"];
    const rows = asistenciasProcesadas.map(a => [
      a.nombre,
      a.fecha,
      a.hora,
      a.codigo
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asistencias-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportación Exitosa",
      description: "Los datos se han exportado a CSV",
    });
  };

  const limpiarDatos = () => {
    if (confirm("¿Estás seguro de que quieres eliminar todos los registros de asistencia?")) {
      localStorage.removeItem("asistencias");
      setAsistencias([]);
      toast({
        title: "Datos Eliminados",
        description: "Todos los registros han sido eliminados",
      });
    }
  };

  // Estadísticas generales
  const estadisticasGenerales = {
    totalEventos: eventos.length,
    eventosActivos: eventos.filter(e => e.status === 'active').length,
    totalConfirmados: respuestasRSVP.filter(r => r.response === 'attending').length,
    totalPresentes: asistenciasDB.length,
    totalAsistenciasLocal: asistencias.length,
  };

  // Estadísticas por evento seleccionado
  const eventoActual = eventos.find(e => e.id === eventoSeleccionado);
  const confirmadosEvento = respuestasRSVP.filter(r => 
    r.response === 'attending' && r.guests?.event_id === eventoSeleccionado
  );
  const presentesEvento = asistenciasDB.filter(a => 
    a.guests?.event_id === eventoSeleccionado
  );

  const estadisticasEvento = {
    confirmados: confirmadosEvento.length,
    presentes: presentesEvento.length,
    invitados: invitados.filter(i => i.event_id === eventoSeleccionado).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Gestiona y monitorea las asistencias de todos los eventos
            </p>
          </div>

          {/* Filtros principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtros y Controles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2 min-w-[250px]">
                  <span className="text-sm font-medium">Evento:</span>
                  <Select value={eventoSeleccionado} onValueChange={setEventoSeleccionado}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecciona un evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los eventos</SelectItem>
                      {eventos.map((evento) => (
                        <SelectItem key={evento.id} value={evento.id}>
                          {evento.name} ({evento.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={exportarCSV}
                    variant="outline"
                    disabled={asistencias.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  
                  <Button
                    onClick={limpiarDatos}
                    variant="destructive"
                    disabled={asistencias.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Vista General</TabsTrigger>
              <TabsTrigger value="evento">Por Evento</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Estadísticas generales */}
              <div className="grid md:grid-cols-5 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{estadisticasGenerales.totalEventos}</div>
                    <div className="text-sm text-gray-600">Total Eventos</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-green-600 font-bold text-sm">ACT</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{estadisticasGenerales.eventosActivos}</div>
                    <div className="text-sm text-gray-600">Eventos Activos</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <UserCheck className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{estadisticasGenerales.totalConfirmados}</div>
                    <div className="text-sm text-gray-600">Total Confirmados</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <UserPlus className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{estadisticasGenerales.totalPresentes}</div>
                    <div className="text-sm text-gray-600">Total Presentes</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{estadisticasGenerales.totalAsistenciasLocal}</div>
                    <div className="text-sm text-gray-600">Asistencias Local</div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumen por eventos */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen por Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Invitados</TableHead>
                        <TableHead>Confirmados</TableHead>
                        <TableHead>Presentes</TableHead>
                        <TableHead>% Asistencia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventos.map((evento) => {
                        const invitadosEvento = invitados.filter(i => i.event_id === evento.id).length;
                        const confirmadosEvento = respuestasRSVP.filter(r => 
                          r.response === 'attending' && r.guests?.event_id === evento.id
                        ).length;
                        const presentesEvento = asistenciasDB.filter(a => 
                          a.guests?.event_id === evento.id
                        ).length;
                        const porcentaje = confirmadosEvento > 0 ? Math.round((presentesEvento / confirmadosEvento) * 100) : 0;

                        return (
                          <TableRow key={evento.id}>
                            <TableCell className="font-medium">{evento.name}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                evento.status === 'active' ? 'bg-green-100 text-green-800' :
                                evento.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {evento.status}
                              </span>
                            </TableCell>
                            <TableCell>{invitadosEvento}</TableCell>
                            <TableCell>{confirmadosEvento}</TableCell>
                            <TableCell>{presentesEvento}</TableCell>
                            <TableCell>{porcentaje}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evento" className="space-y-6">
              {eventoSeleccionado && eventoActual ? (
                <>
                  {/* Header del evento */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{eventoActual.name}</CardTitle>
                      <p className="text-gray-600">{eventoActual.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {new Date(eventoActual.start_date || eventoActual.date).toLocaleDateString()}</span>
                        <span>📍 {eventoActual.location}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          eventoActual.status === 'active' ? 'bg-green-100 text-green-800' :
                          eventoActual.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {eventoActual.status}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Estadísticas del evento */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{estadisticasEvento.invitados}</div>
                        <div className="text-sm text-gray-600">Invitados Totales</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <UserCheck className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{estadisticasEvento.confirmados}</div>
                        <div className="text-sm text-gray-600">Confirmaron</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <UserPlus className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{estadisticasEvento.presentes}</div>
                        <div className="text-sm text-gray-600">Presentes</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Confirmados del evento */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Invitados que Confirmaron</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {confirmadosEvento.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No hay confirmaciones para este evento
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Fecha Confirmación</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {confirmadosEvento.map((rsvp) => {
                              const estaPresente = presentesEvento.some(p => p.guest_id === rsvp.guest_id);
                              return (
                                <TableRow key={rsvp.id}>
                                  <TableCell className="font-medium">{rsvp.guests?.name}</TableCell>
                                  <TableCell>{rsvp.guests?.email}</TableCell>
                                  <TableCell>{new Date(rsvp.created_at).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      estaPresente ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {estaPresente ? 'Presente' : 'Pendiente'}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>

                  {/* Presentes del evento */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Presentes en el Evento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {presentesEvento.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No hay asistencias registradas para este evento
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Hora de Llegada</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {presentesEvento.map((asistencia) => (
                              <TableRow key={asistencia.id}>
                                <TableCell className="font-medium">{asistencia.guests?.name}</TableCell>
                                <TableCell>{asistencia.guests?.email}</TableCell>
                                <TableCell>{new Date(asistencia.checked_in_at).toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Selecciona un evento para ver los detalles</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Registro de asistencias locales - solo si hay datos */}
          {asistencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Registro de Asistencias (Local)
                  {filtro && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({asistenciasFiltradas.length} de {asistencias.length} registros)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Nombre</th>
                        <th className="text-left p-3 font-semibold">Fecha</th>
                        <th className="text-left p-3 font-semibold">Hora</th>
                        <th className="text-left p-3 font-semibold">Código</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistenciasFiltradas
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((asistencia, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{asistencia.nombre}</td>
                          <td className="p-3 text-gray-600">{asistencia.fecha}</td>
                          <td className="p-3 text-gray-600">{asistencia.hora}</td>
                          <td className="p-3 text-xs text-gray-500 font-mono">
                            {asistencia.codigo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Administrar;
