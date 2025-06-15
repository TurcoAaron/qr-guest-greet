
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { EventImage } from "@/types/event";

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
}

export interface Evento {
  id: string;
  name: string;
  description: string;
  date: string;
  start_date: string;
  end_date: string;
  location: string;
  event_code: string;
  status: string;
  event_type: string;
  dress_code: string;
  template_id: string;
  image_url: string; // URL de la imagen principal
  images: EventImage[]; // Todas las imágenes
}

export const useEditarEvento = (eventoId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Estado del evento
  const [evento, setEvento] = useState<Evento | null>(null);
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [tipoEvento, setTipoEvento] = useState("");
  const [codigoVestimenta, setCodigoVestimenta] = useState("");
  const [templateId, setTemplateId] = useState("modern");
  const [images, setImages] = useState<EventImage[]>([]);
  
  // Estado de invitados
  const [invitados, setInvitados] = useState<Invitado[]>([]);

  useEffect(() => {
    if (eventoId) {
      cargarEvento();
    }
  }, [eventoId]);

  const cargarEvento = async () => {
    try {
      // Cargar evento
      const { data: eventoData, error: eventoError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventoId)
        .eq('organizer_id', user?.id)
        .single();

      if (eventoError) throw eventoError;

      // Cargar imágenes del evento
      const { data: imagesData, error: imagesError } = await supabase
        .from('event_images')
        .select('id, image_url, preference')
        .eq('event_id', eventoId)
        .order('preference', { ascending: true });

      if (imagesError) throw imagesError;

      setImages(imagesData || []);

      // Crear objeto evento con las imágenes incluidas
      const eventoConImagenes: Evento = {
        ...eventoData,
        images: imagesData || []
      };

      setEvento(eventoConImagenes);
      setNombreEvento(eventoData.name);
      setDescripcion(eventoData.description || "");
      setFecha(eventoData.date);
      setFechaInicio(eventoData.start_date || eventoData.date);
      setFechaFin(eventoData.end_date || "");
      setUbicacion(eventoData.location || "");
      setStatus(eventoData.status);
      setTipoEvento(eventoData.event_type || "");
      setCodigoVestimenta(eventoData.dress_code || "");
      setTemplateId(eventoData.template_id || "modern");

      // Cargar invitados
      const { data: invitadosData, error: invitadosError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventoId)
        .order('name');

      if (invitadosError) throw invitadosError;

      setInvitados(invitadosData || []);
    } catch (error) {
      console.error('Error cargando evento:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el evento",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoadingData(false);
    }
  };

  const generarCodigoInvitacion = (index: number) => {
    if (!evento?.event_code) return `INV${Date.now().toString().slice(-6)}${(index + 1).toString().padStart(2, '0')}`;
    
    const numeracion = (index + 1).toString().padStart(2, '0');
    return `INV-${evento.event_code}-${numeracion}`;
  };

  const guardarCambios = async () => {
    // Validaciones
    if (!nombreEvento.trim()) {
      toast({
        title: "Error",
        description: "El nombre del evento es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!fechaInicio) {
      toast({
        title: "Error",
        description: "La fecha de inicio es requerida",
        variant: "destructive",
      });
      return;
    }

    if (fechaFin && fechaFin < fechaInicio) {
      toast({
        title: "Error",
        description: "La fecha de fin no puede ser anterior a la fecha de inicio",
        variant: "destructive",
      });
      return;
    }

    const invitadosValidos = invitados.filter(inv => inv.name.trim());

    setLoading(true);

    try {
      // 1. Subir nuevas imágenes a Supabase Storage
      const processedImages = await Promise.all(
        images.map(async (image) => {
          if (image.file) {
            const fileExt = image.file.name.split('.').pop();
            const fileName = `${eventoId}-${Date.now()}-${Math.random()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('event-images')
              .upload(fileName, image.file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
              .from('event-images')
              .getPublicUrl(uploadData.path);
            
            return { ...image, image_url: urlData.publicUrl, file: undefined };
          }
          return image;
        })
      );

      // 2. Actualizar evento
      const primaryImageUrl = processedImages.sort((a, b) => a.preference - b.preference)[0]?.image_url || null;

      const { error: errorEvento } = await supabase
        .from('events')
        .update({
          name: nombreEvento.trim(),
          description: descripcion?.trim() || null,
          date: fechaInicio,
          start_date: fechaInicio,
          end_date: fechaFin || null,
          location: ubicacion?.trim() || null,
          status: status,
          event_type: tipoEvento?.trim() || null,
          dress_code: codigoVestimenta?.trim() || null,
          template_id: templateId,
          image_url: primaryImageUrl
        })
        .eq('id', eventoId);

      if (errorEvento) throw errorEvento;

      // 3. Borrar imágenes antiguas y guardar la nueva lista
      await supabase.from('event_images').delete().eq('event_id', eventoId);

      if (processedImages.length > 0) {
        const imageInserts = processedImages.map(img => ({
          event_id: eventoId,
          image_url: img.image_url,
          preference: img.preference,
        }));
        await supabase.from('event_images').insert(imageInserts);
      }

      // Procesar invitados
      for (const [index, invitado] of invitadosValidos.entries()) {
        if (invitado.id) {
          // Actualizar invitado existente
          const { error } = await supabase
            .from('guests')
            .update({
              name: invitado.name.trim(),
              email: invitado.email?.trim() || null,
              phone: invitado.phone?.trim() || null,
              passes_count: invitado.passes_count,
              adults_count: invitado.adults_count,
              children_count: invitado.children_count
            })
            .eq('id', invitado.id);

          if (error) throw error;
        } else {
          // Crear nuevo invitado
          const codigoInvitacion = generarCodigoInvitacion(index);
          const qrData = JSON.stringify({
            event_id: eventoId,
            event_name: nombreEvento,
            guest_name: invitado.name,
            invitation_code: codigoInvitacion
          });

          const { error } = await supabase
            .from('guests')
            .insert({
              event_id: eventoId,
              name: invitado.name.trim(),
              email: invitado.email?.trim() || null,
              phone: invitado.phone?.trim() || null,
              invitation_code: codigoInvitacion,
              qr_code_data: qrData,
              passes_count: invitado.passes_count,
              adults_count: invitado.adults_count,
              children_count: invitado.children_count
            });

          if (error) throw error;
        }
      }

      toast({
        title: "¡Cambios Guardados!",
        description: `Se actualizó el evento "${nombreEvento}"`,
      });

      navigate('/dashboard');

    } catch (error) {
      console.error('Error guardando cambios:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    loading,
    loadingData,
    evento,
    nombreEvento,
    setNombreEvento,
    descripcion,
    setDescripcion,
    fecha,
    setFecha,
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
    // Funciones
    guardarCambios,
    generarCodigoInvitacion
  };
};
