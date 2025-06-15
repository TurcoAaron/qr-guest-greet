
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";
import { useBuscarInvitacion } from "@/hooks/useBuscarInvitacion";

export default function InvitacionCard() {
  const [codigoInvitacion, setCodigoInvitacion] = useState("");
  const { buscarInvitacion, loading } = useBuscarInvitacion();

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="text-center pb-6">
        <Calendar className="w-16 h-16 mx-auto text-green-600 mb-4" />
        <CardTitle className="text-2xl">Consultar Invitación</CardTitle>
        <p className="text-gray-600">
          Consulta los detalles de tu invitación
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Código de Invitación
          </label>
          <Input
            type="text"
            placeholder="Ingresa tu código de invitación"
            value={codigoInvitacion}
            onChange={(e) => setCodigoInvitacion(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={() => buscarInvitacion(codigoInvitacion)}
          className="w-full"
          size="lg"
          variant="outline"
          disabled={loading}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Consultar Invitación
        </Button>
      </CardContent>
    </Card>
  );
}
