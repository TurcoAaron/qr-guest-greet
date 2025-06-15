
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TemplateRenderer } from "../invitation-templates/TemplateRenderer";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateName: string;
  eventData: {
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

export const TemplatePreviewModal = ({
  isOpen,
  onClose,
  templateId,
  templateName,
  eventData
}: TemplatePreviewModalProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Preview: {templateName}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="border rounded-lg overflow-hidden bg-gray-50 w-full">
          <div className="flex justify-center p-4">
            <div className="w-full max-w-2xl">
              <TemplateRenderer
                templateId={templateId}
                invitado={mockGuest}
                evento={mockEvent}
                showRSVP={false}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
