
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
}

export const TemplateRenderer = ({ 
  templateId, 
  invitado, 
  evento, 
  showRSVP = false,
  maxPasses,
  defaultAdults,
  defaultChildren
}: TemplateRendererProps) => {
  const templates = {
    modern: ModernTemplate,
    elegant: ElegantTemplate,
    festive: FestiveTemplate,
    corporate: CorporateTemplate,
    minimalist: MinimalistTemplate,
  };

  const TemplateComponent = templates[templateId as keyof typeof templates] || ModernTemplate;

  return (
    <TemplateComponent 
      invitado={invitado} 
      evento={evento} 
      showRSVP={showRSVP}
      maxPasses={maxPasses}
      defaultAdults={defaultAdults}
      defaultChildren={defaultChildren}
    />
  );
};
