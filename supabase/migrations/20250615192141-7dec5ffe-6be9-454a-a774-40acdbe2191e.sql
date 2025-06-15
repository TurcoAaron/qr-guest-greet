
-- Agregar columnas para el número de pases a la tabla guests
ALTER TABLE public.guests 
ADD COLUMN passes_count INTEGER NOT NULL DEFAULT 1,
ADD COLUMN adults_count INTEGER NOT NULL DEFAULT 1,
ADD COLUMN children_count INTEGER NOT NULL DEFAULT 0;

-- Agregar columnas para el número de pases a la tabla rsvp_responses
ALTER TABLE public.rsvp_responses 
ADD COLUMN passes_count INTEGER NOT NULL DEFAULT 1,
ADD COLUMN adults_count INTEGER NOT NULL DEFAULT 1,
ADD COLUMN children_count INTEGER NOT NULL DEFAULT 0;
