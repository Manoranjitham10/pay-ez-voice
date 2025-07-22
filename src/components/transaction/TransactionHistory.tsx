import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Volume2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  token: string;
  address: string;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
  hash?: string;
}

interface TransactionHistoryProps {
  address: string | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  address,
  onRefresh,
  isRefreshing = false
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock transaction data for demo
  useEffect(() => {
    if (address) {
      loadTransactions();
    }
  }, [address]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Mock transactions - in production, fetch from blockchain
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'receive',
          amount: '100.00',
          token: 'USDC',
          address: '0x742d35Cc6Ee9Ca2b6e3aC8E7d8ab9e',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          status: 'confirmed',
          hash: '0xabc123...'
        },
        {
          id: '2',
          type: 'send',
          amount: '25.50',
          token: 'USDC',
          address: '0x123abc45de67f89012345678901234',
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          status: 'confirmed',
          hash: '0xdef456...'
        },
        {
          id: '3',
          type: 'send',
          amount: '50.00',
          token: 'USDC',
          address: '0x987fde21cb54a98765432109876543',
          timestamp: new Date(Date.now() - 259200000), // 3 days ago
          status: 'pending',
          hash: '0xghi789...'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakTransactions = () => {
    if ('speechSynthesis' in window && transactions.length > 0) {
      const recentTxs = transactions.slice(0, 3);
      const text = `You have ${transactions.length} transactions. Recent transactions: ${recentTxs
        .map(tx => `${tx.type} ${tx.amount} ${tx.token} ${tx.type === 'send' ? 'to' : 'from'} ${tx.address.slice(0, 8)}`)
        .join(', ')}`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'failed':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!address) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Connect your wallet to view transaction history</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={speakTransactions}
            title="Speak transactions aloud"
            disabled={transactions.length === 0}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing || isLoading}
            title="Refresh transactions"
          >
            <RefreshCw className={cn("w-4 h-4", (isRefreshing || isLoading) && "animate-spin")} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg p-4 h-16" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No transactions found</p>
          <p className="text-sm">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  tx.type === 'send' ? "bg-error/10 text-error" : "bg-success/10 text-success"
                )}>
                  {tx.type === 'send' ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium capitalize">{tx.type}</span>
                    <Badge variant="outline" className={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tx.type === 'send' ? 'To' : 'From'}: {formatAddress(tx.address)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={cn(
                  "font-mono font-medium",
                  tx.type === 'send' ? "text-error" : "text-success"
                )}>
                  {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(tx.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-accent/50 p-3 rounded-lg">
        <p className="text-xs text-center text-muted-foreground">
          💡 Say "Show transaction history" to hear your recent transactions
        </p>
      </div>
    </Card>
  );
};