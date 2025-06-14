
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GenerarQR = () => {
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [qrGenerado, setQrGenerado] = useState("");
  const [urlInvitacion, setUrlInvitacion] = useState("");
  const { toast } = useToast();

  const generarQR = () => {
    if (!nombreInvitado.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre del invitado",
        variant: "destructive",
      });
      return;
    }

    const invitadoId = `${nombreInvitado}-${Date.now()}`;
    setQrGenerado(invitadoId);
    
    const url = `${window.location.origin}/invitacion?nombre=${encodeURIComponent(nombreInvitado)}`;
    setUrlInvitacion(url);

    toast({
      title: "¡QR Generado!",
      description: `Código QR creado para ${nombreInvitado}`,
    });
  };

  const copiarURL = () => {
    navigator.clipboard.writeText(urlInvitacion);
    toast({
      title: "URL Copiada",
      description: "La URL de la invitación ha sido copiada al portapapeles",
    });
  };

  const descargarQR = () => {
    const svg = document.querySelector('#qr-code svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `qr-${nombreInvitado}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Generar Código QR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Formulario */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="nombre" className="text-base font-medium">
                      Nombre del Invitado
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Ingresa el nombre completo"
                      value={nombreInvitado}
                      onChange={(e) => setNombreInvitado(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    onClick={generarQR}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Generar QR
                  </Button>

                  {urlInvitacion && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">URL de Invitación</Label>
                        <div className="flex mt-2">
                          <Input
                            value={urlInvitacion}
                            readOnly
                            className="flex-1"
                          />
                          <Button
                            onClick={copiarURL}
                            variant="outline"
                            size="icon"
                            className="ml-2"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={descargarQR}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar QR
                        </Button>
                        <Button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: `Invitación para ${nombreInvitado}`,
                                url: urlInvitacion,
                              });
                            }
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartir
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vista previa del QR */}
                <div className="text-center">
                  {qrGenerado ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Código QR Generado</h3>
                      <div id="qr-code" className="flex justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                          <QRCodeSVG
                            value={qrGenerado}
                            size={200}
                            level="M"
                            includeMargin={true}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        QR para: <strong>{nombreInvitado}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-12 text-gray-400">
                      <div className="w-48 h-48 mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                        <p>El QR aparecerá aquí</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerarQR;
