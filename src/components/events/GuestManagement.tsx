
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Invitado } from "@/hooks/useEditarEvento";
import { InvitationPreview } from "./InvitationPreview";
import { useState } from "react";

interface GuestManagementProps {
  invitados: Invitado[];
  setInvitados: (invitados: Invitado[]) => void;
  nombreEvento: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion: string;
  tipoEvento: string;
  codigoVestimenta: string;
}

export const GuestManagement = ({
  invitados,
  setInvitados,
  nombreEvento,
  descripcion,
  fechaInicio,
  fechaFin,
  ubicacion,
  tipoEvento,
  codigoVestimenta
}: GuestManagementProps) => {
  const { toast } = useToast();
  const [previewInvitado, setPreviewInvitado] = useState<Invitado | null>(null);

  const agregarInvitado = () => {
    setInvitados([...invitados, { name: "", email: "", phone: "" }]);
  };

  const eliminarInvitado = async (index: number) => {
    const invitado = invitados[index];
    
    if (invitado.id) {
      try {
        const { error } = await supabase
          .from('guests')
          .delete()
          .eq('id', invitado.id);

        if (error) throw error;

        toast({
          title: "Invitado eliminado",
          description: `Se eliminó a ${invitado.name}`,
        });
      } catch (error) {
        console.error('Error eliminando invitado:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el invitado",
          variant: "destructive",
        });
        return;
      }
    }

    setInvitados(invitados.filter((_, i) => i !== index));
  };

  const actualizarInvitado = (index: number, field: keyof Invitado, value: string) => {
    const nuevosInvitados = [...invitados];
    nuevosInvitados[index][field] = value;
    setInvitados(nuevosInvitados);
  };

  const mostrarPreview = (invitado: Invitado) => {
    setPreviewInvitado(invitado);
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Invitados ({invitados.filter(inv => inv.name.trim()).length})</span>
            </CardTitle>
            <Button onClick={agregarInvitado} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Invitado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invitados.map((invitado, index) => (
              <div key={invitado.id || index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-xs text-gray-600">Nombre</Label>
                  <Input
                    type="text"
                    placeholder="Nombre del invitado"
                    value={invitado.name}
                    onChange={(e) => actualizarInvitado(index, 'name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Email</Label>
                  <Input
                    type="email"
                    placeholder="Email (opcional)"
                    value={invitado.email}
                    onChange={(e) => actualizarInvitado(index, 'email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Teléfono</Label>
                  <Input
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    value={invitado.phone}
                    onChange={(e) => actualizarInvitado(index, 'phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  {invitado.invitation_code && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => mostrarPreview(invitado)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => eliminarInvitado(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <InvitationPreview
        invitado={previewInvitado}
        nombreEvento={nombreEvento}
        descripcion={descripcion}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        ubicacion={ubicacion}
        tipoEvento={tipoEvento}
        codigoVestimenta={codigoVestimenta}
        onClose={() => setPreviewInvitado(null)}
      />
    </>
  );
};
