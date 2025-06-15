
import { ModernTemplate } from "./ModernTemplate";
import { ElegantTemplate } from "./ElegantTemplate";
import { FestiveTemplate } from "./FestiveTemplate";
import { CorporateTemplate } from "./CorporateTemplate";
import { MinimalistTemplate } from "./MinimalistTemplate";

interface TemplateRendererProps {
  templateId: string;
  invitado: {
    name: string;
    invitation_code?: string;
    qr_code_data?: string;
  };
  evento: {
    name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    event_type?: string;
    dress_code?: string;
  };
}

export const TemplateRenderer = ({ templateId, invitado, evento }: TemplateRendererProps) => {
  const templates = {
    modern: ModernTemplate,
    elegant: ElegantTemplate,
    festive: FestiveTemplate,
    corporate: CorporateTemplate,
    minimalist: MinimalistTemplate,
  };

  const TemplateComponent = templates[templateId as keyof typeof templates] || ModernTemplate;

  return <TemplateComponent invitado={invitado} evento={evento} />;
};
