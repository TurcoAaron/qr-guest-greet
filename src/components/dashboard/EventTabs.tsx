
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventCard from './EventCard';
import EmptyState from './EmptyState';

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

interface EventTabsProps {
  activeEvents: Event[];
  upcomingEvents: Event[];
  completedEvents: Event[];
  isLoading: boolean;
}

const EventTabs: React.FC<EventTabsProps> = ({
  activeEvents,
  upcomingEvents,
  completedEvents,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">Cargando eventos...</div>
    );
  }

  return (
    <Tabs defaultValue="active" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Eventos Activos ({activeEvents.length})</TabsTrigger>
        <TabsTrigger value="upcoming">Próximos ({upcomingEvents.length})</TabsTrigger>
        <TabsTrigger value="completed">Historial ({completedEvents.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4">
        {activeEvents.length === 0 ? (
          <EmptyState type="active" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingEvents.length === 0 ? (
          <EmptyState type="upcoming" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {completedEvents.length === 0 ? (
          <EmptyState type="completed" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default EventTabs;
