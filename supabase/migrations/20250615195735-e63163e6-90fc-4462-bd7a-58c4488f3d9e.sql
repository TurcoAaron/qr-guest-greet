
-- Agregar la columna validate_full_attendance a la tabla events
ALTER TABLE public.events 
ADD COLUMN validate_full_attendance BOOLEAN DEFAULT false;
