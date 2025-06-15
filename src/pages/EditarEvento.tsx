
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { useEditarEvento } from "@/hooks/useEditarEvento";
import { EventInfoForm } from "@/components/events/EventInfoForm";
import { GuestManagement } from "@/components/events/GuestManagement";

const EditarEvento = () => {
  const { eventoId } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    loadingData,
    evento,
    nombreEvento,
    setNombreEvento,
    descripcion,
    setDescripcion,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    ubicacion,
    setUbicacion,
    status,
    setStatus,
    tipoEvento,
    setTipoEvento,
    codigoVestimenta,
    setCodigoVestimenta,
    invitados,
    setInvitados,
    guardarCambios
  } = useEditarEvento(eventoId);

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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
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
          <EventInfoForm
            nombreEvento={nombreEvento}
            setNombreEvento={setNombreEvento}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            fechaInicio={fechaInicio}
            setFechaInicio={setFechaInicio}
            fechaFin={fechaFin}
            setFechaFin={setFechaFin}
            ubicacion={ubicacion}
            setUbicacion={setUbicacion}
            status={status}
            setStatus={setStatus}
            tipoEvento={tipoEvento}
            setTipoEvento={setTipoEvento}
            codigoVestimenta={codigoVestimenta}
            setCodigoVestimenta={setCodigoVestimenta}
            evento={evento}
          />

          {/* Lista de invitados */}
          <GuestManagement
            invitados={invitados}
            setInvitados={setInvitados}
            nombreEvento={nombreEvento}
            descripcion={descripcion}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            ubicacion={ubicacion}
            tipoEvento={tipoEvento}
            codigoVestimenta={codigoVestimenta}
          />

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
