
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Calendar, Clock, Palette, PartyPopper } from "lucide-react";
import QRCode from "qrcode.react";
import { RSVPSection } from "./RSVPSection";

interface FestiveTemplateProps {
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

export const FestiveTemplate = ({ invitado, evento, showRSVP = false }: FestiveTemplateProps) => {
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
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 min-h-screen relative overflow-hidden">
      {/* Decoraciones festivas */}
      <div className="absolute top-10 left-10 text-6xl animate-bounce">🎉</div>
      <div className="absolute top-20 right-16 text-4xl animate-pulse">🎊</div>
      <div className="absolute bottom-20 left-16 text-5xl animate-bounce">🎈</div>
      <div className="absolute bottom-10 right-10 text-4xl animate-pulse">🌟</div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        
        {/* Header festivo */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-dashed border-pink-300 relative">
            {/* Confetti decoration */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full"></div>
            
            {evento.image_url && (
              <div className="mb-6">
                <img 
                  src={evento.image_url} 
                  alt={evento.name}
                  className="w-full h-48 object-cover rounded-xl border-4 border-rainbow"
                  style={{
                    borderImage: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffa726) 1'
                  }}
                />
              </div>
            )}
            
            <div className="flex justify-center mb-4">
              <PartyPopper className="w-12 h-12 text-pink-500 animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
              {evento.name}
            </h1>
            
            {evento.description && (
              <p className="text-xl text-purple-700 font-medium">
                {evento.description}
              </p>
            )}
            
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-xl">
              <p className="text-2xl font-bold text-purple-800">
                ¡Hola, {invitado.name}! 🎉
              </p>
              <p className="text-lg text-purple-700 mt-2">
                ¡Estás invitado/a a esta gran celebración!
              </p>
            </div>
          </div>
        </div>

        {/* Detalles del evento */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Fecha y hora */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-blue-800">¿Cuándo? 📅</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3">
                <p className="font-bold text-blue-700">Fecha:</p>
                <p className="text-blue-600 capitalize text-lg">{formatDate(evento.start_date)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-lg p-3 flex-1">
                  <p className="font-bold text-blue-700">Inicio:</p>
                  <p className="text-blue-600 text-lg">{formatTime(evento.start_date)}</p>
                </div>
                {evento.end_date && (
                  <div className="bg-white rounded-lg p-3 flex-1">
                    <p className="font-bold text-blue-700">Fin:</p>
                    <p className="text-blue-600 text-lg">{formatTime(evento.end_date)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6 border-2 border-green-300 shadow-lg">
            <div className="flex items-center mb-4">
              <MapPin className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-green-800">¿Dónde? 📍</h3>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <p className="text-green-600 text-lg font-medium">
                {evento.location || "¡La ubicación será una sorpresa!"}
              </p>
            </div>
          </div>
        </div>

        {/* Código de vestimenta */}
        {evento.dress_code && (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-300 shadow-lg mb-12">
            <div className="flex items-center mb-4">
              <Palette className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-2xl font-bold text-purple-800">¿Qué vestir? 👗</h3>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-purple-700 text-lg font-bold">{getDressCodeText(evento.dress_code)}</p>
            </div>
          </div>
        )}

        {/* Sección RSVP */}
        {showRSVP && evento.id && invitado.id && (
          <div className="mb-12">
            <RSVPSection 
              eventId={evento.id} 
              guestId={invitado.id}
              eventName={evento.name}
              guestName={invitado.name}
            />
          </div>
        )}

        {/* Código QR festivo */}
        {invitado.qr_code_data && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-dashed border-rainbow inline-block relative">
              <div className="absolute -top-1 -left-1 text-2xl">✨</div>
              <div className="absolute -top-1 -right-1 text-2xl">🎊</div>
              <div className="absolute -bottom-1 -left-1 text-2xl">🎈</div>
              <div className="absolute -bottom-1 -right-1 text-2xl">🌟</div>
              
              <h3 className="text-2xl font-bold text-purple-800 mb-4">Tu Pase Mágico ✨</h3>
              <div className="flex justify-center mb-4">
                <QRCode 
                  value={invitado.qr_code_data} 
                  size={150}
                  className="border-4 border-purple-300 shadow-lg rounded-lg"
                />
              </div>
              <p className="text-sm text-purple-700 font-bold">
                Código: <span className="font-mono bg-yellow-200 px-2 py-1 rounded">{invitado.invitation_code}</span>
              </p>
              <p className="text-xs text-purple-600 mt-2">
                ¡Trae tu código mágico para acceder a la diversión!
              </p>
            </div>
          </div>
        )}

        {/* Footer festivo */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
            <p className="text-2xl font-bold text-purple-800 mb-2">
              ¡No te lo puedes perder! 🎉
            </p>
            <p className="text-lg text-purple-700">
              ¡Será una celebración inolvidable! 🎊✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
