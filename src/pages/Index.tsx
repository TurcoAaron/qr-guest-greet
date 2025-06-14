
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Users, UserCheck, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Asistencia QR
          </h1>
          <p className="text-xl text-gray-600">
            Gestiona invitaciones y controla asistencia con códigos QR
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/invitacion">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Ver Invitación</CardTitle>
                <CardDescription>
                  Accede a tu invitación personalizada
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/generar-qr">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Generar QR</CardTitle>
                <CardDescription>
                  Crea códigos QR para invitados
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/escanear">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Escanear QR</CardTitle>
                <CardDescription>
                  Registra asistencia escaneando QR
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/administrar">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Administrar</CardTitle>
                <CardDescription>
                  Panel de control de asistencia
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p>Los invitados reciben una invitación personalizada con código QR</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p>Al llegar al evento, se escanea el código QR</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p>Se registra automáticamente la asistencia del invitado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
