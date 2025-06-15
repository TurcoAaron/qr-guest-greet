
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { TemplateRenderer } from "./TemplateRenderer";
import { TemplatePreviewModal } from "../events/TemplatePreviewModal";

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
    image_url?: string;
  };
}

const templates = [
  { 
    id: 'modern', 
    name: 'Moderno', 
    description: 'Diseño limpio y contemporáneo',
    categories: ['wedding', 'corporate', 'social', 'conference']
  },
  { 
    id: 'elegant', 
    name: 'Elegante', 
    description: 'Sofisticado y clásico',
    categories: ['wedding', 'corporate', 'social']
  },
  { 
    id: 'festive', 
    name: 'Festivo', 
    description: 'Colorido y celebrativo',
    categories: ['birthday', 'social', 'workshop']
  },
  { 
    id: 'corporate', 
    name: 'Corporativo', 
    description: 'Profesional y ejecutivo',
    categories: ['corporate', 'conference', 'seminar']
  },
  { 
    id: 'minimalist', 
    name: 'Minimalista', 
    description: 'Simple y funcional',
    categories: ['wedding', 'corporate', 'social', 'conference', 'workshop', 'seminar']
  }
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
    dress_code: eventData?.dress_code || "formal",
    image_url: eventData?.image_url
  };

  // Filtrar templates por tipo de evento
  const filteredTemplates = eventData?.event_type 
    ? templates.filter(template => template.categories.includes(eventData.event_type))
    : templates;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Selecciona un Template</Label>
      
      {eventData?.event_type && (
        <p className="text-sm text-gray-600">
          Mostrando templates recomendados para: <span className="font-medium capitalize">{eventData.event_type}</span>
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
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
              {/* Miniatura del template con ancho completo */}
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                <div className="scale-[0.25] origin-top-left w-[400px] h-[600px] absolute -top-4 -left-4">
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
      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        templateId={previewTemplate || 'modern'}
        templateName={templates.find(t => t.id === previewTemplate)?.name || ''}
        eventData={eventData || {
          name: "Mi Evento Especial",
          start_date: new Date().toISOString()
        }}
      />
    </div>
  );
};
