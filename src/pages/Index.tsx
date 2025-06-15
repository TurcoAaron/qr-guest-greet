
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, QrCode, Scan, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Gestión de Eventos",
      description: "Crea y administra eventos con facilidad, desde bodas hasta conferencias corporativas."
    },
    {
      icon: Users,
      title: "Lista de Invitados",
      description: "Gestiona tu lista de invitados, envía invitaciones y controla las confirmaciones."
    },
    {
      icon: QrCode,
      title: "Códigos QR",
      description: "Genera códigos QR únicos para cada invitado para un acceso rápido y seguro."
    },
    {
      icon: Scan,
      title: "Control de Asistencia",
      description: "Escanea códigos QR para registrar la asistencia en tiempo real."
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description: "Tus datos están protegidos con la mejor tecnología de seguridad."
    },
    {
      icon: Zap,
      title: "Rápido y Eficiente",
      description: "Interfaz intuitiva que te permite gestionar eventos en segundos."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gestiona tus Eventos con
              <span className="text-blue-600"> EventManager</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              La plataforma completa para organizar eventos, gestionar invitados y controlar asistencia 
              con códigos QR. Simple, rápido y profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Calendar className="w-5 h-5 mr-2" />
                    Ir al Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Calendar className="w-5 h-5 mr-2" />
                      Comenzar Gratis
                    </Button>
                  </Link>
                  <Link to="/invitacion">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <QrCode className="w-5 h-5 mr-2" />
                      Ver Invitación Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para gestionar eventos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              EventManager te proporciona todas las herramientas necesarias para organizar 
              eventos exitosos de cualquier tamaño.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-blue-600 mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              ¿Listo para organizar tu próximo evento?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a miles de organizadores que confían en EventManager para sus eventos.
            </p>
            {!user && (
              <Link to="/auth">
                <Button size="lg" variant="secondary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Crear Cuenta Gratis
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">EventManager</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma completa para gestionar eventos, invitados y asistencia con códigos QR.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white">Características</Link></li>
                <li><Link to="/auth" className="hover:text-white">Precios</Link></li>
                <li><Link to="/invitacion" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white">Ayuda</Link></li>
                <li><Link to="/auth" className="hover:text-white">Contacto</Link></li>
                <li><Link to="/auth" className="hover:text-white">Documentación</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EventManager. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
