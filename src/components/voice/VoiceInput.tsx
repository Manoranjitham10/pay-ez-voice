import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onCommand: (command: string) => void;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onCommand,
  isListening = false,
  onStartListening,
  onStopListening,
  disabled = false
}) => {
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setError(null);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          setIsProcessing(true);
          onCommand(finalTranscript.trim());
          setTimeout(() => {
            setIsProcessing(false);
            setTranscript('');
          }, 1000);
        }
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsProcessing(false);
        onStopListening?.();
      };

      recognition.onend = () => {
        setIsProcessing(false);
        onStopListening?.();
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onCommand, onStopListening]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      onStopListening?.();
    } else {
      recognitionRef.current.start();
      onStartListening?.();
    }
  }, [isListening, onStartListening, onStopListening]);

  const getVoiceState = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    if (error) return 'error';
    return 'idle';
  };

  const voiceState = getVoiceState();

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Voice Commands</h3>
        <p className="text-sm text-muted-foreground">
          Say "Check balance", "Send USDC", or "Show history"
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={toggleListening}
          disabled={disabled || !!error}
          size="lg"
          className={cn(
            "w-20 h-20 rounded-full transition-all duration-300",
            voiceState === 'listening' && "bg-voice-listening animate-pulse shadow-glow",
            voiceState === 'processing' && "bg-voice-processing animate-bounce",
            voiceState === 'error' && "bg-voice-error",
            voiceState === 'idle' && "bg-primary hover:bg-primary-hover"
          )}
        >
          {isListening ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>

        <div className="min-h-[2.5rem] flex items-center justify-center">
          {transcript && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">You said:</p>
              <p className="font-medium">{transcript}</p>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-center space-x-2 text-voice-processing">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Processing command...</span>
            </div>
          )}
          
          {error && (
            <div className="text-center text-voice-error">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Status: {voiceState.charAt(0).toUpperCase() + voiceState.slice(1)}</p>
        <p>Tap the microphone to start voice commands</p>
      </div>
    </Card>
  );
};

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}