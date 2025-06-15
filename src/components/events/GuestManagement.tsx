
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
  templateId: string;
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
  codigoVestimenta,
  templateId
}: GuestManagementProps) => {
  const { toast } = useToast();
  const [previewInvitado, setPreviewInvitado] = useState<Invitado | null>(null);

  const agregarInvitado = () => {
    setInvitados([...invitados, { 
      name: "", 
      email: "", 
      phone: "",
      passes_count: 1,
      adults_count: 1,
      children_count: 0,
      pets_count: 0
    }]);
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

  const actualizarInvitado = (index: number, field: keyof Invitado, value: string | number) => {
    const nuevosInvitados = [...invitados];
    
    if (field === 'name' || field === 'email' || field === 'phone') {
      nuevosInvitados[index][field] = value as string;
    } else if (field === 'passes_count' || field === 'adults_count' || field === 'children_count' || field === 'pets_count') {
      nuevosInvitados[index][field] = value as number;
    }
    
    // Si se actualiza adults_count, children_count o pets_count, actualizar passes_count automáticamente
    if (field === 'adults_count' || field === 'children_count' || field === 'pets_count') {
      const adults = field === 'adults_count' ? Number(value) : nuevosInvitados[index].adults_count;
      const children = field === 'children_count' ? Number(value) : nuevosInvitados[index].children_count;
      const pets = field === 'pets_count' ? Number(value) : (nuevosInvitados[index].pets_count || 0);
      nuevosInvitados[index].passes_count = adults + children + pets;
    }
    
    setInvitados(nuevosInvitados);
  };

  const mostrarPreview = (invitado: Invitado) => {
    setPreviewInvitado(invitado);
  };

  const totalPases = invitados.reduce((total, inv) => total + (inv.passes_count || 1), 0);
  const totalAdultos = invitados.reduce((total, inv) => total + (inv.adults_count || 1), 0);
  const totalNiños = invitados.reduce((total, inv) => total + (inv.children_count || 0), 0);
  const totalMascotas = invitados.reduce((total, inv) => total + (inv.pets_count || 0), 0);

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
          <div className="text-sm text-gray-600 grid grid-cols-4 gap-4">
            <div>Total de pases: <span className="font-semibold">{totalPases}</span></div>
            <div>Total adultos: <span className="font-semibold">{totalAdultos}</span></div>
            <div>Total niños: <span className="font-semibold">{totalNiños}</span></div>
            <div>Total mascotas: <span className="font-semibold">{totalMascotas}</span></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invitados.map((invitado, index) => (
              <div key={invitado.id || index} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 bg-gray-50 rounded-lg">
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
                <div>
                  <Label className="text-xs text-gray-600">Adultos</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={invitado.adults_count}
                    onChange={(e) => actualizarInvitado(index, 'adults_count', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Niños</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={invitado.children_count}
                    onChange={(e) => actualizarInvitado(index, 'children_count', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Mascotas</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    value={invitado.pets_count || 0}
                    onChange={(e) => actualizarInvitado(index, 'pets_count', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Total Pases</Label>
                  <Input
                    type="number"
                    value={invitado.passes_count}
                    readOnly
                    className="mt-1 bg-gray-100"
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
        templateId={templateId}
        onClose={() => setPreviewInvitado(null)}
      />
    </>
  );
};
