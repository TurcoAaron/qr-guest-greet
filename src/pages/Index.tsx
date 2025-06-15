import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Search, Calendar, Users, CheckCircle, Camera } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import AsistenciaCard from "@/components/home/AsistenciaCard";
import InvitacionCard from "@/components/home/InvitacionCard";
import QrScannerCard from "@/components/home/QrScannerCard";
import FeaturesSection from "@/components/home/FeaturesSection";

const Index = () => {
  // Solo renderización, sin lógica aquí

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            EventManager
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Sistema completo de gestión de eventos y asistencias
          </p>
          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AsistenciaCard />
            <InvitacionCard />
          </div>
          {/* QR Scanner Section */}
          <div className="mt-12">
            <QrScannerCard />
          </div>
        </div>
      </div>
      <FeaturesSection />
    </div>
  );
};

export default Index;
