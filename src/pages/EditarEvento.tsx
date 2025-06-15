import { useNavigate, useParams } from "react-router-dom";
import { useEditarEvento } from "@/hooks/useEditarEvento";
import { EventInfoForm } from "@/components/events/EventInfoForm";
import { GuestManagement } from "@/components/events/GuestManagement";
import { LoadingEvent, EventNotFound } from "@/components/events/LoadingStates";
import { EventHeader } from "@/components/events/EventHeader";
import { EventActions } from "@/components/events/EventActions";

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
    templateId,
    setTemplateId,
    images,
    setImages,
    invitados,
    setInvitados,
    guardarCambios
  } = useEditarEvento(eventoId);

  const handleBack = () => navigate('/dashboard');

  if (loadingData) {
    return <LoadingEvent />;
  }

  if (!evento) {
    return <EventNotFound onBack={handleBack} />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <EventHeader onBack={handleBack} />

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
            templateId={templateId}
            setTemplateId={setTemplateId}
            images={images}
            setImages={setImages}
            evento={evento}
            loading={loading}
          />

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
            templateId={templateId}
          />

          <EventActions
            loading={loading}
            nombreEvento={nombreEvento}
            fechaInicio={fechaInicio}
            onCancel={handleBack}
            onSave={guardarCambios}
          />
        </div>
      </div>
    </div>
  );
};

export default EditarEvento;
