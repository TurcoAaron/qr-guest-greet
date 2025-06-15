
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Hook para buscar invitación por código
export function useBuscarInvitacion() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function buscarInvitacion(codigoInvitacion: string) {
    if (!codigoInvitacion.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de invitación",
        variant: "destructive",
      });
      return;
    }
    const codigo = codigoInvitacion.trim().toUpperCase();
    setLoading(true);
    try {
      const { data: invitado, error } = await supabase
        .from("guests")
        .select("*, events(*)")
        .eq("invitation_code", codigo)
        .maybeSingle();

      if (error || !invitado) {
        toast({
          title: "Invitación no encontrada",
          description: "No se encontró una invitación con ese código. Verifica que el código sea correcto y en mayúsculas.",
          variant: "destructive",
        });
        return;
      }
      if (!invitado.events) {
        toast({
          title: "Evento no encontrado",
          description: "La invitación está asociada a un evento que no existe.",
          variant: "destructive",
        });
        return;
      }
      navigate(`/invitacion?codigo=${encodeURIComponent(codigo)}`);
    } catch (e) {
      toast({
        title: "Error",
        description: "Error al buscar la invitación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return { buscarInvitacion, loading };
}
