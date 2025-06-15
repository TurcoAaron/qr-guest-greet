
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EventTabs from '@/components/dashboard/EventTabs';

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
  const { user } = useAuth();
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

  const upcomingEvents = events?.filter(event => event.status === 'upcoming') || [];
  const activeEvents = events?.filter(event => event.status === 'active') || [];
  const completedEvents = events?.filter(event => event.status === 'completed') || [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <EventTabs
          activeEvents={activeEvents}
          upcomingEvents={upcomingEvents}
          completedEvents={completedEvents}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Dashboard;
