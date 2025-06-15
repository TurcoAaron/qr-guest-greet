
import { Calendar, MapPin, Clock, Building } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CorporateTemplateProps {
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

export const CorporateTemplate = ({ invitado, evento }: CorporateTemplateProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 relative">
      {/* Elementos geométricos corporativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-20 h-20 border-2 border-blue-200 rotate-45 opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-slate-300 rotate-12 opacity-30"></div>
        <div className="absolute top-1/2 left-10 w-1 h-32 bg-blue-300 opacity-20"></div>
        <div className="absolute top-1/3 right-10 w-1 h-40 bg-slate-400 opacity-20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white shadow-2xl border-t-8 border-blue-600">
            <div className="p-12">
              {/* Header corporativo */}
              <div className="text-center mb-12 border-b-2 border-gray-200 pb-8">
                <div className="flex items-center justify-center mb-4">
                  <Building className="w-12 h-12 text-blue-600 mr-4" />
                  <h1 className="text-4xl font-bold text-gray-800 tracking-wide">INVITACIÓN CORPORATIVA</h1>
                </div>
                <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
              </div>

              {/* Saludo profesional */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                  Estimado/a
                </h2>
                <p className="text-4xl font-bold text-blue-700">
                  {invitado.name}
                </p>
                <p className="text-gray-600 text-lg mt-4">
                  Tenemos el honor de invitarle al siguiente evento
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Información del evento */}
                <div className="space-y-8">
                  <div className="bg-blue-50 p-8 border-l-4 border-blue-600">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">
                      {evento.name}
                    </h3>
                    {evento.description && (
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {evento.description}
                      </p>
                    )}
                  </div>

                  {/* Detalles corporativos */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2">
                      Detalles del Evento
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-800">Fecha</p>
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
                      
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-800">Horario</p>
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
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">Ubicación</p>
                            <p className="text-gray-600">{evento.location}</p>
                          </div>
                        </div>
                      )}

                      {evento.event_type && (
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <Building className="w-6 h-6 text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">Tipo de Evento</p>
                            <p className="text-gray-600">{formatearTipoEvento(evento.event_type)}</p>
                          </div>
                        </div>
                      )}

                      {evento.dress_code && (
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <span className="text-blue-600 text-2xl mt-1">👔</span>
                          <div>
                            <p className="font-semibold text-gray-800">Código de Vestimenta</p>
                            <p className="text-gray-600">{formatearCodigoVestimenta(evento.dress_code)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR y información de acceso */}
                <div className="space-y-8">
                  <div className="text-center border-2 border-blue-200 p-8 bg-blue-50">
                    <h4 className="text-xl font-semibold text-gray-800 mb-6">
                      Código de Acceso
                    </h4>
                    <div className="flex justify-center mb-6">
                      <div className="bg-white p-6 border border-gray-300 shadow-md">
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
                    <p className="text-gray-600 mb-3">
                      Presente este código QR en la recepción del evento
                    </p>
                    <div className="bg-white border border-gray-300 px-4 py-2 inline-block">
                      <p className="text-sm text-gray-500 font-mono">
                        ID: {invitado.invitation_code}
                      </p>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-slate-50 p-8 border border-slate-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Información Importante
                    </h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>• La puntualidad es apreciada</p>
                      <p>• Esta invitación es personal e intransferible</p>
                      <p>• Se requiere identificación oficial</p>
                      <p>• Por favor confirme su asistencia</p>
                    </div>
                  </div>

                  <div className="text-center bg-blue-600 text-white p-6">
                    <p className="text-lg font-semibold mb-2">
                      Esperamos contar con su distinguida presencia
                    </p>
                    <p className="text-blue-100">
                      Atentamente, Comité Organizador
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer corporativo */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200 text-center">
                <p className="text-gray-500 text-sm">
                  Esta invitación ha sido generada de forma digital y es válida para el acceso al evento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
