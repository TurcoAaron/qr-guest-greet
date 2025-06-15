
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Invitado {
  id?: string;
  name: string;
  email: string;
  phone: string;
  invitation_code?: string;
  qr_code_data?: string;
  passes_count: number;
  adults_count: number;
  children_count: number;
  pets_count?: number;
}

export interface EventImage {
  id?: string;
  image_url: string;
  description?: string;
  preference: number;
}

export const useEditarEvento = (eventoId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [evento, setEvento] = useState<any>(null);
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [tipoEvento, setTipoEvento] = useState("");
  const [codigoVestimenta, setCodigoVestimenta] = useState("");
  const [templateId, setTemplateId] = useState("modern");
  const [images, setImages] = useState<EventImage[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [validateFullAttendance, setValidateFullAttendance] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (eventoId) {
      cargarEvento();
    }
  }, [eventoId]);

  const cargarEvento = async () => {
    if (!eventoId) return;

    setLoadingData(true);
    try {
      // Cargar datos del evento
      const { data: eventoData, error: eventoError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventoId)
        .single();

      if (eventoError) throw eventoError;

      if (eventoData) {
        setEvento(eventoData);
        setNombreEvento(eventoData.name || "");
        setDescripcion(eventoData.description || "");
        setFechaInicio(eventoData.start_date || eventoData.date || "");
        setFechaFin(eventoData.end_date || "");
        setUbicacion(eventoData.location || "");
        setStatus(eventoData.status || "upcoming");
        setTipoEvento(eventoData.event_type || "");
        setCodigoVestimenta(eventoData.dress_code || "");
        setTemplateId(eventoData.template_id || "modern");
        setValidateFullAttendance(eventoData.validate_full_attendance || false);
      }

      // Cargar imágenes del evento
      const { data: imagenesData, error: imagenesError } = await supabase
        .from('event_images')
        .select('*')
        .eq('event_id', eventoId)
        .order('preference');

      if (imagenesError) {
        console.error('Error cargando imágenes:', imagenesError);
      } else if (imagenesData) {
        setImages(imagenesData.map(img => ({
          id: img.id,
          image_url: img.image_url,
          description: img.description || "",
          preference: img.preference
        })));
      }

      // Cargar invitados del evento
      const { data: invitadosData, error: invitadosError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventoId);

      if (invitadosError) {
        console.error('Error cargando invitados:', invitadosError);
      } else if (invitadosData) {
        setInvitados(invitadosData.map(inv => ({
          id: inv.id,
          name: inv.name,
          email: inv.email || "",
          phone: inv.phone || "",
          invitation_code: inv.invitation_code,
          qr_code_data: inv.qr_code_data,
          passes_count: inv.passes_count || 1,
          adults_count: inv.adults_count || 1,
          children_count: inv.children_count || 0,
          pets_count: inv.pets_count || 0,
        })));
      }

    } catch (error) {
      console.error('Error cargando evento:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el evento",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const guardarCambios = async () => {
    if (!eventoId) return;

    setLoading(true);
    try {
      // Actualizar datos del evento
      const { error: eventoError } = await supabase
        .from('events')
        .update({
          name: nombreEvento,
          description: descripcion,
          start_date: fechaInicio,
          end_date: fechaFin || null,
          location: ubicacion,
          status: status,
          event_type: tipoEvento,
          dress_code: codigoVestimenta,
          template_id: templateId,
          validate_full_attendance: validateFullAttendance,
          updated_at: new Date().toISOString(),
        })
        .eq('id', eventoId);

      if (eventoError) throw eventoError;

      // Procesar invitados
      for (const invitado of invitados) {
        if (!invitado.name.trim()) continue;

        if (invitado.id) {
          // Actualizar invitado existente
          const { error: updateError } = await supabase
            .from('guests')
            .update({
              name: invitado.name,
              email: invitado.email || null,
              phone: invitado.phone || null,
              passes_count: invitado.passes_count,
              adults_count: invitado.adults_count,
              children_count: invitado.children_count,
              pets_count: invitado.pets_count || 0,
            })
            .eq('id', invitado.id);

          if (updateError) throw updateError;
        } else {
          // Crear nuevo invitado
          const invitationCode = `${invitado.name.replace(/\s+/g, '')}-${Date.now()}`;
          const qrCodeData = `${window.location.origin}/invitacion/${invitationCode}`;

          const { error: insertError } = await supabase
            .from('guests')
            .insert([{
              event_id: eventoId,
              name: invitado.name,
              email: invitado.email || null,
              phone: invitado.phone || null,
              invitation_code: invitationCode,
              qr_code_data: qrCodeData,
              passes_count: invitado.passes_count,
              adults_count: invitado.adults_count,
              children_count: invitado.children_count,
              pets_count: invitado.pets_count || 0,
            }]);

          if (insertError) throw insertError;
        }
      }

      toast({
        title: "Evento actualizado",
        description: "Los cambios se han guardado correctamente",
      });

      await cargarEvento(); // Recargar datos actualizados

    } catch (error) {
      console.error('Error guardando cambios:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadingData,
    evento,
    nombreEvento,
    setNombreEvento,
    descripcion,
    setDescripcion,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    ubicacion,
    setUbicacion,
    status,
    setStatus,
    tipoEvento,
    setTipoEvento,
    codigoVestimenta,
    setCodigoVestimenta,
    templateId,
    setTemplateId,
    images,
    setImages,
    invitados,
    setInvitados,
    validateFullAttendance,
    setValidateFullAttendance,
    guardarCambios
  };
};
