
# Templates de Invitación - Guía de Personalización

## Estructura de Templates

Los templates de invitación están ubicados en `src/components/invitation-templates/` y siguen una estructura consistente:

### Archivos principales:
- `ModernTemplate.tsx` - Template moderno
- `ElegantTemplate.tsx` - Template elegante  
- `FestiveTemplate.tsx` - Template festivo
- `CorporateTemplate.tsx` - Template corporativo
- `MinimalistTemplate.tsx` - Template minimalista
- `TemplateRenderer.tsx` - Renderizador de templates
- `TemplateSelector.tsx` - Selector de templates con preview

## Cómo crear un nuevo template

### 1. Crear el archivo del template
Crea un nuevo archivo `src/components/invitation-templates/MiTemplate.tsx`:

```tsx
import { Calendar, Clock, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RSVPSection } from "./RSVPSection";

interface TemplateProps {
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
}

export const MiTemplate = ({ invitado, evento, showRSVP = false }: TemplateProps) => {
  // Tu diseño personalizado aquí
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Contenido de tu template */}
      
      {/* Sección RSVP (obligatoria si showRSVP es true) */}
      {showRSVP && invitado.id && evento.id && (
        <RSVPSection 
          guestId={invitado.id} 
          eventId={evento.id}
          guestName={invitado.name}
        />
      )}
      
      {/* Código QR (recomendado) */}
      {invitado.qr_code_data && (
        <div className="text-center">
          <QRCodeSVG
            value={invitado.qr_code_data}
            size={150}
            level="M"
            includeMargin={true}
          />
        </div>
      )}
    </div>
  );
};
```

### 2. Registrar el template en TemplateRenderer
Edita `src/components/invitation-templates/TemplateRenderer.tsx`:

```tsx
import { MiTemplate } from "./MiTemplate";

const templates = {
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  festive: FestiveTemplate,
  corporate: CorporateTemplate,
  minimalist: MinimalistTemplate,
  miTemplate: MiTemplate, // Agregar aquí
};
```

### 3. Agregar al selector de templates
Edita `src/components/invitation-templates/TemplateSelector.tsx`:

```tsx
const templates = [
  { id: 'modern', name: 'Moderno', description: 'Diseño limpio y contemporáneo' },
  { id: 'elegant', name: 'Elegante', description: 'Sofisticado y clásico' },
  { id: 'festive', name: 'Festivo', description: 'Colorido y celebrativo' },
  { id: 'corporate', name: 'Corporativo', description: 'Profesional y ejecutivo' },
  { id: 'minimalist', name: 'Minimalista', description: 'Simple y funcional' },
  { id: 'miTemplate', name: 'Mi Template', description: 'Mi diseño personalizado' }, // Agregar aquí
];
```

## Elementos importantes para incluir

### 1. Sección RSVP (Obligatoria)
```tsx
{showRSVP && invitado.id && evento.id && (
  <RSVPSection 
    guestId={invitado.id} 
    eventId={evento.id}
    guestName={invitado.name}
  />
)}
```

### 2. Código QR (Recomendado)
```tsx
{invitado.qr_code_data && (
  <QRCodeSVG
    value={invitado.qr_code_data}
    size={150}
    level="M"
    includeMargin={true}
  />
)}
```

### 3. Soporte para imágenes
```tsx
{evento.image_url && (
  <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${evento.image_url})`}}>
    {/* Contenido superpuesto */}
  </div>
)}
```

## Clases de Tailwind recomendadas

- **Gradientes**: `bg-gradient-to-br from-blue-50 to-indigo-100`
- **Sombras**: `shadow-2xl`, `shadow-lg`
- **Bordes redondeados**: `rounded-3xl`, `rounded-lg`
- **Espaciado**: `space-y-6`, `p-6`, `mb-8`
- **Tipografía**: `text-3xl font-bold`, `text-lg font-semibold`

## Consideraciones de diseño

1. **Responsive**: Usa clases como `grid-cols-1 md:grid-cols-2`
2. **Accesibilidad**: Incluye textos alternativos y contraste adecuado
3. **Consistencia**: Mantén la estructura de datos consistente
4. **Performance**: Optimiza imágenes y evita elementos pesados

## Ejemplo de template personalizado completo

Ver `ModernTemplate.tsx` como referencia de implementación completa con todas las características.
