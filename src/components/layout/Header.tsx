import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Shield, Smartphone } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <Card className="p-6 bg-gradient-primary text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PayEZ</h1>
              <p className="text-sm opacity-90">Voice-Enabled Crypto Wallet</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Smartphone className="w-3 h-3 mr-1" />
            PWA Ready
          </Badge>
        </div>
      </div>
    </Card>
  );
};