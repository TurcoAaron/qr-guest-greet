
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CheckCircle, XCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EscanearQR = () => {
  const [codigoManual, setCodigoManual] = useState("");
  const [asistencias, setAsistencias] = useState<string[]>([]);
  const [ultimoEscaneado, setUltimoEscaneado] = useState("");
  const { toast } = useToast();

  // Simular almacenamiento local de asistencias
  useEffect(() => {
    const asistenciasGuardadas = localStorage.getItem("asistencias");
    if (asistenciasGuardadas) {
      setAsistencias(JSON.parse(asistenciasGuardadas));
    }
  }, []);

  const registrarAsistencia = (codigo: string) => {
    if (!codigo.trim()) {
      toast({
        title: "Error",
        description: "Código inválido",
        variant: "destructive",
      });
      return;
    }

    // Verificar si ya está registrado
    if (asistencias.includes(codigo)) {
      toast({
        title: "Ya Registrado",
        description: "Este invitado ya registró su asistencia",
        variant: "destructive",
      });
      return;
    }

    // Registrar asistencia
    const nuevasAsistencias = [...asistencias, codigo];
    setAsistencias(nuevasAsistencias);
    localStorage.setItem("asistencias", JSON.stringify(nuevasAsistencias));
    
    // Extraer nombre del código
    const nombre = codigo.split('-')[0];
    setUltimoEscaneado(nombre);
    
    toast({
      title: "¡Asistencia Registrada!",
      description: `Bienvenido/a ${nombre}`,
    });

    setCodigoManual("");
  };

  const iniciarEscaneo = () => {
    // En una implementación real, aquí se abriría la cámara
    // Por ahora, simulamos con un prompt
    const codigoSimulado = prompt("Simular código escaneado (formato: Nombre-timestamp):");
    if (codigoSimulado) {
      registrarAsistencia(codigoSimulado);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Estadísticas */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <User className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{asistencias.length}</div>
                <div className="text-sm text-gray-600">Asistencias Registradas</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {ultimoEscaneado || "---"}
                </div>
                <div className="text-sm text-gray-600">Último Registrado</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-bold text-gray-800">0</div>
                <div className="text-sm text-gray-600">Códigos Inválidos</div>
              </CardContent>
            </Card>
          </div>

          {/* Escáner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Registrar Asistencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Escáner de cámara */}
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Escanear con Cámara</h3>
                  <div className="bg-gray-100 rounded-lg p-12 min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Área de escaneo de QR</p>
                      <Button
                        onClick={iniciarEscaneo}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Iniciar Escaneo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Entrada manual */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Entrada Manual</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="codigo" className="text-base">
                        Código del Invitado
                      </Label>
                      <Input
                        id="codigo"
                        type="text"
                        placeholder="Pegar o escribir código aquí"
                        value={codigoManual}
                        onChange={(e) => setCodigoManual(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button
                      onClick={() => registrarAsistencia(codigoManual)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!codigoManual.trim()}
                    >
                      Registrar Asistencia
                    </Button>

                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <strong>Instrucciones:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Escanea el código QR con la cámara</li>
                        <li>• O copia y pega el código manualmente</li>
                        <li>• El sistema verificará automáticamente si es válido</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de asistencias recientes */}
          {asistencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Asistencias Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {asistencias.slice(-10).reverse().map((codigo, index) => {
                    const nombre = codigo.split('-')[0];
                    const timestamp = parseInt(codigo.split('-')[1]);
                    const fecha = new Date(timestamp).toLocaleString();
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">{nombre}</span>
                        </div>
                        <span className="text-sm text-gray-600">{fecha}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscanearQR;
