
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, UserCheck, Baby, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceValidationProps {
  guest: {
    id: string;
    name: string;
    email?: string;
    adults_count: number;
    children_count: number;
    pets_count: number;
    passes_count: number;
  };
  event: {
    id: string;
    name: string;
    validate_full_attendance?: boolean;
  };
  onAttendanceRecorded: () => void;
}

export const AttendanceValidation = ({ 
  guest, 
  event, 
  onAttendanceRecorded 
}: AttendanceValidationProps) => {
  const [actualAdults, setActualAdults] = useState(guest.adults_count);
  const [actualChildren, setActualChildren] = useState(guest.children_count);
  const [actualPets, setActualPets] = useState(guest.pets_count);
  const [validateCounts, setValidateCounts] = useState(event.validate_full_attendance || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Verificar si ya está registrada la asistencia
      const { data: existingAttendance } = await supabase
        .from('attendances')
        .select('id')
        .eq('guest_id', guest.id)
        .eq('event_id', event.id)
        .single();

      if (existingAttendance) {
        toast({
          title: "Ya registrado",
          description: "La asistencia de este invitado ya fue registrada",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validar si se requiere validación completa
      if (validateCounts) {
        const totalActual = actualAdults + actualChildren + actualPets;
        if (totalActual !== guest.passes_count) {
          toast({
            title: "Validación requerida",
            description: `El total de asistentes (${totalActual}) no coincide con los pases registrados (${guest.passes_count})`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Registrar asistencia
      const { error } = await supabase
        .from('attendances')
        .insert([
          {
            guest_id: guest.id,
            event_id: event.id,
            actual_adults_count: validateCounts ? actualAdults : null,
            actual_children_count: validateCounts ? actualChildren : null,
            actual_pets_count: validateCounts ? actualPets : null,
            checked_in_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Asistencia registrada",
        description: `Se registró la asistencia de ${guest.name}`,
      });

      onAttendanceRecorded();
    } catch (error) {
      console.error('Error registrando asistencia:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la asistencia",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5" />
          <span>Registrar Asistencia</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{guest.name}</h3>
          <p className="text-sm text-gray-600">{guest.email}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Pases registrados:</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{guest.adults_count} adultos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Baby className="w-4 h-4" />
              <span>{guest.children_count} niños</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{guest.pets_count} mascotas</span>
            </div>
          </div>
          <div className="mt-2 font-semibold">
            Total: {guest.passes_count} pases
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="validate-counts"
            checked={validateCounts}
            onCheckedChange={(checked) => setValidateCounts(checked as boolean)}
          />
          <Label htmlFor="validate-counts" className="text-sm">
            Validar número exacto de asistentes
          </Label>
        </div>

        {validateCounts && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">Asistentes reales:</h4>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Adultos</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={actualAdults}
                  onChange={(e) => setActualAdults(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label className="text-xs">Niños</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={actualChildren}
                  onChange={(e) => setActualChildren(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label className="text-xs">Mascotas</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={actualPets}
                  onChange={(e) => setActualPets(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="text-center text-sm">
              Total actual: <span className="font-semibold">{actualAdults + actualChildren + actualPets}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Registrando..." : "Registrar Asistencia"}
        </Button>
      </CardContent>
    </Card>
  );
};
