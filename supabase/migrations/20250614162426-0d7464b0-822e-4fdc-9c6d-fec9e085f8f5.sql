
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Crear tabla de eventos
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  event_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de invitados
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  invitation_code TEXT NOT NULL UNIQUE,
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de asistencias
CREATE TABLE public.attendances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  checked_in_by UUID REFERENCES auth.users(id),
  UNIQUE(guest_id, event_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas para events
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

-- Políticas para guests
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

-- Políticas para attendances
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

-- Función para crear perfil automáticamente cuando se registra un usuario
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

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
