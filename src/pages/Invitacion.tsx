
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const Invitacion = () => {
  const [searchParams] = useSearchParams();
  const [invitadoNombre, setInvitadoNombre] = useState("");
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const nombre = searchParams.get("nombre") || "Invitado";
    setInvitadoNombre(nombre);
    
    // Generar datos para el QR que incluyan el nombre y un ID único
    const invitadoId = `${nombre}-${Date.now()}`;
    setQrData(invitadoId);
  }, [searchParams]);

  const descargarInvitacion = () => {
    // Aquí se podría implementar la descarga de la invitación como PDF
    console.log("Descargando invitación para:", invitadoNombre);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 overflow-hidden">
            {/* Header decorativo */}
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <h1 className="text-white text-2xl font-bold">INVITACIÓN</h1>
              </div>
            </div>

            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                ¡Estás Invitado!
              </CardTitle>
              <p className="text-xl text-purple-600 font-semibold">
                Querido/a {invitadoNombre}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Celebración Especial
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Nos complace invitarte a nuestra celebración especial. 
                  Tu presencia hará que este evento sea aún más memorable.
                </p>
              </div>

              {/* Detalles del evento */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Fecha</p>
                    <p className="text-gray-600">Sábado, 15 de Diciembre 2024</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Hora</p>
                    <p className="text-gray-600">19:00 hrs</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Lugar</p>
                    <p className="text-gray-600">Salón de Eventos Villa Hermosa</p>
                    <p className="text-sm text-gray-500">Av. Principal #123, Ciudad</p>
                  </div>
                </div>
              </div>

              {/* Código QR */}
              <div className="text-center bg-white p-6 rounded-lg border-2 border-dashed border-purple-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tu Código de Acceso
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <QRCodeSVG
                      value={qrData}
                      size={150}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Presenta este código QR al llegar al evento para registrar tu asistencia
                </p>
              </div>

              {/* Mensaje especial */}
              <div className="text-center bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-800 font-medium">
                  "La alegría compartida es doble alegría"
                </p>
                <p className="text-sm text-purple-600 mt-2">
                  ¡Esperamos verte pronto!
                </p>
              </div>

              {/* Botón de descarga */}
              <div className="text-center">
                <Button 
                  onClick={descargarInvitacion}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Invitación
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Invitacion;
