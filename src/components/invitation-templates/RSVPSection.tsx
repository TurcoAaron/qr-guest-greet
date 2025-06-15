
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RSVPSectionProps {
  guestId: string;
  eventId: string;
  guestName: string;
  maxPasses?: number;
  defaultAdults?: number;
  defaultChildren?: number;
  defaultPets?: number;
}

interface RSVPResponse {
  id: string;
  response: string;
  passes_count: number;
  adults_count: number;
  children_count: number;
  pets_count: number;
  created_at: string;
}

export const RSVPSection = ({ 
  guestId, 
  eventId, 
  guestName, 
  maxPasses = 1,
  defaultAdults = 1,
  defaultChildren = 0,
  defaultPets = 0
}: RSVPSectionProps) => {
  const { toast } = useToast();
  const [rsvpResponse, setRsvpResponse] = useState<RSVPResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [adultsCount, setAdultsCount] = useState(defaultAdults);
  const [childrenCount, setChildrenCount] = useState(defaultChildren);
  const [petsCount, setPetsCount] = useState(defaultPets);

  useEffect(() => {
    loadRSVPResponse();
  }, [guestId, eventId]);

  useEffect(() => {
    // Actualizar el conteo cuando cambian los valores por defecto
    if (!rsvpResponse) {
      setAdultsCount(defaultAdults);
      setChildrenCount(defaultChildren);
      setPetsCount(defaultPets);
    }
  }, [defaultAdults, defaultChildren, defaultPets, rsvpResponse]);

  const loadRSVPResponse = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('guest_id', guestId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setRsvpResponse(data);
        setAdultsCount(data.adults_count);
        setChildrenCount(data.children_count);
        // Asegurar que pets_count no sea null
        setPetsCount(data.pets_count || 0);
      }
    } catch (error) {
      console.error('Error loading RSVP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVPResponse = async (response: 'attending' | 'not_attending' | 'maybe') => {
    setSubmitting(true);

    const totalPasses = adultsCount + childrenCount + petsCount;

    if (response === 'attending' && totalPasses > maxPasses) {
      toast({
        title: "Error",
        description: `No puedes seleccionar más de ${maxPasses} pases.`,
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    if (response === 'attending' && totalPasses === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos 1 persona para confirmar asistencia.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    try {
      const rsvpData = {
        response,
        passes_count: response === 'attending' ? totalPasses : 0,
        adults_count: response === 'attending' ? adultsCount : 0,
        children_count: response === 'attending' ? childrenCount : 0,
        pets_count: response === 'attending' ? petsCount : 0,
      };

      if (rsvpResponse) {
        // Actualizar respuesta existente
        const { error } = await supabase
          .from('rsvp_responses')
          .update({ 
            ...rsvpData,
            updated_at: new Date().toISOString()
          })
          .eq('id', rsvpResponse.id);

        if (error) throw error;

        setRsvpResponse({ ...rsvpResponse, ...rsvpData });
      } else {
        // Crear nueva respuesta
        const { data, error } = await supabase
          .from('rsvp_responses')
          .insert({
            guest_id: guestId,
            event_id: eventId,
            ...rsvpData
          })
          .select()
          .single();

        if (error) throw error;

        setRsvpResponse(data);
      }

      const messages = {
        attending: `¡Confirmado! Tu asistencia ha sido registrada para ${totalPasses} persona${totalPasses > 1 ? 's' : ''}`,
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

  const totalPasses = adultsCount + childrenCount + petsCount;

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
                  <span className="text-green-600 font-medium">
                    Confirmaste asistencia para {rsvpResponse.passes_count} persona{rsvpResponse.passes_count > 1 ? 's' : ''}
                  </span>
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
            {rsvpResponse.response === 'attending' && rsvpResponse.passes_count > 0 && (
              <p className="text-sm text-gray-600">
                {rsvpResponse.adults_count} adulto{rsvpResponse.adults_count !== 1 ? 's' : ''} 
                {rsvpResponse.children_count > 0 && `, ${rsvpResponse.children_count} niño${rsvpResponse.children_count !== 1 ? 's' : ''}`}
                {(rsvpResponse.pets_count || 0) > 0 && `, ${rsvpResponse.pets_count || 0} mascota${(rsvpResponse.pets_count || 0) !== 1 ? 's' : ''}`}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">¿Quieres cambiar tu respuesta?</p>
          </div>
        )}

        {/* Selector de número de personas */}
        <div className="mb-6 p-4 bg-white rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-4 h-4 text-purple-600" />
            <Label className="text-sm font-medium">Número de asistentes (máx. {maxPasses})</Label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="adults" className="text-xs text-gray-600">Adultos</Label>
              <Input
                id="adults"
                type="number"
                min="0"
                max={maxPasses}
                value={adultsCount}
                onChange={(e) => setAdultsCount(Math.max(0, Math.min(maxPasses, parseInt(e.target.value) || 0)))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="children" className="text-xs text-gray-600">Niños</Label>
              <Input
                id="children"
                type="number"
                min="0"
                max={maxPasses}
                value={childrenCount}
                onChange={(e) => setChildrenCount(Math.max(0, Math.min(maxPasses - adultsCount, parseInt(e.target.value) || 0)))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pets" className="text-xs text-gray-600">Mascotas</Label>
              <Input
                id="pets"
                type="number"
                min="0"
                max={maxPasses}
                value={petsCount}
                onChange={(e) => setPetsCount(Math.max(0, Math.min(maxPasses - adultsCount - childrenCount, parseInt(e.target.value) || 0)))}
                className="mt-1"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Total: {totalPasses} de {maxPasses} pases
          </p>
        </div>

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
