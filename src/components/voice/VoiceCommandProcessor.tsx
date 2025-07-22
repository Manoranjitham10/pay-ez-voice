import React from 'react';
import { toast } from 'sonner';

export interface VoiceCommand {
  type: 'balance' | 'send' | 'history' | 'unknown';
  params?: {
    amount?: string;
    recipient?: string;
    token?: string;
  };
  originalText: string;
}

export class VoiceCommandProcessor {
  static processCommand(text: string): VoiceCommand {
    const normalizedText = text.toLowerCase().trim();
    
    // Balance check patterns
    const balancePatterns = [
      /(?:check|show|what['\s]?s|tell me)\s*(?:my\s*)?balance/i,
      /(?:how much|what['\s]?s my|show my)\s*(?:money|funds|balance)/i,
      /balance/i
    ];

    // Send money patterns
    const sendPatterns = [
      /send\s+(\d+(?:\.\d+)?)\s*(?:usdc|dollars?|usd)?\s*to\s*(.+)/i,
      /transfer\s+(\d+(?:\.\d+)?)\s*(?:usdc|dollars?|usd)?\s*to\s*(.+)/i,
      /pay\s+(.+?)\s+(\d+(?:\.\d+)?)\s*(?:usdc|dollars?|usd)?/i
    ];

    // History patterns
    const historyPatterns = [
      /(?:show|display|get|check)\s*(?:my\s*)?(?:transaction\s*)?history/i,
      /(?:recent|last)\s*transactions?/i,
      /transaction\s*history/i,
      /history/i
    ];

    // Check balance commands
    for (const pattern of balancePatterns) {
      if (pattern.test(normalizedText)) {
        return {
          type: 'balance',
          originalText: text
        };
      }
    }

    // Check send commands
    for (const pattern of sendPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        let amount, recipient;
        
        if (pattern.source.includes('pay')) {
          // "pay [recipient] [amount]" format
          recipient = match[1]?.trim();
          amount = match[2]?.trim();
        } else {
          // "send [amount] to [recipient]" format
          amount = match[1]?.trim();
          recipient = match[2]?.trim();
        }

        return {
          type: 'send',
          params: {
            amount,
            recipient,
            token: 'USDC'
          },
          originalText: text
        };
      }
    }

    // Check history commands
    for (const pattern of historyPatterns) {
      if (pattern.test(normalizedText)) {
        return {
          type: 'history',
          originalText: text
        };
      }
    }

    // Unknown command
    return {
      type: 'unknown',
      originalText: text
    };
  }

  static executeCommand(command: VoiceCommand, callbacks: {
    onBalance: () => void;
    onSend: (amount: string, recipient: string) => void;
    onHistory: () => void;
  }) {
    switch (command.type) {
      case 'balance':
        callbacks.onBalance();
        this.speakResponse("Checking your balance now");
        break;

      case 'send':
        if (command.params?.amount && command.params?.recipient) {
          callbacks.onSend(command.params.amount, command.params.recipient);
          this.speakResponse(`Preparing to send ${command.params.amount} USDC to ${command.params.recipient}`);
        } else {
          this.speakResponse("Sorry, I couldn't understand the amount or recipient. Please try again.");
          toast.error("Please specify both amount and recipient clearly");
        }
        break;

      case 'history':
        callbacks.onHistory();
        this.speakResponse("Loading your transaction history");
        break;

      case 'unknown':
        this.speakResponse("Sorry, I didn't understand that command. Try saying 'check balance', 'send money', or 'show history'");
        toast.error(`Unknown command: "${command.originalText}"`);
        break;
    }
  }

  static speakResponse(text: string) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      
      speechSynthesis.speak(utterance);
    }
  }

  static getCommandSuggestions(): string[] {
    return [
      "Check my balance",
      "Send 10 USDC to John",
      "Show transaction history",
      "What's my balance?",
      "Transfer 25 dollars to 0x123...",
      "Pay Alice 50 USDC",
      "Show recent transactions"
    ];
  }

  static isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  static formatAmount(amount: string): string {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    return num.toFixed(2);
  }
}