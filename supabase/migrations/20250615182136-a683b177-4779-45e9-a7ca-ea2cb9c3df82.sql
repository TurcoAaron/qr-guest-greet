
-- Agregar columna para imagen del evento
ALTER TABLE public.events 
ADD COLUMN image_url TEXT;

-- Crear bucket para imágenes de eventos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Política para permitir a usuarios autenticados subir imágenes
CREATE POLICY "Users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-images' AND
  auth.uid() IS NOT NULL
);

-- Política para permitir lectura pública de imágenes
CREATE POLICY "Anyone can view event images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Política para permitir a usuarios actualizar sus propias imágenes
CREATE POLICY "Users can update event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'event-images' AND
  auth.uid() IS NOT NULL
);

-- Política para permitir a usuarios eliminar sus propias imágenes
CREATE POLICY "Users can delete event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-images' AND
  auth.uid() IS NOT NULL
);
