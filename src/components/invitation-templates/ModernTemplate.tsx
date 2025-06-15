
import { Calendar, MapPin, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ModernTemplateProps {
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

export const ModernTemplate = ({ invitado, evento }: ModernTemplateProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-orange-200 rounded-full opacity-25 animate-pulse delay-500"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Tarjeta principal de invitación */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header decorativo */}
            <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 relative">
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <h1 className="text-white text-4xl font-bold tracking-wide">INVITACIÓN</h1>
              </div>
              {/* Elementos decorativos */}
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full opacity-50"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white rounded-full opacity-40"></div>
            </div>

            <div className="p-12">
              {/* Saludo personalizado */}
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                  ¡Estás Invitado!
                </h2>
                <p className="text-2xl text-purple-600 font-semibold">
                  Querido/a {invitado.name}
                </p>
              </div>

              {/* Información del evento */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Lado izquierdo - Detalles del evento */}
                <div className="space-y-8">
                  <div className="text-center lg:text-left">
                    <h3 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                      {evento.name}
                    </h3>
                    {evento.description && (
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {evento.description}
                      </p>
                    )}
                  </div>

                  {/* Detalles con iconos */}
                  <div className="space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-600 p-3 rounded-full">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">Fecha</p>
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
                      <div className="bg-pink-600 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">Hora</p>
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
                        <div className="bg-orange-600 p-3 rounded-full">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">Lugar</p>
                          <p className="text-gray-600">{evento.location}</p>
                        </div>
                      </div>
                    )}

                    {evento.event_type && (
                      <div className="flex items-start space-x-4">
                        <div className="bg-indigo-600 p-3 rounded-full">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">Tipo de Evento</p>
                          <p className="text-gray-600">{formatearTipoEvento(evento.event_type)}</p>
                        </div>
                      </div>
                    )}

                    {evento.dress_code && (
                      <div className="flex items-start space-x-4">
                        <div className="bg-teal-600 p-3 rounded-full">
                          <span className="text-white text-xl">👔</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">Código de Vestimenta</p>
                          <p className="text-gray-600">{formatearCodigoVestimenta(evento.dress_code)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lado derecho - Código QR y mensaje */}
                <div className="space-y-8">
                  {/* Código QR */}
                  <div className="text-center bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-dashed border-purple-300">
                    <h4 className="text-2xl font-semibold text-gray-800 mb-6">
                      Tu Código de Acceso
                    </h4>
                    <div className="flex justify-center mb-6">
                      <div className="bg-white p-6 rounded-2xl shadow-lg">
                        {invitado.qr_code_data && (
                          <QRCodeSVG
                            value={invitado.qr_code_data}
                            size={200}
                            level="M"
                            includeMargin={true}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 text-lg">
                      Presenta este código QR al llegar al evento
                    </p>
                    <p className="text-sm text-gray-500 font-mono bg-gray-100 px-4 py-2 rounded-lg inline-block">
                      Código: {invitado.invitation_code}
                    </p>
                  </div>

                  {/* Mensaje especial */}
                  <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-purple-800 font-semibold text-xl mb-3">
                      "La alegría compartida es doble alegría"
                    </p>
                    <p className="text-purple-600 text-lg">
                      ¡Esperamos verte pronto!
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer con información adicional */}
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-sm">
                  Esta invitación es personal e intransferible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
