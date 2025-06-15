
import { Calendar, QrCode, Users } from "lucide-react";

export default function FeaturesSection() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¿Por qué usar EventManager?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Una solución completa para la gestión de eventos, desde la creación hasta el control de asistencias
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Gestión Fácil</h3>
            <p className="text-gray-600">
              Crea y administra eventos de manera intuitiva y eficiente
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Códigos QR</h3>
            <p className="text-gray-600">
              Genera códigos QR únicos para cada invitado y evento
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Control Total</h3>
            <p className="text-gray-600">
              Monitorea asistencias en tiempo real con reportes detallados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
