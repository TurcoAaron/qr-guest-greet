
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QrScannerCard() {
  const navigate = useNavigate();

  const iniciarEscaneoQR = () => {
    // La navegación es protegida en rutas seguras si no hay sesión
    navigate("/escanear");
  };

  return (
    <Card className="border-0 shadow-lg max-w-md mx-auto">
      <CardHeader className="text-center">
        <QrCode className="w-12 h-12 mx-auto text-purple-600 mb-3" />
        <CardTitle>Escanear Código QR</CardTitle>
        <p className="text-gray-600 text-sm">
          Usa la cámara para escanear códigos QR
        </p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={iniciarEscaneoQR}
          className="w-full"
          size="lg"
          variant="secondary"
        >
          <Camera className="w-4 h-4 mr-2" />
          Abrir Escáner QR
        </Button>
      </CardContent>
    </Card>
  );
}
