
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EventImage } from "@/types/event";

interface ImageUploaderProps {
  images: EventImage[];
  setImages: (images: EventImage[]) => void;
  uploading: boolean;
}

export const ImageUploader = ({ images, setImages, uploading }: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const files = Array.from(event.target.files);
    const newImages: EventImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error de archivo",
          description: `"${file.name}" no es una imagen válida.`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: `"${file.name}" supera los 5MB.`,
          variant: "destructive",
        });
        continue;
      }

      newImages.push({
        image_url: URL.createObjectURL(file),
        preference: images.length + newImages.length,
        file: file,
      });
    }

    if (newImages.length > 0) {
      setImages([...images, ...newImages]);
    }
    
    // Reset file input
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    URL.revokeObjectURL(imageToRemove.image_url); // Clean up blob URL
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages.map((img, i) => ({ ...img, preference: i })));
  };

  const setAsPrimary = (index: number) => {
    if (index === 0) return; // Already primary
    const itemToMove = images[index];
    const remainingItems = images.filter((_, i) => i !== index);
    const reorderedImages = [itemToMove, ...remainingItems];
    setImages(reorderedImages.map((img, i) => ({ ...img, preference: i })));
    toast({
      title: "Imagen Principal Actualizada",
      description: "La imagen ha sido establecida como principal.",
    });
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">Imágenes del Evento</Label>
      
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group border rounded-lg overflow-hidden">
              <img
                src={image.image_url}
                alt={`Imagen del evento ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-0 right-0 bg-black bg-opacity-50 p-1 rounded-bl-lg flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => setAsPrimary(index)}
                  title="Marcar como principal"
                  disabled={index === 0}
                >
                  <Star className={`w-4 h-4 ${index === 0 ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20 hover:text-red-400"
                  onClick={() => removeImage(index)}
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">Arrastra imágenes o haz click para seleccionar</p>
        <div className="flex items-center justify-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="image-upload"
            multiple
          />
          <label htmlFor="image-upload">
            <Button asChild disabled={uploading}>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Subiendo..." : "Seleccionar Imágenes"}
              </span>
            </Button>
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          JPG, PNG, WebP o GIF (máx. 5MB)
        </p>
      </div>
    </div>
  );
};
