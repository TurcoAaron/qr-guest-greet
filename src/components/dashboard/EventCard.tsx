
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Edit, Clock, Hash } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  start_date: string;
  end_date: string;
  location: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  event_type: string;
  dress_code: string;
  created_at: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { label: 'Próximo', variant: 'secondary' as const },
      active: { label: 'Activo', variant: 'default' as const },
      completed: { label: 'Completado', variant: 'outline' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatearTipoEvento = (tipo: string) => {
    if (!tipo) return '';
    const tipos = {
      conference: "Conferencia",
      wedding: "Boda", 
      birthday: "Cumpleaños",
      corporate: "Corporativo",
      social: "Social",
      workshop: "Taller",
      seminar: "Seminario",
      other: "Otro"
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <CardDescription className="mt-1">{event.description}</CardDescription>
            <div className="flex items-center space-x-2 mt-2">
              {event.event_type && (
                <Badge variant="outline">
                  {formatearTipoEvento(event.event_type)}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(event.status)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/editar-evento/${event.id}`)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4" />
            <span className="font-mono text-xs">{event.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.start_date || event.date).toLocaleDateString('es-ES', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(event.start_date || event.date).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
              {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
          {event.dress_code && (
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 text-center">👔</span>
              <span>Vestimenta: {event.dress_code}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
