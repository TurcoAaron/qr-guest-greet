
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Calendar, Clock, Palette, Building2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RSVPSection } from "./RSVPSection";

interface CorporateTemplateProps {
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

export const CorporateTemplate = ({ invitado, evento, showRSVP = false }: CorporateTemplateProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm", { locale: es });
    } catch {
      return "";
    }
  };

  const getDressCodeText = (code: string) => {
    const codes: { [key: string]: string } = {
      'formal': 'Formal',
      'semi-formal': 'Semi-formal',
      'casual': 'Casual',
      'business': 'Ejecutivo',
      'cocktail': 'Cocktail',
      'black-tie': 'Etiqueta',
      'white-tie': 'Etiqueta Rigurosa',
      'theme': 'Temático'
    };
    return codes[code] || code;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header corporativo */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {evento.image_url && (
            <div className="mb-8 text-center">
              <img 
                src={evento.image_url} 
                alt={evento.name}
                className="w-full max-w-2xl mx-auto h-48 object-cover rounded-lg border-2 border-white shadow-lg"
              />
            </div>
          )}
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Building2 className="w-16 h-16 text-blue-300" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {evento.name}
            </h1>
            
            {evento.description && (
              <p className="text-xl text-blue-100 mb-6">
                {evento.description}
              </p>
            )}
            
            <div className="border-t border-blue-300 pt-6">
              <p className="text-2xl font-semibold">
                Estimado/a {invitado.name}
              </p>
              <p className="text-lg text-blue-100 mt-2">
                Cordialmente le invitamos a participar en este evento profesional
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Información del evento */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">
            Detalles del Evento
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Fecha y hora */}
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-slate-800">Fecha y Horario</h3>
              </div>
              
              <div className="space-y-3 pl-9">
                <div>
                  <p className="font-medium text-slate-700">Fecha:</p>
                  <p className="text-slate-600 capitalize">{formatDate(evento.start_date)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-slate-700">Inicio:</p>
                    <p className="text-slate-600">{formatTime(evento.start_date)}</p>
                  </div>
                  {evento.end_date && (
                    <div>
                      <p className="font-medium text-slate-700">Fin:</p>
                      <p className="text-slate-600">{formatTime(evento.end_date)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-slate-800">Ubicación</h3>
              </div>
              
              <div className="pl-9">
                <p className="text-slate-600">
                  {evento.location || "Por confirmar"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Código de vestimenta */}
        {evento.dress_code && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <Palette className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-slate-800">Código de Vestimenta</h3>
            </div>
            <p className="text-slate-600 pl-9 font-medium">{getDressCodeText(evento.dress_code)}</p>
          </div>
        )}

        {/* Sección RSVP */}
        {showRSVP && evento.id && invitado.id && (
          <div className="mb-8">
            <RSVPSection 
              eventId={evento.id} 
              guestId={invitado.id}
              guestName={invitado.name}
            />
          </div>
        )}

        {/* Código QR */}
        {invitado.qr_code_data && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Código de Acceso</h3>
            
            <div className="flex justify-center mb-4">
              <QRCodeSVG 
                value={invitado.qr_code_data} 
                size={150}
                className="border-2 border-slate-300 shadow-lg rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                Código de invitación: 
                <span className="font-mono font-bold ml-2 bg-slate-100 px-2 py-1 rounded">
                  {invitado.invitation_code}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Presente este código QR para el registro de asistencia
              </p>
            </div>
          </div>
        )}

        {/* Footer profesional */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-600 mb-2">
            Agradecemos su participación en este evento profesional
          </p>
          <p className="text-sm text-slate-500">
            Para consultas adicionales, por favor contacte al organizador del evento
          </p>
        </div>
      </div>
    </div>
  );
};
