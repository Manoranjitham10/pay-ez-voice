import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, RefreshCw, TrendingUp, Volume2 } from 'lucide-react';
import { ethers } from 'ethers';
import { cn } from '@/lib/utils';

interface BalanceDisplayProps {
  address: string | null;
  balance: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  address,
  balance,
  onRefresh,
  isRefreshing = false
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [isLoadingUsdc, setIsLoadingUsdc] = useState(false);

  // Mock USDC balance for demo - in production, fetch from USDC contract
  useEffect(() => {
    if (address) {
      fetchUsdcBalance();
    }
  }, [address]);

  const fetchUsdcBalance = async () => {
    setIsLoadingUsdc(true);
    try {
      // Mock USDC balance - replace with actual contract call
      const mockBalance = (Math.random() * 1000).toFixed(2);
      setUsdcBalance(mockBalance);
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      setUsdcBalance('0');
    } finally {
      setIsLoadingUsdc(false);
    }
  };

  const speakBalance = () => {
    if ('speechSynthesis' in window) {
      const text = `Your current balance is ${parseFloat(balance).toFixed(4)} ETH and ${usdcBalance} USDC`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const formatBalance = (bal: string, decimals: number = 4) => {
    return parseFloat(bal).toFixed(decimals);
  };

  const getBalanceColor = (bal: string) => {
    const value = parseFloat(bal);
    if (value > 1) return 'text-success';
    if (value > 0.1) return 'text-warning';
    return 'text-error';
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Balance</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={speakBalance}
            title="Speak balance aloud"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            title={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh balance"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* ETH Balance */}
        <div className="bg-gradient-primary p-4 rounded-lg text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ethereum (ETH)</p>
              <p className={cn(
                "text-2xl font-bold font-mono",
                !showBalance && "filter blur-sm"
              )}>
                {showBalance ? formatBalance(balance) : "••••"}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Native
              </Badge>
            </div>
          </div>
        </div>

        {/* USDC Balance */}
        <div className="bg-gradient-accent p-4 rounded-lg text-accent-foreground shadow-yellow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">USD Coin (USDC)</p>
              <p className={cn(
                "text-2xl font-bold font-mono",
                !showBalance && "filter blur-sm"
              )}>
                {showBalance ? (
                  isLoadingUsdc ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    `$${formatBalance(usdcBalance, 2)}`
                  )
                ) : "••••"}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-black/20 text-black">
                Stablecoin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1 text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Stable Value</span>
            </div>
            <p className="text-xs text-muted-foreground">USDC tracks USD 1:1</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 text-primary">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">Voice Ready</span>
            </div>
            <p className="text-xs text-muted-foreground">Say "Check balance"</p>
          </div>
        </div>
      </div>

      {/* Voice Instructions */}
      <div className="bg-accent/50 p-3 rounded-lg">
        <p className="text-xs text-center text-muted-foreground">
          💡 Say "Check my balance" to hear your current amounts
        </p>
      </div>
    </Card>
  );
};