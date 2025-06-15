
-- Crear políticas adicionales para permitir consultas de asistencia sin autenticación
CREATE POLICY "Anyone can view attendances for events" 
  ON public.attendances FOR SELECT 
  USING (true);

-- Crear políticas adicionales para permitir crear asistencias sin autenticación
CREATE POLICY "Anyone can create attendances" 
  ON public.attendances FOR INSERT 
  WITH CHECK (true);

-- Crear políticas adicionales para permitir consultas de respuestas RSVP
CREATE POLICY "Anyone can view RSVP responses" 
  ON public.rsvp_responses FOR SELECT 
  USING (true);
