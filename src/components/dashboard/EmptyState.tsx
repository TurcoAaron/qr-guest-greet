
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar } from 'lucide-react';

interface EmptyStateProps {
  type: 'active' | 'upcoming' | 'completed';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const navigate = useNavigate();

  const getEmptyStateConfig = () => {
    switch (type) {
      case 'active':
        return {
          icon: Users,
          message: 'No tienes eventos activos',
          showButton: true
        };
      case 'upcoming':
        return {
          icon: Calendar,
          message: 'No tienes eventos próximos',
          showButton: false
        };
      case 'completed':
        return {
          icon: Users,
          message: 'No tienes eventos completados',
          showButton: false
        };
    }
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <Card>
      <CardContent className="text-center py-8">
        <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{config.message}</p>
        {config.showButton && (
          <Button onClick={() => navigate('/crear-evento')} className="mt-4">
            Crear primer evento
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
