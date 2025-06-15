
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export interface Invitado {
  name: string;
  email: string;
  phone: string;
  passes_count: number;
  adults_count: number;
  children_count: number;
  pets_count: number;
}

export interface EventImage {
  image_url: string;
  description?: string;
  preference: number;
}

export const useCrearEvento = () => {
  const [loading, setLoading] = useState(false);
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [codigoVestimenta, setCodigoVestimenta] = useState("");
  const [templateId, setTemplateId] = useState("modern");
  const [images, setImages] = useState<EventImage[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [validateFullAttendance, setValidateFullAttendance] = useState(false);
  const [codigoEvento, setCodigoEvento] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const generarCodigoEvento = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const día = fecha.getDate().toString().padStart(2, '0');
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minuto = fecha.getMinutes().toString().padStart(2, '0');
    
    return `EVT-${año}${mes}${día}-${hora}${minuto}`;
  };

  const generarCodigoInvitacion = (index: number, codigoEvento: string, nombreInvitado: string) => {
    const numeracion = (index + 1).toString().padStart(2, '0');
    const nombreLimpio = nombreInvitado.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    return `INV-${codigoEvento}-${nombreLimpio}-${numeracion}`;
  };

  const agregarInvitado = () => {
    setInvitados([...invitados, { 
      name: "", 
      email: "", 
      phone: "",
      passes_count: 1,
      adults_count: 1,
      children_count: 0,
      pets_count: 0
    }]);
  };

  const eliminarInvitado = (index: number) => {
    setInvitados(invitados.filter((_, i) => i !== index));
  };

  const actualizarInvitado = (index: number, field: keyof Invitado, value: string | number) => {
    const nuevosInvitados = [...invitados];
    
    if (field === 'name' || field === 'email' || field === 'phone') {
      nuevosInvitados[index][field] = value as string;
    } else if (field === 'passes_count' || field === 'adults_count' || field === 'children_count' || field === 'pets_count') {
      nuevosInvitados[index][field] = value as number;
    }
    
    // Si se actualiza adults_count, children_count o pets_count, actualizar passes_count automáticamente
    if (field === 'adults_count' || field === 'children_count' || field === 'pets_count') {
      const adults = field === 'adults_count' ? Number(value) : nuevosInvitados[index].adults_count;
      const children = field === 'children_count' ? Number(value) : nuevosInvitados[index].children_count;
      const pets = field === 'pets_count' ? Number(value) : (nuevosInvitados[index].pets_count || 0);
      nuevosInvitados[index].passes_count = adults + children + pets;
    }
    
    setInvitados(nuevosInvitados);
  };

  const crearEvento = async () => {
    if (!nombreEvento || !fechaInicio) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Usar el código personalizado o generar uno automático
      const codigoFinal = codigoEvento.trim() || generarCodigoEvento();

      // Crear el evento
      const { data: eventoData, error: eventoError } = await supabase
        .from('events')
        .insert([{
          name: nombreEvento,
          description: descripcion,
          start_date: fechaInicio,
          end_date: fechaFin || null,
          date: fechaInicio, // Para compatibilidad
          location: ubicacion,
          event_type: tipoEvento,
          dress_code: codigoVestimenta,
          template_id: templateId,
          validate_full_attendance: validateFullAttendance,
          event_code: codigoFinal,
          organizer_id: "temp-user-id", // TODO: Usar el ID del usuario autenticado
          status: "upcoming"
        }])
        .select()
        .single();

      if (eventoError) throw eventoError;

      const eventoId = eventoData.id;

      // Crear las imágenes del evento
      if (images.length > 0) {
        const imagenesData = images.map(img => ({
          event_id: eventoId,
          image_url: img.image_url,
          description: img.description || "",
          preference: img.preference
        }));

        const { error: imagenesError } = await supabase
          .from('event_images')
          .insert(imagenesData);

        if (imagenesError) {
          console.error('Error creando imágenes:', imagenesError);
        }
      }

      // Crear los invitados
      if (invitados.length > 0) {
        const invitadosValidos = invitados.filter(inv => inv.name.trim());
        
        for (const [index, invitado] of invitadosValidos.entries()) {
          const invitationCode = generarCodigoInvitacion(index, codigoFinal, invitado.name);
          const qrCodeData = JSON.stringify({
            event_id: eventoId,
            event_name: nombreEvento,
            guest_name: invitado.name,
            invitation_code: invitationCode
          });

          console.log('Creando invitado:', {
            ...invitado,
            pets_count: invitado.pets_count
          });

          const { error: invitadoError } = await supabase
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
              pets_count: invitado.pets_count,
            }]);

          if (invitadoError) {
            console.error('Error creando invitado:', invitadoError);
            throw invitadoError;
          }
        }
      }

      toast({
        title: "Evento creado",
        description: "El evento se ha creado exitosamente",
      });

      // Navegar al evento creado
      navigate(`/editar-evento/${eventoId}`);

    } catch (error) {
      console.error('Error creando evento:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el evento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
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
    codigoEvento,
    setCodigoEvento,
    agregarInvitado,
    eliminarInvitado,
    actualizarInvitado,
    crearEvento
  };
};
