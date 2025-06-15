
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Invitado } from "@/hooks/useEditarEvento";

interface InvitationPreviewProps {
  invitado: Invitado | null;
  nombreEvento: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion: string;
  tipoEvento: string;
  codigoVestimenta: string;
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
  onClose
}: InvitationPreviewProps) => {
  if (!invitado) return null;

  return (
    <Dialog open={!!invitado} onOpenChange={onClose}>
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
  );
};
