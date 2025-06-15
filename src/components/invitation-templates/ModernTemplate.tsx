import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Shirt } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RSVPSection } from "./RSVPSection";
import QRCode from "qrcode.react";

interface ModernTemplateProps {
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
  maxPasses?: number;
  defaultAdults?: number;
  defaultChildren?: number;
}

export const ModernTemplate = ({ 
  invitado, 
  evento, 
  showRSVP = false,
  maxPasses,
  defaultAdults,
  defaultChildren
}: ModernTemplateProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      {/* Header con imagen o degradado */}
      <div className={`relative h-80 ${evento.image_url ? '' : 'bg-gradient-to-r from-blue-600 to-purple-600'} flex items-center justify-center`}>
        {evento.image_url ? (
          <>
            <img 
              src={evento.image_url} 
              alt={evento.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </>
        ) : null}
        
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{evento.name}</h1>
          {evento.description && (
            <p className="text-xl md:text-2xl opacity-90">{evento.description}</p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Saludo personalizado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            ¡Hola, {invitado.name}!
          </h2>
          <p className="text-lg text-gray-600">
            Nos complace invitarte a este evento especial
          </p>
        </div>

        {/* Detalles del evento */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Información de fecha y hora */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Fecha y Hora</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-700">Fecha:</p>
                <p className="text-gray-600 capitalize">{formatDate(evento.start_date)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium text-gray-700">Hora de inicio:</p>
                  <p className="text-gray-600">{formatTime(evento.start_date)}</p>
                </div>
                {evento.end_date && (
                  <div>
                    <p className="font-medium text-gray-700">Hora de fin:</p>
                    <p className="text-gray-600">{formatTime(evento.end_date)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información de ubicación */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Ubicación</h3>
            </div>
            
            <p className="text-gray-600">
              {evento.location || "Por confirmar"}
            </p>
          </div>
        </div>

        {/* Código de vestimenta */}
        {evento.dress_code && (
          <div className="bg-purple-50 rounded-xl p-6 mb-12">
            <div className="flex items-center mb-3">
              <Palette className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Código de Vestimenta</h3>
            </div>
            <p className="text-gray-700 font-medium">{getDressCodeText(evento.dress_code)}</p>
          </div>
        )}

        {/* Sección RSVP */}
        {showRSVP && invitado.id && evento.id && (
          <div className="mt-8">
            <RSVPSection
              guestId={invitado.id}
              eventId={evento.id}
              guestName={invitado.name}
              maxPasses={maxPasses}
              defaultAdults={defaultAdults}
              defaultChildren={defaultChildren}
            />
          </div>
        )}

        {/* Código QR */}
        {invitado.qr_code_data && (
          <div className="text-center bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Código de Acceso</h3>
            <div className="flex justify-center mb-4">
              <QRCode 
                value={invitado.qr_code_data} 
                size={150}
                className="border-4 border-white shadow-lg rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600">
              Código: <span className="font-mono font-bold">{invitado.invitation_code}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Presenta este código QR en el evento
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            ¡Esperamos verte pronto!
          </p>
        </div>
      </div>
    </div>
  );
};
