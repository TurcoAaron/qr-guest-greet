
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export const CountdownTimer = ({ targetDate, className = "" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isEventStarted = +new Date(targetDate) <= +new Date();

  if (isEventStarted) {
    return (
      <div className={`bg-green-50 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <Clock className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-xl font-semibold text-green-800">¡El evento ha comenzado!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-800">Tiempo restante</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
            <div className="text-sm text-gray-600">Días</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{timeLeft.hours}</div>
            <div className="text-sm text-gray-600">Horas</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-600">Minutos</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-600">Segundos</div>
          </div>
        </div>
      </div>
    </div>
  );
};
