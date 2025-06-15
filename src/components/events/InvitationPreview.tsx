
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Invitado } from "@/hooks/useEditarEvento";
import { TemplateRenderer } from "../invitation-templates/TemplateRenderer";

interface InvitationPreviewProps {
  invitado: Invitado | null;
  nombreEvento: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion: string;
  tipoEvento: string;
  codigoVestimenta: string;
  templateId: string;
  onClose: () => void;
}

export const InvitationPreview = ({
  invitado,
  nombreEvento,
  descripcion,
  fechaInicio,
  fechaFin,
  ubicacion,
  tipoEvento,
  codigoVestimenta,
  templateId,
  onClose
}: InvitationPreviewProps) => {
  if (!invitado) return null;

  const handleOpenFullView = () => {
    if (invitado.invitation_code) {
      window.open(`/visualizar-invitacion?codigo=${invitado.invitation_code}`, '_blank');
    }
  };

  const eventData = {
    name: nombreEvento,
    description: descripcion,
    start_date: fechaInicio,
    end_date: fechaFin,
    location: ubicacion,
    event_type: tipoEvento,
    dress_code: codigoVestimenta
  };

  return (
    <Dialog open={!!invitado} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Preview de Invitación - {invitado.name}</DialogTitle>
            {invitado.invitation_code && (
              <Button
                onClick={handleOpenFullView}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir en nueva pestaña
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="border rounded-lg overflow-hidden bg-gray-50 w-full">
          <div className="w-full">
            <TemplateRenderer
              templateId={templateId}
              invitado={invitado}
              evento={eventData}
              showRSVP={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
