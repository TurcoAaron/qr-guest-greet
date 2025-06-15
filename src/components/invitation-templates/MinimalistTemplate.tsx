
import { Calendar, MapPin, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface MinimalistTemplateProps {
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

export const MinimalistTemplate = ({ invitado, evento }: MinimalistTemplateProps) => {
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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-lg">
          <div className="p-16">
            {/* Header minimalista */}
            <div className="text-center mb-16">
              <div className="inline-block">
                <h1 className="text-5xl font-light text-gray-900 tracking-widest mb-4">
                  INVITATION
                </h1>
                <div className="w-32 h-px bg-gray-900 mx-auto"></div>
              </div>
            </div>

            {/* Saludo minimalista */}
            <div className="text-center mb-16">
              <p className="text-2xl font-light text-gray-700 mb-8">
                {invitado.name}
              </p>
              <p className="text-lg text-gray-600 font-light">
                You are cordially invited to
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Información del evento */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl font-light text-gray-900 mb-8 leading-tight">
                    {evento.name}
                  </h3>
                  {evento.description && (
                    <p className="text-gray-600 text-lg leading-relaxed font-light">
                      {evento.description}
                    </p>
                  )}
                </div>

                {/* Detalles minimalistas */}
                <div className="space-y-8">
                  <div className="border-l border-gray-300 pl-6">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                        <div>
                          <p className="text-gray-900 font-light">
                            {new Date(evento.start_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <Clock className="w-5 h-5 text-gray-600 mt-1" />
                        <div>
                          <p className="text-gray-900 font-light">
                            {new Date(evento.start_date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {evento.end_date && ` - ${new Date(evento.end_date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}`}
                          </p>
                        </div>
                      </div>
                      
                      {evento.location && (
                        <div className="flex items-start space-x-4">
                          <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                          <div>
                            <p className="text-gray-900 font-light">{evento.location}</p>
                          </div>
                        </div>
                      )}

                      {evento.event_type && (
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-gray-600 text-sm font-light">
                            {formatearTipoEvento(evento.event_type)}
                          </p>
                        </div>
                      )}

                      {evento.dress_code && (
                        <div>
                          <p className="text-gray-600 text-sm font-light">
                            Dress Code: {formatearCodigoVestimenta(evento.dress_code)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR minimalista */}
              <div className="space-y-12">
                <div className="text-center">
                  <div className="mb-8">
                    <p className="text-gray-600 text-sm font-light tracking-wide mb-4">
                      ACCESS CODE
                    </p>
                    <div className="w-16 h-px bg-gray-300 mx-auto"></div>
                  </div>
                  
                  <div className="flex justify-center mb-8">
                    <div className="border border-gray-200 p-8">
                      {invitado.qr_code_data && (
                        <QRCodeSVG
                          value={invitado.qr_code_data}
                          size={140}
                          level="M"
                          includeMargin={true}
                        />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-xs font-mono tracking-wider">
                    {invitado.invitation_code}
                  </p>
                </div>

                <div className="text-center pt-8 border-t border-gray-200">
                  <p className="text-gray-600 text-sm font-light leading-relaxed">
                    Present this invitation<br />
                    at the event entrance
                  </p>
                </div>
              </div>
            </div>

            {/* Footer minimalista */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-400 text-xs font-light tracking-widest">
                PERSONAL & NON-TRANSFERABLE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
