
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Hook para buscar evento por código
export function useBuscarEvento() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function buscarEvento(codigoEvento: string) {
    if (!codigoEvento.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de evento",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: evento, error } = await supabase
        .from("events")
        .select("*")
        .eq("event_code", codigoEvento.trim().toUpperCase())
        .single();

      if (error || !evento) {
        toast({
          title: "Evento no encontrado",
          description: "No se encontró un evento con ese código",
          variant: "destructive",
        });
        return;
      }
      navigate(`/tomar-asistencia/${evento.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al buscar el evento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return { buscarEvento, loading };
}
