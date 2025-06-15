
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Evento } from "@/hooks/useEditarEvento";

interface EventInfoFormProps {
  nombreEvento: string;
  setNombreEvento: (value: string) => void;
  descripcion: string;
  setDescripcion: (value: string) => void;
  fechaInicio: string;
  setFechaInicio: (value: string) => void;
  fechaFin: string;
  setFechaFin: (value: string) => void;
  ubicacion: string;
  setUbicacion: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  tipoEvento: string;
  setTipoEvento: (value: string) => void;
  codigoVestimenta: string;
  setCodigoVestimenta: (value: string) => void;
  templateId: string;
  setTemplateId: (value: string) => void;
  evento: Evento;
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
  evento
}: EventInfoFormProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Información del Evento</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nombre">Nombre del Evento *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Nombre del evento"
              value={nombreEvento}
              onChange={(e) => setNombreEvento(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="status">Estado del Evento</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Próximo</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="tipo">Tipo de Evento</Label>
            <Select value={tipoEvento} onValueChange={setTipoEvento}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecciona el tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conference">Conferencia</SelectItem>
                <SelectItem value="wedding">Boda</SelectItem>
                <SelectItem value="birthday">Cumpleaños</SelectItem>
                <SelectItem value="corporate">Corporativo</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="workshop">Taller</SelectItem>
                <SelectItem value="seminar">Seminario</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="codigoVestimenta">Código de Vestimenta</Label>
            <Select value={codigoVestimenta} onValueChange={setCodigoVestimenta}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecciona el código de vestimenta" />
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

          <div>
            <Label htmlFor="template">Template de Invitación</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecciona el template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Moderno</SelectItem>
                <SelectItem value="elegant">Elegante</SelectItem>
                <SelectItem value="festive">Festivo</SelectItem>
                <SelectItem value="corporate">Corporativo</SelectItem>
                <SelectItem value="minimalist">Minimalista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="codigoEvento">Código del Evento</Label>
            <Input
              id="codigoEvento"
              type="text"
              value={evento.event_code}
              disabled
              className="mt-2 bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              El código no se puede modificar
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fechaInicio">Fecha y Hora de Inicio *</Label>
            <Input
              id="fechaInicio"
              type="datetime-local"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
            <Input
              id="fechaFin"
              type="datetime-local"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            type="text"
            placeholder="Lugar donde se realizará el evento"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            placeholder="Descripción del evento (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
