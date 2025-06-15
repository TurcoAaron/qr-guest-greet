
-- Agregar nuevos campos a la tabla events
ALTER TABLE public.events 
ADD COLUMN start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN event_type TEXT,
ADD COLUMN dress_code TEXT;

-- Agregar campo de teléfono a la tabla guests
ALTER TABLE public.guests 
ADD COLUMN phone TEXT;

-- Crear tabla para respuestas de asistencia
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  response TEXT NOT NULL CHECK (response IN ('attending', 'not_attending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(guest_id, event_id)
);

-- Habilitar RLS para la tabla de respuestas
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Políticas para rsvp_responses
CREATE POLICY "Organizers can view responses to their events" 
  ON public.rsvp_responses FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = rsvp_responses.event_id 
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Anyone can create RSVP responses" 
  ON public.rsvp_responses FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update their RSVP responses" 
  ON public.rsvp_responses FOR UPDATE 
  USING (true);

-- Función para actualizar automáticamente el estado del evento
CREATE OR REPLACE FUNCTION public.update_event_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar eventos que deberían estar activos
  UPDATE public.events 
  SET status = 'active' 
  WHERE status = 'upcoming' 
    AND start_date <= NOW() 
    AND (end_date IS NULL OR end_date >= NOW());
  
  -- Actualizar eventos que deberían estar completados
  UPDATE public.events 
  SET status = 'completed' 
  WHERE status = 'active' 
    AND end_date IS NOT NULL 
    AND end_date < NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el estado automáticamente cuando se actualiza un evento
CREATE TRIGGER update_event_status_trigger
  AFTER UPDATE ON public.events
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_event_status();

-- Migrar datos existentes: usar date como start_date para eventos existentes
UPDATE public.events 
SET start_date = date 
WHERE start_date IS NULL;
