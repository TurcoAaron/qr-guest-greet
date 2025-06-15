
-- Recrear la base de datos completa para el sistema de gestión de eventos
-- Corrigiendo el orden de eliminación para evitar dependencias

-- 1. Eliminar triggers primero para evitar dependencias
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_event_status_trigger ON public.events;

-- 2. Eliminar funciones después de los triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_event_status() CASCADE;

-- 3. Eliminar tablas en orden inverso de dependencias
DROP TABLE IF EXISTS public.rsvp_responses CASCADE;
DROP TABLE IF EXISTS public.attendances CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 4. Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 5. Crear tabla de eventos
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  event_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  event_type TEXT,
  dress_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. Crear tabla de invitados
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  invitation_code TEXT NOT NULL UNIQUE,
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. Crear tabla de asistencias
CREATE TABLE public.attendances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  checked_in_by UUID REFERENCES auth.users(id),
  UNIQUE(guest_id, event_id)
);

-- 8. Crear tabla para respuestas de asistencia (RSVP)
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  response TEXT NOT NULL CHECK (response IN ('attending', 'not_attending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(guest_id, event_id)
);

-- 9. Habilitar RLS (Row Level Security) en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- 10. Crear políticas para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 11. Crear políticas para events
CREATE POLICY "Users can view their own events" 
  ON public.events FOR SELECT 
  USING (auth.uid() = organizer_id);

CREATE POLICY "Users can create events" 
  ON public.events FOR INSERT 
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own events" 
  ON public.events FOR UPDATE 
  USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their own events" 
  ON public.events FOR DELETE 
  USING (auth.uid() = organizer_id);

CREATE POLICY "Anyone can view events by event_code" 
  ON public.events FOR SELECT 
  USING (true);

-- 12. Crear políticas para guests
CREATE POLICY "Users can view guests of their events" 
  ON public.guests FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = guests.event_id 
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Users can create guests for their events" 
  ON public.guests FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = guests.event_id 
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Users can update guests of their events" 
  ON public.guests FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = guests.event_id 
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Users can delete guests of their events" 
  ON public.guests FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = guests.event_id 
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Anyone can view guests by invitation_code" 
  ON public.guests FOR SELECT 
  USING (true);

-- 13. Crear políticas para attendances
CREATE POLICY "Users can view attendances of their events" 
  ON public.attendances FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = attendances.event_id 
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Users can create attendances for their events" 
  ON public.attendances FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = attendances.event_id 
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Anyone can view attendances for events" 
  ON public.attendances FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create attendances" 
  ON public.attendances FOR INSERT 
  WITH CHECK (true);

-- 14. Crear políticas para rsvp_responses
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

CREATE POLICY "Anyone can view RSVP responses" 
  ON public.rsvp_responses FOR SELECT 
  USING (true);

-- 15. Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- 16. Crear trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. Crear función para actualizar estado de eventos
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

-- 18. Crear trigger para actualizar estado de eventos
CREATE TRIGGER update_event_status_trigger
  AFTER UPDATE ON public.events
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_event_status();

-- 19. Insertar datos de ejemplo
INSERT INTO public.events (
  name,
  description,
  date,
  start_date,
  location,
  organizer_id,
  event_code,
  status
) VALUES (
  'Conferencia Tech 2024',
  'Una conferencia sobre las últimas tecnologías en desarrollo web',
  '2024-07-15 09:00:00+00',
  '2024-07-15 09:00:00+00',
  'Centro de Convenciones Ciudad',
  (SELECT id FROM auth.users LIMIT 1),
  'CONF2024',
  'upcoming'
) ON CONFLICT (event_code) DO NOTHING;

-- 20. Insertar invitados de ejemplo
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
) AS invitados(nombre, email_addr, codigo, qr_data)
ON CONFLICT (invitation_code) DO NOTHING;
