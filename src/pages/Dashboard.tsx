import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Plus, Calendar, Users, MapPin, Edit, Clock } from 'lucide-react';
import { toast } from 'sonner';

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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const upcomingEvents = events?.filter(event => event.status === 'upcoming') || [];
  const activeEvents = events?.filter(event => event.status === 'active') || [];
  const completedEvents = events?.filter(event => event.status === 'completed') || [];

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

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <CardDescription className="mt-1">{event.description}</CardDescription>
            {event.event_type && (
              <Badge variant="outline" className="mt-2">
                {formatearTipoEvento(event.event_type)}
              </Badge>
            )}
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bienvenido, {user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/crear-evento')} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Crear Evento</span>
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Eventos Activos ({activeEvents.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="completed">Historial ({completedEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Cargando eventos...</div>
            ) : activeEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes eventos activos</p>
                  <Button onClick={() => navigate('/crear-evento')} className="mt-4">
                    Crear primer evento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes eventos próximos</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes eventos completados</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
