'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceSearchProps {
  onResult: (text: string) => void;
  isListening?: boolean;
}

export function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Verifica suporte a Web Speech API
    if (typeof window !== 'undefined') {
      setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) {
      toast.error('Busca por voz não suportada neste navegador');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);

      if (event.results[current].isFinal) {
        onResult(result);
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast.error('Permissão de microfone negada');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!isSupported) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={isListening ? stopListening : startListening}
        className={`rounded-full shrink-0 ${isListening ? 'text-primary bg-primary/10' : ''}`}
        aria-label="Buscar por voz"
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="w-4 h-4" />
          </motion.div>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={stopListening}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-8 w-full max-w-sm shadow-xl border border-border text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(var(--primary), 0.4)',
                    '0 0 0 20px rgba(var(--primary), 0)',
                    '0 0 0 0 rgba(var(--primary), 0)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              >
                <Mic className="w-10 h-10 text-primary" />
              </motion.div>

              <h3 className="font-semibold text-lg mb-2">Ouvindo...</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Diga o nome do prato que procura
              </p>

              {transcript && (
                <p className="text-sm font-medium text-primary mb-4">
                  "{transcript}"
                </p>
              )}

              <Button
                variant="outline"
                onClick={stopListening}
                className="rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
