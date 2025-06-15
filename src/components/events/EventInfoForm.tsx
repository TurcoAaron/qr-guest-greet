import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, Clock, MapPin, Palette, ImageIcon, BarChart3, Hash } from "lucide-react";
import { TemplateSelector } from "@/components/invitation-templates/TemplateSelector";
import { ImageUploader } from "@/components/events/ImageUploader";
import type { EventImage } from "@/types/event";

interface EventInfoFormProps {
  nombreEvento: string;
  setNombreEvento: (nombreEvento: string) => void;
  descripcion: string;
  setDescripcion: (descripcion: string) => void;
  fechaInicio: string;
  setFechaInicio: (fechaInicio: string) => void;
  fechaFin: string;
  setFechaFin: (fechaFin: string) => void;
  ubicacion: string;
  setUbicacion: (ubicacion: string) => void;
  status: string;
  setStatus: (status: string) => void;
  tipoEvento: string;
  setTipoEvento: (tipoEvento: string) => void;
  codigoVestimenta: string;
  setCodigoVestimenta: (codigoVestimenta: string) => void;
  templateId: string;
  setTemplateId: (templateId: string) => void;
  images: EventImage[];
  setImages: (images: EventImage[]) => void;
  validateFullAttendance: boolean;
  setValidateFullAttendance: (validateFullAttendance: boolean) => void;
  codigoEvento: string;
  setCodigoEvento: (codigoEvento: string) => void;
  evento: any;
  loading: boolean;
}

export const EventInfoForm = ({
  nombreEvento,
  setNombreEvento,
  descripcion,
  setDescripcion,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  ubicacion,
  setUbicacion,
  status,
  setStatus,
  tipoEvento,
  setTipoEvento,
  codigoVestimenta,
  setCodigoVestimenta,
  templateId,
  setTemplateId,
  images,
  setImages,
  validateFullAttendance,
  setValidateFullAttendance,
  codigoEvento,
  setCodigoEvento,
  evento,
  loading
}: EventInfoFormProps) => {
  return (
    <>
      {/* Información básica */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5" />
            <span>Información del Evento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Evento *</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ej: Boda de María y Juan"
                value={nombreEvento}
                onChange={(e) => setNombreEvento(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoEvento">Tipo de Evento</Label>
              <Select value={tipoEvento} onValueChange={setTipoEvento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Boda</SelectItem>
                  <SelectItem value="birthday">Cumpleaños</SelectItem>
                  <SelectItem value="conference">Conferencia</SelectItem>
                  <SelectItem value="corporate">Corporativo</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="workshop">Taller</SelectItem>
                  <SelectItem value="seminar">Seminario</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe tu evento..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>

          {/* Código del evento personalizable */}
          <div className="space-y-2">
            <Label htmlFor="codigoEvento" className="flex items-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Código del Evento</span>
            </Label>
            <Input
              id="codigoEvento"
              type="text"
              placeholder="Ej: BODA2024-MJ (opcional - se generará automáticamente si se deja vacío)"
              value={codigoEvento}
              onChange={(e) => setCodigoEvento(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Código único para identificar el evento. Si no lo especificas, se generará uno automáticamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Análisis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Configuración de Análisis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="validateFullAttendance" className="text-base">
                Registro Detallado de Asistencia
              </Label>
              <div className="text-sm text-muted-foreground">
                Recopila datos completos de asistencia para comparar confirmaciones vs. asistencia real
              </div>
            </div>
            <Switch
              id="validateFullAttendance"
              checked={validateFullAttendance}
              onCheckedChange={setValidateFullAttendance}
            />
          </div>
        </CardContent>
      </Card>

      {/* Imagen del evento */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Imágenes del Evento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            images={images}
            setImages={setImages}
            uploading={loading}
          />
        </CardContent>
      </Card>

      {/* Fecha y ubicación */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Fecha y Ubicación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha y Hora de Inicio *</Label>
              <Input
                id="fechaInicio"
                type="datetime-local"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
              <Input
                id="fechaFin"
                type="datetime-local"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="ubicacion"
                  type="text"
                  placeholder="Ej: Salón de Eventos Plaza Mayor"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigoVestimenta">Código de Vestimenta</Label>
              <Select value={codigoVestimenta} onValueChange={setCodigoVestimenta}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el código" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="semi-formal">Semi-formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="business">Ejecutivo</SelectItem>
                  <SelectItem value="cocktail">Cocktail</SelectItem>
                  <SelectItem value="black-tie">Etiqueta</SelectItem>
                  <SelectItem value="white-tie">Etiqueta Rigurosa</SelectItem>
                  <SelectItem value="theme">Temático</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selector de Template */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Template de Invitación</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            selectedTemplate={templateId}
            onTemplateSelect={setTemplateId}
            eventData={{
              name: nombreEvento,
              description: descripcion,
              start_date: fechaInicio,
              end_date: fechaFin,
              location: ubicacion,
              event_type: tipoEvento,
              dress_code: codigoVestimenta,
              image_url: images.find(img => img.preference === 0)?.image_url
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};
