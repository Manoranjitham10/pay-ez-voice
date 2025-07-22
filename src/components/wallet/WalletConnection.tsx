import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface WalletConnectionProps {
  onWalletConnected: (address: string, balance: string) => void;
  onWalletDisconnected: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  onWalletConnected,
  onWalletDisconnected
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();
          
          setIsConnected(true);
          setAddress(address);
          setBalance(ethers.formatEther(balance));
          setNetwork(network.name);
          onWalletConnected(address, ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this wallet",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setIsConnected(true);
      setAddress(address);
      setBalance(ethers.formatEther(balance));
      setNetwork(network.name);
      
      onWalletConnected(address, ethers.formatEther(balance));
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkWalletConnection();
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        checkWalletConnection();
      });

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
    setNetwork(null);
    onWalletDisconnected();
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openInExplorer = () => {
    if (address && network) {
      let explorerUrl = '';
      switch (network) {
        case 'mainnet':
          explorerUrl = `https://etherscan.io/address/${address}`;
          break;
        case 'polygon':
          explorerUrl = `https://polygonscan.com/address/${address}`;
          break;
        case 'maticmum': // Polygon Mumbai testnet
          explorerUrl = `https://mumbai.polygonscan.com/address/${address}`;
          break;
        default:
          explorerUrl = `https://etherscan.io/address/${address}`;
      }
      window.open(explorerUrl, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Connect MetaMask to start using PayEZ voice commands
            </p>
          </div>

          <Button 
            onClick={connectWallet}
            disabled={isConnecting}
            size="lg"
            className="w-full"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground">
            <p>Make sure you have MetaMask installed and unlocked</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-success-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Wallet Connected</h3>
              <p className="text-sm text-muted-foreground">
                {formatAddress(address!)}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={openInExplorer}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Network:</span>
            <Badge variant="secondary" className="capitalize">
              {network || 'Unknown'}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ETH Balance:</span>
            <span className="font-mono text-sm">
              {parseFloat(balance).toFixed(4)} ETH
            </span>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="w-full"
          >
            Disconnect Wallet
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Voice commands are now available</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}