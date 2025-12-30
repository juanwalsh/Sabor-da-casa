'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface CustomizationOption {
  id: string;
  label: string;
  type: 'remove' | 'add' | 'preference';
  price?: number;
}

const commonCustomizations: CustomizationOption[] = [
  // Remover ingredientes
  { id: 'sem-cebola', label: 'Sem cebola', type: 'remove' },
  { id: 'sem-alho', label: 'Sem alho', type: 'remove' },
  { id: 'sem-pimenta', label: 'Sem pimenta', type: 'remove' },
  { id: 'sem-coentro', label: 'Sem coentro', type: 'remove' },
  { id: 'sem-tomate', label: 'Sem tomate', type: 'remove' },
  { id: 'sem-maionese', label: 'Sem maionese', type: 'remove' },

  // Preferências
  { id: 'molho-parte', label: 'Molho a parte', type: 'preference' },
  { id: 'bem-passado', label: 'Bem passado', type: 'preference' },
  { id: 'mal-passado', label: 'Mal passado', type: 'preference' },
  { id: 'pouco-sal', label: 'Pouco sal', type: 'preference' },
  { id: 'sem-sal', label: 'Sem sal adicional', type: 'preference' },

  // Extras (com preço)
  { id: 'extra-queijo', label: 'Extra queijo', type: 'add', price: 3.00 },
  { id: 'extra-bacon', label: 'Extra bacon', type: 'add', price: 5.00 },
  { id: 'extra-ovo', label: 'Extra ovo', type: 'add', price: 2.50 },
  { id: 'extra-farofa', label: 'Extra farofa', type: 'add', price: 4.00 },
];

interface ProductCustomizationProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
  additionalNotes: string;
  onNotesChange: (notes: string) => void;
  className?: string;
}

export function ProductCustomization({
  selectedOptions,
  onOptionsChange,
  additionalNotes,
  onNotesChange,
  className = '',
}: ProductCustomizationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOption = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      onOptionsChange(selectedOptions.filter((id) => id !== optionId));
    } else {
      onOptionsChange([...selectedOptions, optionId]);
    }
  };

  const getOptionsByType = (type: CustomizationOption['type']) => {
    return commonCustomizations.filter((opt) => opt.type === type);
  };

  const getExtraTotal = () => {
    return selectedOptions.reduce((total, optionId) => {
      const option = commonCustomizations.find((o) => o.id === optionId);
      return total + (option?.price || 0);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const selectedCount = selectedOptions.length;
  const extraTotal = getExtraTotal();

  return (
    <div className={`border border-border rounded-xl overflow-hidden ${className}`}>
      {/* Header - sempre visível */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">Personalizar pedido</span>
          {selectedCount > 0 && (
            <Badge variant="secondary">
              {selectedCount} {selectedCount === 1 ? 'opcao' : 'opcoes'}
            </Badge>
          )}
          {extraTotal > 0 && (
            <Badge className="bg-primary/10 text-primary border-0">
              +{formatPrice(extraTotal)}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Conteúdo expansível */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {/* Remover ingredientes */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Remover ingredientes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getOptionsByType('remove').map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedOptions.includes(option.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {selectedOptions.includes(option.id) && (
                        <Check className="w-3 h-3 inline mr-1" />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferências */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Preferencias de preparo
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getOptionsByType('preference').map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedOptions.includes(option.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {selectedOptions.includes(option.id) && (
                        <Check className="w-3 h-3 inline mr-1" />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extras */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Adicionar extras
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getOptionsByType('add').map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
                        selectedOptions.includes(option.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {selectedOptions.includes(option.id) ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                      {option.label}
                      <span className="text-xs opacity-75">
                        +{formatPrice(option.price!)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações adicionais */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Observacoes adicionais
                </h4>
                <Textarea
                  placeholder="Alguma outra observacao? Ex: alergia a amendoim, ponto da carne..."
                  value={additionalNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  className="resize-none h-20"
                />
              </div>

              {/* Resumo */}
              {(selectedCount > 0 || additionalNotes) && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Resumo das personalizacoes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedOptions.map((optionId) => {
                      const option = commonCustomizations.find((o) => o.id === optionId);
                      return option ? (
                        <li key={optionId} className="flex justify-between">
                          <span>{option.label}</span>
                          {option.price && (
                            <span className="text-primary">+{formatPrice(option.price)}</span>
                          )}
                        </li>
                      ) : null;
                    })}
                    {additionalNotes && (
                      <li className="italic">"{additionalNotes}"</li>
                    )}
                  </ul>
                  {extraTotal > 0 && (
                    <div className="mt-2 pt-2 border-t border-border flex justify-between font-medium">
                      <span>Total dos extras:</span>
                      <span className="text-primary">+{formatPrice(extraTotal)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook para usar as customizações
export function useProductCustomization() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const getCustomizationText = () => {
    const parts: string[] = [];

    selectedOptions.forEach((optionId) => {
      const option = commonCustomizations.find((o) => o.id === optionId);
      if (option) parts.push(option.label);
    });

    if (additionalNotes) {
      parts.push(additionalNotes);
    }

    return parts.join(', ');
  };

  const getExtraPrice = () => {
    return selectedOptions.reduce((total, optionId) => {
      const option = commonCustomizations.find((o) => o.id === optionId);
      return total + (option?.price || 0);
    }, 0);
  };

  const reset = () => {
    setSelectedOptions([]);
    setAdditionalNotes('');
  };

  return {
    selectedOptions,
    setSelectedOptions,
    additionalNotes,
    setAdditionalNotes,
    getCustomizationText,
    getExtraPrice,
    reset,
  };
}
