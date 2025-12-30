'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle2, XCircle, Loader2, Clock, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DELIVERY_FEE, FREE_DELIVERY_MIN, formatPrice } from '@/data/mockData';

// Bairros atendidos com suas informações de entrega
const deliveryZones: Record<string, { time: string; available: boolean }> = {
  '01000': { time: '25-35 min', available: true }, // Centro
  '01001': { time: '25-35 min', available: true },
  '01002': { time: '25-35 min', available: true },
  '01003': { time: '25-35 min', available: true },
  '01004': { time: '25-35 min', available: true },
  '01005': { time: '25-35 min', available: true },
  '01006': { time: '25-35 min', available: true },
  '01007': { time: '25-35 min', available: true },
  '01008': { time: '25-35 min', available: true },
  '01009': { time: '25-35 min', available: true },
  '01310': { time: '30-40 min', available: true }, // Consolacao/Bela Vista
  '01311': { time: '30-40 min', available: true },
  '01312': { time: '30-40 min', available: true },
  '01401': { time: '30-40 min', available: true }, // Jardins
  '01402': { time: '30-40 min', available: true },
  '01403': { time: '30-40 min', available: true },
  '01404': { time: '30-40 min', available: true },
  '01405': { time: '30-40 min', available: true },
  '05400': { time: '35-45 min', available: true }, // Pinheiros
  '05401': { time: '35-45 min', available: true },
  '05402': { time: '35-45 min', available: true },
  '05410': { time: '35-50 min', available: true }, // Vila Madalena
  '05411': { time: '35-50 min', available: true },
  '01500': { time: '30-40 min', available: true }, // Liberdade
  '01501': { time: '30-40 min', available: true },
  '04500': { time: '40-55 min', available: true }, // Moema
  '04501': { time: '40-55 min', available: true },
  '04502': { time: '40-55 min', available: true },
  '04530': { time: '35-50 min', available: true }, // Itaim Bibi
  '04531': { time: '35-50 min', available: true },
  '04100': { time: '35-45 min', available: true }, // Vila Mariana
  '04101': { time: '35-45 min', available: true },
  '05000': { time: '40-55 min', available: true }, // Perdizes
  '05001': { time: '40-55 min', available: true },
};

interface CepValidatorProps {
  onValidCep?: (cep: string, info: { time: string; available: boolean }) => void;
  onInvalidCep?: (cep: string) => void;
  showCard?: boolean;
  className?: string;
}

export function CepValidator({
  onValidCep,
  onInvalidCep,
  showCard = true,
  className = '',
}: CepValidatorProps) {
  const [cep, setCep] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    time?: string;
    message: string;
  } | null>(null);

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const validateCep = async () => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setResult({
        valid: false,
        message: 'CEP deve ter 8 digitos',
      });
      return;
    }

    setIsValidating(true);

    // Simular chamada de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verificar se o prefixo do CEP está na área de cobertura
    const prefix = cleanCep.slice(0, 5);
    const zone = deliveryZones[prefix];

    if (zone && zone.available) {
      setResult({
        valid: true,
        time: zone.time,
        message: 'Otimo! Entregamos no seu endereco',
      });
      onValidCep?.(cleanCep, zone);
    } else {
      setResult({
        valid: false,
        message: 'Infelizmente ainda nao atendemos essa regiao',
      });
      onInvalidCep?.(cleanCep);
    }

    setIsValidating(false);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateCep();
    }
  };

  if (!showCard) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Digite seu CEP"
            value={cep}
            onChange={handleCepChange}
            onKeyDown={handleKeyDown}
            maxLength={9}
            className="pl-10"
            aria-label="CEP para verificar entrega"
          />
        </div>
        <Button onClick={validateCep} disabled={isValidating}>
          {isValidating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Verificar'
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-2xl p-6 ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Verificar area de entrega
      </h3>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="00000-000"
            value={cep}
            onChange={handleCepChange}
            onKeyDown={handleKeyDown}
            maxLength={9}
            className="h-12 rounded-xl text-center text-lg tracking-widest"
            aria-label="CEP para verificar entrega"
          />
        </div>
        <Button
          onClick={validateCep}
          disabled={isValidating}
          size="lg"
          className="rounded-xl px-6"
        >
          {isValidating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Verificar'
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl ${
              result.valid
                ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.valid ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  result.valid
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {result.message}
                </p>

                {result.valid && result.time && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Tempo estimado: <strong>{result.time}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        Taxa de entrega: <strong>{formatPrice(DELIVERY_FEE)}</strong>
                        <span className="text-xs ml-1">
                          (gratis acima de {formatPrice(FREE_DELIVERY_MIN)})
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                {!result.valid && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Veja nossa <a href="/entrega" className="text-primary underline">area de cobertura</a>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
