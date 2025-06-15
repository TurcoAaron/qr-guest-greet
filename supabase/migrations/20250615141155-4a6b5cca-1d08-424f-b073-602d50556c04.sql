
-- Eliminar las columnas de códigos que no se necesitan
ALTER TABLE public.events DROP COLUMN IF EXISTS event_code;
ALTER TABLE public.guests DROP COLUMN IF EXISTS invitation_code;

-- Eliminar las políticas que referencian códigos que ya no existen
DROP POLICY IF EXISTS "Anyone can view events by event_code" ON public.events;
DROP POLICY IF EXISTS "Anyone can view guests by invitation_code" ON public.guests;

-- Crear nuevas políticas para acceso público por ID
CREATE POLICY "Anyone can view events by id" 
  ON public.events FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view guests by id" 
  ON public.guests FOR SELECT 
  USING (true);

-- Actualizar los datos de prueba existentes para quitar referencias a códigos
UPDATE public.guests 
SET qr_code_data = jsonb_build_object(
  'guest_id', id,
  'event_id', event_id,
  'type', 'guest_access'
)::text
WHERE qr_code_data IS NOT NULL;
