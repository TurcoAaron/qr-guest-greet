
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
}

const VisualizarInvitacion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

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
            template_id
          )
        `)
        .eq('invitation_code', codigo)
        .single();

      if (invitadoError || !invitadoData) {
        toast({
          title: "Error",
          description: "No se encontró la invitación",
          variant: "destructive",
        });
        return;
      }

      setInvitado(invitadoData);
      setEvento(invitadoData.events);
    } catch (error) {
      console.error('Error cargando invitación:', error);
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
      />
    </div>
  );
};

export default VisualizarInvitacion;
