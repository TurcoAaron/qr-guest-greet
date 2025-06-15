
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LoadingStateProps {
  onBack: () => void;
}

export const LoadingEvent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-2 text-gray-600">Cargando evento...</p>
    </div>
  </div>
);

export const EventNotFound = ({ onBack }: LoadingStateProps) => (
  <div className="min-h-screen flex items-center justify-center">
    <Card>
      <CardContent className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Evento no encontrado</h2>
        <p className="text-gray-600 mb-4">No se pudo encontrar el evento solicitado.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>
      </CardContent>
    </Card>
  </div>
);
