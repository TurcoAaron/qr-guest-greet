
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RSVPSection } from "./RSVPSection";

interface TemplateProps {
  invitado: {
    id?: string;
    name: string;
    invitation_code?: string;
    qr_code_data?: string;
  };
  evento: {
    id?: string;
    name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    event_type?: string;
    dress_code?: string;
    image_url?: string;
  };
  showRSVP?: boolean;
}

export const ModernTemplate = ({ invitado, evento, showRSVP = false }: TemplateProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header con imagen opcional */}
          <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
            {evento.image_url && (
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${evento.image_url})`}}>
                <div className="h-full bg-black bg-opacity-40 flex items-end p-6">
                  <h1 className="text-white text-3xl font-bold">{evento.name}</h1>
                </div>
              </div>
            )}
            
            {!evento.image_url && (
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <h1 className="text-white text-3xl font-bold text-center">{evento.name}</h1>
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <div className="bg-white shadow-2xl px-8 py-6">
            {/* Saludo personalizado */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-lg text-gray-600">Estimado/a</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{invitado.name}</h2>
              <p className="text-gray-600 mt-2">Te invitamos cordialmente a nuestro evento</p>
            </div>

            {/* Descripción */}
            {evento.description && (
              <div className="text-center mb-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{evento.description}</p>
              </div>
            )}

            {/* Detalles del evento */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Fecha</h3>
                  <p className="text-gray-600">{formatDate(evento.start_date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg">
                <Clock className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Hora</h3>
                  <p className="text-gray-600">
                    {formatTime(evento.start_date)}
                    {evento.end_date && ` - ${formatTime(evento.end_date)}`}
                  </p>
                </div>
              </div>

              {evento.location && (
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Ubicación</h3>
                    <p className="text-gray-600">{evento.location}</p>
                  </div>
                </div>
              )}

              {evento.dress_code && (
                <div className="flex items-center space-x-4 p-4 bg-pink-50 rounded-lg">
                  <span className="text-2xl flex-shrink-0">👔</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Código de Vestimenta</h3>
                    <p className="text-gray-600">{evento.dress_code}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sección RSVP */}
            {showRSVP && invitado.id && evento.id && (
              <div className="mb-8">
                <RSVPSection 
                  guestId={invitado.id} 
                  eventId={evento.id}
                  guestName={invitado.name}
                />
              </div>
            )}

            {/* Código QR */}
            {invitado.qr_code_data && (
              <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tu Código de Acceso
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <QRCodeSVG
                      value={invitado.qr_code_data}
                      size={150}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Presenta este código QR al llegar al evento
                </p>
                {invitado.invitation_code && (
                  <p className="text-xs text-gray-500 font-mono">
                    Código: {invitado.invitation_code}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-6 rounded-b-3xl">
            <p className="text-lg font-medium">¡Esperamos verte pronto!</p>
            <p className="text-sm opacity-90 mt-1">Confirma tu asistencia para reservar tu lugar</p>
          </div>
        </div>
      </div>
    </div>
  );
};
