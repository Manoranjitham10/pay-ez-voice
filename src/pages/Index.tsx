import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { WalletConnection } from '@/components/wallet/WalletConnection';
import { BalanceDisplay } from '@/components/wallet/BalanceDisplay';
import { TransactionHistory } from '@/components/transaction/TransactionHistory';
import { VoiceCommandProcessor, VoiceCommand } from '@/components/voice/VoiceCommandProcessor';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState('0');
  const [isListening, setIsListening] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast: showToast } = useToast();

  const handleWalletConnected = useCallback((address: string, balance: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
    setWalletBalance(balance);
    toast.success('Wallet connected successfully!');
  }, []);

  const handleWalletDisconnected = useCallback(() => {
    setIsWalletConnected(false);
    setWalletAddress(null);
    setWalletBalance('0');
  }, []);

  const handleRefreshBalance = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Mock refresh - in production, refetch from blockchain
      setTimeout(() => {
        setIsRefreshing(false);
        toast.success('Balance refreshed');
      }, 1000);
    } catch (error) {
      setIsRefreshing(false);
      toast.error('Failed to refresh balance');
    }
  }, []);

  const handleVoiceCommand = useCallback((commandText: string) => {
    const command: VoiceCommand = VoiceCommandProcessor.processCommand(commandText);
    
    VoiceCommandProcessor.executeCommand(command, {
      onBalance: () => {
        handleRefreshBalance();
        showToast({
          title: "Balance Check",
          description: "Your current balance is being displayed",
        });
      },
      onSend: (amount: string, recipient: string) => {
        showToast({
          title: "Send Transaction",
          description: `Preparing to send ${amount} USDC to ${recipient}`,
        });
        // In production, open send transaction modal
        toast.info(`Send feature coming soon: ${amount} USDC to ${recipient}`);
      },
      onHistory: () => {
        showToast({
          title: "Transaction History",
          description: "Loading your recent transactions",
        });
        // Scroll to history section or refresh history
      }
    });
  }, [handleRefreshBalance, showToast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        <Header />
        
        {!isWalletConnected ? (
          <WalletConnection
            onWalletConnected={handleWalletConnected}
            onWalletDisconnected={handleWalletDisconnected}
          />
        ) : (
          <>
            <BalanceDisplay
              address={walletAddress}
              balance={walletBalance}
              onRefresh={handleRefreshBalance}
              isRefreshing={isRefreshing}
            />
            
            <VoiceInput
              onCommand={handleVoiceCommand}
              isListening={isListening}
              onStartListening={() => setIsListening(true)}
              onStopListening={() => setIsListening(false)}
              disabled={!isWalletConnected}
            />
            
            <TransactionHistory
              address={walletAddress}
              onRefresh={handleRefreshBalance}
              isRefreshing={isRefreshing}
            />
          </>
        )}
        
        <div className="text-center text-xs text-muted-foreground">
          <p>PayEZ - Voice-Enabled Crypto Wallet for Everyone</p>
          <p>Secure • Accessible • Easy to Use</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
