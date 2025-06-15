
import { Calendar, MapPin, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ElegantTemplateProps {
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

export const ElegantTemplate = ({ invitado, evento }: ElegantTemplateProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-stone-200 relative">
      {/* Elementos decorativos elegantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-1 h-40 bg-gradient-to-b from-amber-400 to-transparent rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-1 h-40 bg-gradient-to-t from-amber-400 to-transparent -rotate-12"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white shadow-2xl border border-gray-200 relative">
            {/* Borde dorado elegante */}
            <div className="absolute inset-4 border-2 border-amber-400 pointer-events-none"></div>
            
            <div className="p-16 relative">
              {/* Header elegante */}
              <div className="text-center mb-16">
                <div className="inline-block">
                  <div className="border-b-2 border-amber-400 pb-4 mb-6">
                    <h1 className="text-6xl font-serif text-gray-800 tracking-wider">INVITACIÓN</h1>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-px bg-amber-400"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <div className="w-12 h-px bg-amber-400"></div>
                  </div>
                </div>
              </div>

              {/* Saludo personalizado */}
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-gray-700 mb-4 italic">
                  Estimado/a
                </h2>
                <p className="text-3xl font-serif text-gray-800 font-semibold">
                  {invitado.name}
                </p>
                <div className="mt-6 flex items-center justify-center space-x-4">
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-px bg-gray-300"></div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Información del evento */}
                <div className="space-y-8">
                  <div className="text-center lg:text-left">
                    <h3 className="text-4xl font-serif text-gray-800 mb-6 leading-tight">
                      {evento.name}
                    </h3>
                    {evento.description && (
                      <p className="text-gray-600 text-lg leading-relaxed font-light italic">
                        {evento.description}
                      </p>
                    )}
                  </div>

                  {/* Detalles elegantes */}
                  <div className="space-y-6 bg-gray-50 p-8 border-l-4 border-amber-400">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        <Calendar className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-gray-800 text-lg">Fecha</p>
                        <p className="text-gray-600 font-light">
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
                      <div className="mt-1">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-gray-800 text-lg">Hora</p>
                        <p className="text-gray-600 font-light">
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
                        <div className="mt-1">
                          <MapPin className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-gray-800 text-lg">Lugar</p>
                          <p className="text-gray-600 font-light">{evento.location}</p>
                        </div>
                      </div>
                    )}

                    {evento.event_type && (
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          <span className="text-amber-600 text-lg">📋</span>
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-gray-800 text-lg">Tipo de Evento</p>
                          <p className="text-gray-600 font-light">{formatearTipoEvento(evento.event_type)}</p>
                        </div>
                      </div>
                    )}

                    {evento.dress_code && (
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          <span className="text-amber-600 text-lg">👔</span>
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-gray-800 text-lg">Código de Vestimenta</p>
                          <p className="text-gray-600 font-light">{formatearCodigoVestimenta(evento.dress_code)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR y mensaje */}
                <div className="space-y-8">
                  <div className="text-center border-2 border-dashed border-gray-300 p-8">
                    <h4 className="text-xl font-serif text-gray-800 mb-6">
                      Código de Acceso
                    </h4>
                    <div className="flex justify-center mb-6">
                      <div className="bg-white p-4 border border-gray-200 shadow-sm">
                        {invitado.qr_code_data && (
                          <QRCodeSVG
                            value={invitado.qr_code_data}
                            size={160}
                            level="M"
                            includeMargin={true}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 font-light italic">
                      Presente este código al llegar al evento
                    </p>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 px-3 py-2 inline-block border">
                      {invitado.invitation_code}
                    </p>
                  </div>

                  <div className="text-center bg-amber-50 p-8 border border-amber-200">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-amber-800 font-serif text-lg italic mb-3">
                      "La elegancia es el único tipo de belleza que nunca se desvanece"
                    </p>
                    <p className="text-amber-700 font-light">
                      Con sincero aprecio
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer elegante */}
              <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-light italic">
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
