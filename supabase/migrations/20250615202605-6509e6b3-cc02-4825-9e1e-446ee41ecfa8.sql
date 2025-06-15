
-- Agregar la columna pets_count a la tabla rsvp_responses
ALTER TABLE public.rsvp_responses 
ADD COLUMN pets_count INTEGER DEFAULT 0;
