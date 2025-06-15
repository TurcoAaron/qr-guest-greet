
-- Agregar la columna pets_count a la tabla guests si no existe
ALTER TABLE public.guests 
ADD COLUMN IF NOT EXISTS pets_count integer NOT NULL DEFAULT 0;
