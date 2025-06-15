
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { TemplateRenderer } from "./TemplateRenderer";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  eventData?: {
    name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    event_type?: string;
    dress_code?: string;
  };
}

const templates = [
  { id: 'modern', name: 'Moderno', description: 'Diseño limpio y contemporáneo' },
  { id: 'elegant', name: 'Elegante', description: 'Sofisticado y clásico' },
  { id: 'festive', name: 'Festivo', description: 'Colorido y celebrativo' },
  { id: 'corporate', name: 'Corporativo', description: 'Profesional y ejecutivo' },
  { id: 'minimalist', name: 'Minimalista', description: 'Simple y funcional' }
];

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect, eventData }: TemplateSelectorProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const mockGuest = {
    name: "Juan Pérez",
    invitation_code: "PREVIEW-001",
    qr_code_data: JSON.stringify({
      event_id: "preview",
      event_name: eventData?.name || "Mi Evento",
      guest_name: "Juan Pérez",
      invitation_code: "PREVIEW-001"
    })
  };

  const mockEvent = {
    name: eventData?.name || "Mi Evento Especial",
    description: eventData?.description || "Una celebración inolvidable",
    start_date: eventData?.start_date || new Date().toISOString(),
    end_date: eventData?.end_date || "",
    location: eventData?.location || "Salón de Eventos",
    event_type: eventData?.event_type || "social",
    dress_code: eventData?.dress_code || "formal"
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Selecciona un Template</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-purple-500 bg-purple-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardContent className="p-4">
              {/* Miniatura del template */}
              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                <div className="scale-[0.15] origin-top-left w-[400px] h-[600px] absolute -top-2 -left-2">
                  <TemplateRenderer
                    templateId={template.id}
                    invitado={mockGuest}
                    evento={mockEvent}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template.id);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Preview: {templates.find(t => t.id === previewTemplate)?.name}
              </h3>
              <Button
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
              >
                Cerrar
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <TemplateRenderer
                templateId={previewTemplate}
                invitado={mockGuest}
                evento={mockEvent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
