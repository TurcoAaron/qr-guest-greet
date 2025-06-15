
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  onImageRemoved?: () => void;
}

export const ImageUploader = ({ onImageUploaded, currentImageUrl, onImageRemoved }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Por favor selecciona un archivo de imagen válido",
          variant: "destructive",
        });
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen no puede ser mayor a 5MB",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      
      toast({
        title: "¡Imagen subida!",
        description: "La imagen se ha subido correctamente",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada del evento",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image">Imagen del Evento</Label>
      
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Imagen del evento"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Sube una imagen para tu evento</p>
          <div className="flex items-center justify-center">
            <Input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button asChild disabled={uploading}>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Subiendo..." : "Seleccionar Imagen"}
                </span>
              </Button>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            JPG, PNG, WebP o GIF (máx. 5MB)
          </p>
        </div>
      )}
    </div>
  );
};
