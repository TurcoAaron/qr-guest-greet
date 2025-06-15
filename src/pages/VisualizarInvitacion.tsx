import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TemplateRenderer } from "@/components/invitation-templates/TemplateRenderer";

interface Invitado {
  id: string;
  name: string;
  email: string;
  phone: string;
  invitation_code: string;
  qr_code_data: string;
  passes_count: number;
  adults_count: number;
  children_count: number;
  pets_count: number;
}

interface Evento {
  id: string;
  name: string;
  description: string;
  date: string;
  start_date: string;
  end_date: string;
  location: string;
  event_type: string;
  dress_code: string;
  template_id: string;
  image_url: string;
}

const VisualizarInvitacion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);

  useEffect(() => {
    const codigo = searchParams.get("codigo");
    if (codigo) {
      cargarInvitacion(codigo);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const cargarInvitacion = async (codigo: string) => {
    try {
      const { data: invitadoData, error: invitadoError } = await supabase
        .from('guests')
        .select(`
          *,
          events (
            id,
            name,
            description,
            date,
            start_date,
            end_date,
            location,
            event_type,
            dress_code,
            template_id,
            image_url
          )
        `)
        .eq('invitation_code', codigo)
        .single();

      if (invitadoError || !invitadoData) {
        console.error('Error cargando invitación:', invitadoError);
        toast({
          title: "Error",
          description: "No se encontró la invitación",
          variant: "destructive",
        });
        return;
      }

      console.log('Datos del invitado cargados:', invitadoData);

      // Convertir la respuesta de la base de datos al tipo Invitado esperado
      const invitadoTyped: Invitado = {
        id: invitadoData.id,
        name: invitadoData.name,
        email: invitadoData.email || '',
        phone: invitadoData.phone || '',
        invitation_code: invitadoData.invitation_code,
        qr_code_data: invitadoData.qr_code_data,
        passes_count: invitadoData.passes_count,
        adults_count: invitadoData.adults_count,
        children_count: invitadoData.children_count,
        pets_count: invitadoData.pets_count || 0 // Asegurar que pets_count tenga un valor válido
      };

      setInvitado(invitadoTyped);
      
      // Asegurar que tenemos una fecha válida para la cuenta regresiva y template válida
      const eventoConFecha = {
        ...invitadoData.events,
        start_date: invitadoData.events.start_date || invitadoData.events.date,
        template_id: invitadoData.events.template_id || 'modern' // Fallback a modern si no hay template
      };
      
      console.log('Template ID a usar:', eventoConFecha.template_id);
      setEvento(eventoConFecha);
    } catch (error) {
      console.error('Error cargando invitación:', error);
      setTemplateError(`Error de carga: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      toast({
        title: "Error",
        description: "No se pudo cargar la invitación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (templateError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error de Template</h2>
          <p className="text-gray-600 mb-4">{templateError}</p>
          <p className="text-sm text-gray-500 mb-8">
            Por favor, contacta al organizador del evento.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!invitado || !evento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md">
          <XCircle className="w-20 h-20 mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Invitación no encontrada</h2>
          <p className="text-gray-600 mb-8">
            No se pudo encontrar la invitación. Verifica que el código sea correcto.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <TemplateRenderer
        templateId={evento.template_id || 'modern'}
        invitado={invitado}
        evento={evento}
        showRSVP={true}
        maxPasses={invitado.passes_count}
        defaultAdults={invitado.adults_count}
        defaultChildren={invitado.children_count}
        defaultPets={invitado.pets_count}
      />
    </div>
  );
};

export default VisualizarInvitacion;
