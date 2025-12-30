'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  Leaf,
  Wheat,
  Flame,
  Clock,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export interface AdvancedFiltersState {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  lowCalorie: boolean;
  maxPrepTime: number | null; // em minutos
  priceRange: [number, number];
  spiceLevel: 'all' | 'mild' | 'medium' | 'hot';
}

interface AdvancedFiltersProps {
  filters: AdvancedFiltersState;
  onFiltersChange: (filters: AdvancedFiltersState) => void;
  className?: string;
}

const defaultFilters: AdvancedFiltersState = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  lowCalorie: false,
  maxPrepTime: null,
  priceRange: [0, 100],
  spiceLevel: 'all',
};

export function AdvancedFilters({ filters, onFiltersChange, className }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  if (!mounted) return null;

  const activeFilterCount = [
    filters.vegetarian,
    filters.vegan,
    filters.glutenFree,
    filters.lowCalorie,
    filters.maxPrepTime !== null,
    filters.spiceLevel !== 'all',
  ].filter(Boolean).length;

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const updateFilter = <K extends keyof AdvancedFiltersState>(
    key: K,
    value: AdvancedFiltersState[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Filter Pills */}
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* Main Filter Button */}
        <Button
          variant={activeFilterCount > 0 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary-foreground text-primary">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Quick Filter Pills */}
        <QuickFilterPill
          active={filters.vegetarian}
          onClick={() => onFiltersChange({ ...filters, vegetarian: !filters.vegetarian })}
          icon={<Leaf className="w-3 h-3" />}
          label="Vegetariano"
        />
        <QuickFilterPill
          active={filters.glutenFree}
          onClick={() => onFiltersChange({ ...filters, glutenFree: !filters.glutenFree })}
          icon={<Wheat className="w-3 h-3" />}
          label="Sem Glúten"
        />
        <QuickFilterPill
          active={filters.lowCalorie}
          onClick={() => onFiltersChange({ ...filters, lowCalorie: !filters.lowCalorie })}
          icon={<Flame className="w-3 h-3" />}
          label="Low Carb"
        />
      </div>

      {/* Filter Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Filtros Avançados
            </SheetTitle>
            <SheetDescription>
              Refine sua busca para encontrar o prato perfeito
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Dietary Restrictions */}
            <div>
              <h3 className="font-medium mb-4">Restrições Alimentares</h3>
              <div className="space-y-3">
                <FilterToggle
                  id="vegetarian"
                  label="Vegetariano"
                  description="Sem carne"
                  icon={<Leaf className="w-4 h-4 text-green-500" />}
                  checked={localFilters.vegetarian}
                  onChange={(checked) => updateFilter('vegetarian', checked)}
                />
                <FilterToggle
                  id="vegan"
                  label="Vegano"
                  description="Sem produtos de origem animal"
                  icon={<Leaf className="w-4 h-4 text-green-600" />}
                  checked={localFilters.vegan}
                  onChange={(checked) => updateFilter('vegan', checked)}
                />
                <FilterToggle
                  id="glutenFree"
                  label="Sem Glúten"
                  description="Para celíacos e intolerantes"
                  icon={<Wheat className="w-4 h-4 text-amber-500" />}
                  checked={localFilters.glutenFree}
                  onChange={(checked) => updateFilter('glutenFree', checked)}
                />
                <FilterToggle
                  id="lowCalorie"
                  label="Baixa Caloria"
                  description="Menos de 500 kcal"
                  icon={<Flame className="w-4 h-4 text-orange-500" />}
                  checked={localFilters.lowCalorie}
                  onChange={(checked) => updateFilter('lowCalorie', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Preparation Time */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tempo de Preparo
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: null, label: 'Todos' },
                  { value: 15, label: '15 min' },
                  { value: 30, label: '30 min' },
                  { value: 45, label: '45 min' },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => updateFilter('maxPrepTime', option.value)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      localFilters.maxPrepTime === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card hover:border-primary/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Spice Level */}
            <div>
              <h3 className="font-medium mb-4">Nível de Tempero</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'all' as const, label: 'Todos', emoji: '🍽️' },
                  { value: 'mild' as const, label: 'Suave', emoji: '🌿' },
                  { value: 'medium' as const, label: 'Médio', emoji: '🌶️' },
                  { value: 'hot' as const, label: 'Picante', emoji: '🔥' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFilter('spiceLevel', option.value)}
                    className={`p-2 rounded-lg border text-sm transition-all ${
                      localFilters.spiceLevel === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card hover:border-primary/30'
                    }`}
                  >
                    <span className="block text-lg mb-1">{option.emoji}</span>
                    <span className="text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClear}>
                Limpar
              </Button>
              <Button className="flex-1" onClick={handleApply}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function FilterToggle({
  id,
  label,
  description,
  icon,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <Label htmlFor={id} className="font-medium cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function QuickFilterPill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted hover:bg-muted/80'
      }`}
    >
      {icon}
      {label}
      {active && <X className="w-3 h-3 ml-1" />}
    </button>
  );
}

// Export default filters for use in pages
export { defaultFilters };
