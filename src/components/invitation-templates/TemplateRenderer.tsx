
import { ModernTemplate } from "./ModernTemplate";
import { ElegantTemplate } from "./ElegantTemplate";
import { FestiveTemplate } from "./FestiveTemplate";
import { CorporateTemplate } from "./CorporateTemplate";
import { MinimalistTemplate } from "./MinimalistTemplate";

interface TemplateRendererProps {
  templateId: string;
  invitado: {
    id?: string;
    name: string;
    invitation_code?: string;
    qr_code_data?: string;
    passes_count?: number;
    adults_count?: number;
    children_count?: number;
    pets_count?: number;
  };
  evento: {
    id?: string;
    name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    event_type?: string;
    dress_code?: string;
    image_url?: string;
  };
  showRSVP?: boolean;
  maxPasses?: number;
  defaultAdults?: number;
  defaultChildren?: number;
  defaultPets?: number;
}

export const TemplateRenderer = ({ 
  templateId, 
  invitado, 
  evento, 
  showRSVP = false,
  maxPasses = 1,
  defaultAdults = 1,
  defaultChildren = 0,
  defaultPets = 0
}: TemplateRendererProps) => {
  const templates = {
    modern: ModernTemplate,
    elegant: ElegantTemplate,
    festive: FestiveTemplate,
    corporate: CorporateTemplate,
    minimalist: MinimalistTemplate,
  };

  const TemplateComponent = templates[templateId as keyof typeof templates] || ModernTemplate;

  // Asegurar que la fecha esté en formato correcto para la cuenta regresiva
  const eventoConFechaCorrecta = {
    ...evento,
    start_date: evento.start_date || new Date().toISOString()
  };

  // Usar los valores del invitado si están disponibles, si no usar los valores por defecto
  const finalMaxPasses = invitado.passes_count || maxPasses;
  const finalDefaultAdults = invitado.adults_count || defaultAdults;
  const finalDefaultChildren = invitado.children_count || defaultChildren;
  const finalDefaultPets = invitado.pets_count || defaultPets;

  return (
    <TemplateComponent 
      invitado={invitado} 
      evento={eventoConFechaCorrecta} 
      showRSVP={showRSVP}
      maxPasses={finalMaxPasses}
      defaultAdults={finalDefaultAdults}
      defaultChildren={finalDefaultChildren}
      defaultPets={finalDefaultPets}
    />
  );
};
