
import { Calendar, MapPin, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface FestiveTemplateProps {
  invitado: {
    name: string;
    invitation_code?: string;
    qr_code_data?: string;
  };
  evento: {
    name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    event_type?: string;
    dress_code?: string;
  };
}

export const FestiveTemplate = ({ invitado, evento }: FestiveTemplateProps) => {
  const formatearTipoEvento = (tipo: string) => {
    const tipos = {
      conference: "Conferencia",
      wedding: "Boda", 
      birthday: "Cumpleaños",
      corporate: "Corporativo",
      social: "Social",
      workshop: "Taller",
      seminar: "Seminario",
      other: "Otro"
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const formatearCodigoVestimenta = (codigo: string) => {
    const codigos = {
      formal: "Formal",
      "semi-formal": "Semi-formal",
      casual: "Casual",
      business: "Ejecutivo",
      cocktail: "Cocktail",
      "black-tie": "Etiqueta",
      "white-tie": "Etiqueta Rigurosa",
      theme: "Temático"
    };
    return codigos[codigo as keyof typeof codigos] || codigo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-red-200 relative overflow-hidden">
      {/* Elementos festivos animados */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Confetti animado */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-red-400 rounded-full animate-bounce"></div>
        <div className="absolute top-20 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-16 right-20 w-5 h-5 bg-green-400 rounded-full animate-bounce delay-200"></div>
        <div className="absolute top-32 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-400"></div>
        <div className="absolute bottom-32 right-24 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-500"></div>
        
        {/* Streamers */}
        <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-red-400 via-yellow-400 to-blue-400 opacity-20 transform rotate-12"></div>
        <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-green-400 via-pink-400 to-purple-400 opacity-20 transform -rotate-12"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-rainbow bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 p-2">
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Header festivo */}
              <div className="relative bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 p-8 text-center">
                <div className="absolute inset-0 bg-white bg-opacity-10"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">🎉🎊🎈</div>
                  <h1 className="text-white text-5xl font-bold tracking-wide drop-shadow-lg">
                    ¡FIESTA!
                  </h1>
                  <div className="text-4xl mt-4">🎁🎂🎵</div>
                </div>
              </div>

              <div className="p-12">
                {/* Saludo festivo */}
                <div className="text-center mb-12">
                  <div className="text-6xl mb-4">🎪</div>
                  <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 mb-4">
                    ¡Estás Invitado/a!
                  </h2>
                  <p className="text-3xl text-pink-600 font-bold">
                    {invitado.name}
                  </p>
                  <div className="text-4xl mt-4">🌟✨🌈</div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Información del evento */}
                  <div className="space-y-8">
                    <div className="text-center lg:text-left">
                      <div className="text-4xl mb-4">🎭</div>
                      <h3 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                        {evento.name}
                      </h3>
                      {evento.description && (
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {evento.description}
                        </p>
                      )}
                      <div className="text-3xl mt-4">🎪🎨🎬</div>
                    </div>

                    {/* Detalles festivos */}
                    <div className="space-y-6 bg-gradient-to-br from-yellow-50 to-pink-50 p-8 rounded-2xl border-4 border-dashed border-rainbow">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">📅</div>
                        <div>
                          <p className="font-bold text-gray-800 text-lg">Fecha</p>
                          <p className="text-gray-600">
                            {new Date(evento.start_date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">⏰</div>
                        <div>
                          <p className="font-bold text-gray-800 text-lg">Hora</p>
                          <p className="text-gray-600">
                            {new Date(evento.start_date).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} hrs
                            {evento.end_date && ` - ${new Date(evento.end_date).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} hrs`}
                          </p>
                        </div>
                      </div>
                      
                      {evento.location && (
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">📍</div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">Lugar</p>
                            <p className="text-gray-600">{evento.location}</p>
                          </div>
                        </div>
                      )}

                      {evento.event_type && (
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">🎯</div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">Tipo de Evento</p>
                            <p className="text-gray-600">{formatearTipoEvento(evento.event_type)}</p>
                          </div>
                        </div>
                      )}

                      {evento.dress_code && (
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">👗</div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">Código de Vestimenta</p>
                            <p className="text-gray-600">{formatearCodigoVestimenta(evento.dress_code)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QR y mensaje festivo */}
                  <div className="space-y-8">
                    <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-4 border-dashed border-rainbow">
                      <div className="text-4xl mb-4">🎫</div>
                      <h4 className="text-2xl font-bold text-gray-800 mb-6">
                        ¡Tu Pase Mágico!
                      </h4>
                      <div className="flex justify-center mb-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-rainbow">
                          {invitado.qr_code_data && (
                            <QRCodeSVG
                              value={invitado.qr_code_data}
                              size={180}
                              level="M"
                              includeMargin={true}
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 text-lg font-bold">
                        ¡Muestra este código y entra a la diversión!
                      </p>
                      <p className="text-sm text-gray-500 font-mono bg-rainbow bg-gradient-to-r from-red-100 to-purple-100 px-4 py-2 rounded-lg inline-block border-2 border-rainbow">
                        {invitado.invitation_code}
                      </p>
                    </div>

                    <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border-4 border-dashed border-orange-300">
                      <div className="text-6xl mb-4">🎈🎊🎉</div>
                      <p className="text-orange-800 font-bold text-xl mb-3">
                        "¡La vida es una fiesta y tú eres el invitado especial!"
                      </p>
                      <p className="text-orange-600 text-lg font-bold">
                        ¡Prepárate para celebrar!
                      </p>
                      <div className="text-4xl mt-4">🥳🎪🌟</div>
                    </div>
                  </div>
                </div>

                {/* Footer festivo */}
                <div className="mt-12 pt-8 border-t-4 border-dashed border-rainbow text-center">
                  <div className="text-4xl mb-2">🎁🎂🎵</div>
                  <p className="text-gray-500 text-sm font-bold">
                    Esta invitación es tu boleto a la diversión
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
