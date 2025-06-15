
-- Agregar campo template_id a la tabla events
ALTER TABLE public.events 
ADD COLUMN template_id TEXT DEFAULT 'modern';

-- Agregar comentario para documentar los templates disponibles
COMMENT ON COLUMN public.events.template_id IS 'Template de invitación: modern, elegant, festive, corporate, minimalist';
