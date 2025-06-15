
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RSVPSectionProps {
  guestId: string;
  eventId: string;
  guestName: string;
}

interface RSVPResponse {
  id: string;
  response: string;
  created_at: string;
}

export const RSVPSection = ({ guestId, eventId, guestName }: RSVPSectionProps) => {
  const { toast } = useToast();
  const [rsvpResponse, setRsvpResponse] = useState<RSVPResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRSVPResponse();
  }, [guestId, eventId]);

  const loadRSVPResponse = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('guest_id', guestId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (error) throw error;
      
      setRsvpResponse(data);
    } catch (error) {
      console.error('Error loading RSVP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVPResponse = async (response: 'attending' | 'not_attending' | 'maybe') => {
    setSubmitting(true);

    try {
      if (rsvpResponse) {
        // Actualizar respuesta existente
        const { error } = await supabase
          .from('rsvp_responses')
          .update({ 
            response,
            updated_at: new Date().toISOString()
          })
          .eq('id', rsvpResponse.id);

        if (error) throw error;

        setRsvpResponse({ ...rsvpResponse, response });
      } else {
        // Crear nueva respuesta
        const { data, error } = await supabase
          .from('rsvp_responses')
          .insert({
            guest_id: guestId,
            event_id: eventId,
            response
          })
          .select()
          .single();

        if (error) throw error;

        setRsvpResponse(data);
      }

      const messages = {
        attending: "¡Confirmado! Tu asistencia ha sido registrada",
        not_attending: "Hemos registrado que no podrás asistir",
        maybe: "Hemos registrado tu respuesta como 'Tal vez'"
      };

      toast({
        title: "Respuesta registrada",
        description: messages[response],
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar tu respuesta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-center mb-4 text-purple-800">
          ¿Podrás acompañarnos, {guestName}?
        </h3>
        
        {rsvpResponse && (
          <div className="text-center mb-4 p-3 bg-white rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {rsvpResponse.response === 'attending' && (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">Confirmaste tu asistencia</span>
                </>
              )}
              {rsvpResponse.response === 'not_attending' && (
                <>
                  <X className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Confirmaste que no podrás asistir</span>
                </>
              )}
              {rsvpResponse.response === 'maybe' && (
                <>
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-600 font-medium">Marcaste como "Tal vez"</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">¿Quieres cambiar tu respuesta?</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => handleRSVPResponse('attending')}
            disabled={submitting}
            className={`${
              rsvpResponse?.response === 'attending' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Asistiré
          </Button>
          
          <Button
            onClick={() => handleRSVPResponse('maybe')}
            disabled={submitting}
            variant="outline"
            className={`${
              rsvpResponse?.response === 'maybe' 
                ? 'border-orange-600 text-orange-600 bg-orange-50' 
                : 'border-orange-500 text-orange-500 hover:bg-orange-50'
            }`}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            Tal vez
          </Button>
          
          <Button
            onClick={() => handleRSVPResponse('not_attending')}
            disabled={submitting}
            variant="outline"
            className={`${
              rsvpResponse?.response === 'not_attending' 
                ? 'border-red-600 text-red-600 bg-red-50' 
                : 'border-red-500 text-red-500 hover:bg-red-50'
            }`}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            No podré asistir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
