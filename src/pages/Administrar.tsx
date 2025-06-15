
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Download, Trash2, Search, Calendar, UserCheck, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
        .select('*');
      
      if (eventosData) {
        setEventos(eventosData);
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
          guests (name, email),
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
          guests (name, email),
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

  const estadisticas = {
    total: asistencias.length,
    hoy: asistenciasProcesadas.filter(a => 
      a.fecha === new Date().toLocaleDateString()
    ).length,
    ultimaHora: asistenciasProcesadas.filter(a => 
      Date.now() - a.timestamp < 3600000
    ).length,
    confirmados: respuestasRSVP.filter(r => r.response === 'attending').length,
    presentes: asistenciasDB.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Gestiona y monitorea las asistencias del evento
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid md:grid-cols-6 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{estadisticas.total}</div>
                <div className="text-sm text-gray-600">Total Asistencias (Local)</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{estadisticas.hoy}</div>
                <div className="text-sm text-gray-600">Hoy</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-orange-600 font-bold text-sm">1H</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{estadisticas.ultimaHora}</div>
                <div className="text-sm text-gray-600">Última Hora</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <UserCheck className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{estadisticas.confirmados}</div>
                <div className="text-sm text-gray-600">Confirmados</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <UserPlus className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{estadisticas.presentes}</div>
                <div className="text-sm text-gray-600">Presentes</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-bold text-xs">AVG</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {asistencias.length > 0 ? Math.round(asistencias.length / Math.max(1, new Set(asistenciasProcesadas.map(a => a.fecha)).size)) : 0}
                </div>
                <div className="text-sm text-gray-600">Por Día</div>
              </CardContent>
            </Card>
          </div>

          {/* Controles */}
          <Card>
            <CardHeader>
              <CardTitle>Controles de Administración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center justify-between">
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
                    Exportar CSV
                  </Button>
                  
                  <Button
                    onClick={limpiarDatos}
                    variant="destructive"
                    disabled={asistencias.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpiar Datos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invitados Confirmados */}
          <Card>
            <CardHeader>
              <CardTitle>Invitados que Confirmaron Asistencia</CardTitle>
            </CardHeader>
            <CardContent>
              {respuestasRSVP.filter(r => r.response === 'attending').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay confirmaciones de asistencia aún
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Fecha Confirmación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {respuestasRSVP
                      .filter(r => r.response === 'attending')
                      .map((rsvp) => (
                      <TableRow key={rsvp.id}>
                        <TableCell className="font-medium">{rsvp.guests?.name}</TableCell>
                        <TableCell>{rsvp.guests?.email}</TableCell>
                        <TableCell>{rsvp.events?.name}</TableCell>
                        <TableCell>{new Date(rsvp.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Presentes en el Evento */}
          <Card>
            <CardHeader>
              <CardTitle>Presentes en el Evento</CardTitle>
            </CardHeader>
            <CardContent>
              {asistenciasDB.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay asistencias registradas aún
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Hora de Llegada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asistenciasDB.map((asistencia) => (
                      <TableRow key={asistencia.id}>
                        <TableCell className="font-medium">{asistencia.guests?.name}</TableCell>
                        <TableCell>{asistencia.guests?.email}</TableCell>
                        <TableCell>{asistencia.events?.name}</TableCell>
                        <TableCell>{new Date(asistencia.checked_in_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Lista de asistencias locales */}
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
              {asistenciasFiltradas.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {asistencias.length === 0 
                    ? "No hay asistencias registradas aún" 
                    : "No se encontraron coincidencias con el filtro"
                  }
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Administrar;
