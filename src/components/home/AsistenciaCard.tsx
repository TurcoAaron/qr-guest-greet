
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import { useBuscarEvento } from "@/hooks/useBuscarEvento";

export default function AsistenciaCard() {
  const [codigoEvento, setCodigoEvento] = useState("");
  const { buscarEvento, loading } = useBuscarEvento();

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="text-center pb-6">
        <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <CardTitle className="text-2xl">Tomar Asistencia</CardTitle>
        <p className="text-gray-600">
          Registra la asistencia para un evento específico
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Código del Evento
          </label>
          <Input
            type="text"
            placeholder="Ej: CONF2024"
            value={codigoEvento}
            onChange={(e) => setCodigoEvento(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={() => buscarEvento(codigoEvento)}
          className="w-full"
          size="lg"
          disabled={loading}
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar Evento
        </Button>
      </CardContent>
    </Card>
  );
}
