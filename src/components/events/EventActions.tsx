
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface EventActionsProps {
  loading: boolean;
  nombreEvento: string;
  fechaInicio: string;
  onCancel: () => void;
  onSave: () => void;
}

export const EventActions = ({
  loading,
  nombreEvento,
  fechaInicio,
  onCancel,
  onSave
}: EventActionsProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={loading || !nombreEvento.trim() || !fechaInicio}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
