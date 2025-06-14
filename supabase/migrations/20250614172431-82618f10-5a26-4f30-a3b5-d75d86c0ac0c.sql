
-- Primero, insertar un evento sin organizer_id específico (usando NULL temporalmente)
INSERT INTO public.events (
  name,
  description,
  date,
  location,
  organizer_id,
  event_code,
  status
) VALUES (
  'Conferencia Tech 2024',
  'Una conferencia sobre las últimas tecnologías en desarrollo web',
  '2024-07-15 09:00:00+00',
  'Centro de Convenciones Ciudad',
  (SELECT id FROM auth.users LIMIT 1),
  'CONF2024',
  'upcoming'
);

-- Obtener el ID del evento recién creado para los invitados
WITH nuevo_evento AS (
  SELECT id FROM public.events WHERE event_code = 'CONF2024'
)
INSERT INTO public.guests (
  event_id,
  name,
  email,
  invitation_code,
  qr_code_data
) 
SELECT 
  nuevo_evento.id,
  nombre,
  email_addr,
  codigo,
  qr_data
FROM nuevo_evento,
(VALUES 
  ('Juan Pérez', 'juan.perez@email.com', 'INV001', '{"event":"CONF2024","guest":"Juan Pérez","code":"INV001"}'),
  ('María García', 'maria.garcia@email.com', 'INV002', '{"event":"CONF2024","guest":"María García","code":"INV002"}'),
  ('Carlos López', 'carlos.lopez@email.com', 'INV003', '{"event":"CONF2024","guest":"Carlos López","code":"INV003"}')
) AS invitados(nombre, email_addr, codigo, qr_data);

-- Crear políticas adicionales para permitir búsquedas públicas de eventos y invitados por código
CREATE POLICY "Anyone can view events by event_code" 
  ON public.events FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view guests by invitation_code" 
  ON public.guests FOR SELECT 
  USING (true);
