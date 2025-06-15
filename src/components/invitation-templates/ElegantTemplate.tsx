import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Calendar, Clock, Palette } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RSVPSection } from "./RSVPSection";
import { CountdownTimer } from "./CountdownTimer";

interface ElegantTemplateProps {
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
  defaultPets?: number;
}

export const ElegantTemplate = ({ 
  invitado, 
  evento, 
  showRSVP = false,
  maxPasses = 1,
  defaultAdults = 1,
  defaultChildren = 0,
  defaultPets = 0
}: ElegantTemplateProps) => {
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
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen">
      {/* Decoración superior */}
      <div className="h-8 bg-gradient-to-r from-amber-400 to-orange-500"></div>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header elegante */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-amber-200">
              {evento.image_url && (
                <div className="mb-6">
                  <img 
                    src={evento.image_url} 
                    alt={evento.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="border-b-2 border-amber-300 pb-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-serif text-amber-800 mb-4">
                  {evento.name}
                </h1>
                {evento.description && (
                  <p className="text-xl text-amber-700 font-light italic">
                    {evento.description}
                  </p>
                )}
              </div>
              
              <p className="text-2xl font-serif text-amber-800">
                Estimado/a {invitado.name}
              </p>
              <p className="text-lg text-amber-700 mt-2">
                Tienes el honor de estar invitado/a
              </p>
            </div>
          </div>
        </div>

        {/* Cuenta regresiva */}
        {evento.start_date && (
          <CountdownTimer targetDate={evento.start_date} className="mb-12" />
        )}

        {/* Detalles del evento en tarjetas elegantes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Fecha y hora */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-amber-600 mr-3" />
              <h3 className="text-xl font-serif text-amber-800">Fecha y Hora</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-amber-700">Fecha:</p>
                <p className="text-amber-600 capitalize font-serif">{formatDate(evento.start_date)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium text-amber-700">Hora de inicio:</p>
                  <p className="text-amber-600 font-serif">{formatTime(evento.start_date)}</p>
                </div>
                {evento.end_date && (
                  <div>
                    <p className="font-medium text-amber-700">Hora de fin:</p>
                    <p className="text-amber-600 font-serif">{formatTime(evento.end_date)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-amber-600 mr-3" />
              <h3 className="text-xl font-serif text-amber-800">Ubicación</h3>
            </div>
            
            <p className="text-amber-600 font-serif">
              {evento.location || "Por confirmar"}
            </p>
          </div>
        </div>

        {/* Código de vestimenta */}
        {evento.dress_code && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200 mb-12">
            <div className="flex items-center mb-3">
              <Palette className="w-6 h-6 text-amber-600 mr-3" />
              <h3 className="text-xl font-serif text-amber-800">Código de Vestimenta</h3>
            </div>
            <p className="text-amber-700 font-serif font-medium">{getDressCodeText(evento.dress_code)}</p>
          </div>
        )}

        {/* Sección RSVP */}
        {showRSVP && evento.id && invitado.id && (
          <div className="mb-12">
            <RSVPSection 
              eventId={evento.id} 
              guestId={invitado.id}
              guestName={invitado.name}
              maxPasses={maxPasses}
              defaultAdults={defaultAdults}
              defaultChildren={defaultChildren}
              defaultPets={defaultPets}
            />
          </div>
        )}

        {/* Código QR elegante */}
        {invitado.qr_code_data && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-200 inline-block">
              <h3 className="text-xl font-serif text-amber-800 mb-4">Código de Acceso</h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG 
                  value={invitado.qr_code_data} 
                  size={150}
                  className="border-4 border-amber-200 shadow-lg rounded-lg"
                />
              </div>
              <p className="text-sm text-amber-700 font-serif">
                Código: <span className="font-mono font-bold">{invitado.invitation_code}</span>
              </p>
              <p className="text-xs text-amber-600 mt-2 font-serif">
                Presenta este código QR en el evento
              </p>
            </div>
          </div>
        )}

        {/* Footer elegante */}
        <div className="text-center mt-12 pt-8">
          <div className="inline-block">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200">
              <p className="text-amber-700 font-serif italic">
                "La elegancia es la única belleza que nunca se desvanece"
              </p>
              <p className="text-amber-600 font-serif mt-2">
                ¡Te esperamos con gran expectativa!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="h-8 bg-gradient-to-r from-orange-500 to-amber-400"></div>
    </div>
  );
};
