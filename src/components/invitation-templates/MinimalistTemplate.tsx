
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Calendar, Clock, Palette } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RSVPSection } from "./RSVPSection";

interface MinimalistTemplateProps {
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

export const MinimalistTemplate = ({ invitado, evento, showRSVP = false }: MinimalistTemplateProps) => {
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
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        
        {/* Header minimalista */}
        <div className="text-center mb-16">
          {evento.image_url && (
            <div className="mb-8">
              <img 
                src={evento.image_url} 
                alt={evento.name}
                className="w-full h-64 object-cover grayscale"
              />
            </div>
          )}
          
          <div className="border-b border-gray-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">
              {evento.name}
            </h1>
            
            {evento.description && (
              <p className="text-lg text-gray-600 font-light">
                {evento.description}
              </p>
            )}
          </div>
          
          <div className="pt-8">
            <p className="text-xl text-gray-800 font-light">
              {invitado.name}
            </p>
            <p className="text-gray-600 mt-2">
              Tienes una invitación
            </p>
          </div>
        </div>

        {/* Detalles del evento */}
        <div className="space-y-12">
          
          {/* Fecha */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Cuándo</h3>
            <p className="text-lg text-gray-900 capitalize">{formatDate(evento.start_date)}</p>
            <p className="text-gray-600 mt-1">
              {formatTime(evento.start_date)}
              {evento.end_date && ` - ${formatTime(evento.end_date)}`}
            </p>
          </div>

          {/* Ubicación */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Dónde</h3>
            <p className="text-lg text-gray-900">
              {evento.location || "Por confirmar"}
            </p>
          </div>

          {/* Código de vestimenta */}
          {evento.dress_code && (
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Palette className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Vestimenta</h3>
              <p className="text-lg text-gray-900">{getDressCodeText(evento.dress_code)}</p>
            </div>
          )}
        </div>

        {/* Sección RSVP */}
        {showRSVP && evento.id && invitado.id && (
          <div className="mt-16">
            <RSVPSection 
              eventId={evento.id} 
              guestId={invitado.id}
              guestName={invitado.name}
            />
          </div>
        )}

        {/* Código QR */}
        {invitado.qr_code_data && (
          <div className="text-center mt-16 pt-16 border-t border-gray-200">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-6">Acceso</h3>
            
            <div className="flex justify-center mb-4">
              <QRCodeSVG 
                value={invitado.qr_code_data} 
                size={120}
                className="border border-gray-200"
              />
            </div>
            
            <p className="text-sm text-gray-600">
              {invitado.invitation_code}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8">
          <p className="text-gray-500 font-light">
            Te esperamos
          </p>
        </div>
      </div>
    </div>
  );
};
