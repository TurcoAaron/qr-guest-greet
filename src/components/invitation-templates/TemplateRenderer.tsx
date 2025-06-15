
import { Suspense, lazy, ErrorBoundary } from "react";

// Importaciones estáticas para evitar problemas en build
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

// Componente de fallback para errores
const TemplateErrorFallback = ({ templateId, invitado, evento }: { templateId: string; invitado: any; evento: any }) => {
  console.error(`Error loading template: ${templateId}`);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error de Template</h2>
        <p className="text-gray-600 mb-4">
          No se pudo cargar la template "{templateId}". Usando template por defecto.
        </p>
        <ModernTemplate 
          invitado={invitado} 
          evento={evento} 
          showRSVP={false}
        />
      </div>
    </div>
  );
};

// Componente de carga
const TemplateLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 text-lg">Cargando template...</p>
    </div>
  </div>
);

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
  // Mapeo estático de templates para evitar problemas de build
  const templates = {
    modern: ModernTemplate,
    elegant: ElegantTemplate,
    festive: FestiveTemplate,
    corporate: CorporateTemplate,
    minimalist: MinimalistTemplate,
  };

  // Validar templateId y usar fallback si es necesario
  const validTemplateId = templateId && templates[templateId as keyof typeof templates] ? templateId : 'modern';
  const TemplateComponent = templates[validTemplateId as keyof typeof templates];

  console.log(`Rendering template: ${validTemplateId} for event: ${evento.name}`);

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
    <ErrorBoundary
      fallback={
        <TemplateErrorFallback 
          templateId={validTemplateId} 
          invitado={invitado} 
          evento={eventoConFechaCorrecta} 
        />
      }
    >
      <Suspense fallback={<TemplateLoadingFallback />}>
        <TemplateComponent 
          invitado={invitado} 
          evento={eventoConFechaCorrecta} 
          showRSVP={showRSVP}
          maxPasses={finalMaxPasses}
          defaultAdults={finalDefaultAdults}
          defaultChildren={finalDefaultChildren}
          defaultPets={finalDefaultPets}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
