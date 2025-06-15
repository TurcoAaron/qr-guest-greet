
-- Agregar la columna pets_count a la tabla guests
ALTER TABLE public.guests 
ADD COLUMN pets_count INTEGER DEFAULT 0;
