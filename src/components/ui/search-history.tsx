'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'sabor-da-casa-search-history';
const MAX_HISTORY_ITEMS = 10;

// Termos populares (mock)
const popularSearches = [
  'feijoada',
  'marmita fitness',
  'escondidinho',
  'sobremesa',
  'vegetariano',
];

interface SearchHistoryProps {
  onSelect: (term: string) => void;
  currentQuery: string;
  isVisible: boolean;
  className?: string;
}

export function SearchHistory({
  onSelect,
  currentQuery,
  isVisible,
  className = '',
}: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignorar erros de localStorage
    }
  };

  const saveHistory = (newHistory: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignorar erros de localStorage
    }
  };

  const removeFromHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter((h) => h !== term);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  if (!mounted || !isVisible) return null;

  // Filtrar histórico baseado na query atual
  const filteredHistory = currentQuery
    ? history.filter((h) =>
        h.toLowerCase().includes(currentQuery.toLowerCase())
      )
    : history;

  // Filtrar populares que não estão no histórico
  const filteredPopular = popularSearches.filter(
    (p) => !history.includes(p) && !filteredHistory.includes(p)
  );

  if (filteredHistory.length === 0 && filteredPopular.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 ${className}`}
      >
        {/* Histórico de buscas */}
        {filteredHistory.length > 0 && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Buscas recentes
              </span>
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Limpar
              </button>
            </div>
            <div className="space-y-1">
              {filteredHistory.slice(0, 5).map((term) => (
                <button
                  key={term}
                  onClick={() => onSelect(term)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{term}</span>
                  </div>
                  <button
                    onClick={(e) => removeFromHistory(term, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buscas populares */}
        {filteredPopular.length > 0 && !currentQuery && (
          <div className="p-2 border-t border-border">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 px-2 mb-2">
              <TrendingUp className="w-3 h-3" />
              Populares
            </span>
            <div className="flex flex-wrap gap-2 px-2">
              {filteredPopular.map((term) => (
                <button
                  key={term}
                  onClick={() => onSelect(term)}
                  className="px-3 py-1.5 text-sm bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Hook para gerenciar histórico de busca
export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignorar erros
    }
  }, []);

  const addToHistory = (term: string) => {
    if (!term.trim()) return;

    const normalizedTerm = term.trim().toLowerCase();
    const newHistory = [
      normalizedTerm,
      ...history.filter((h) => h !== normalizedTerm),
    ].slice(0, MAX_HISTORY_ITEMS);

    setHistory(newHistory);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignorar erros
    }
  };

  const removeFromHistory = (term: string) => {
    const newHistory = history.filter((h) => h !== term);
    setHistory(newHistory);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignorar erros
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar erros
    }
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
