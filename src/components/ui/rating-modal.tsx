'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderHistoryStore } from '@/store/orderHistoryStore';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function RatingModal({ isOpen, onClose, orderId }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { rateOrder } = useOrderHistoryStore();

  const handleSubmit = () => {
    if (rating > 0) {
      rateOrder(orderId, rating);
      onClose();
    }
  };

  const messages = [
    '',
    'Precisamos melhorar',
    'Pode melhorar',
    'Bom',
    'Muito bom!',
    'Excelente!'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl border border-border"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Como foi seu pedido?</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Sua opinião nos ajuda a melhorar!
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            <p className="text-center text-sm font-medium h-6 mb-6">
              {messages[hoveredRating || rating]}
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Depois
              </Button>
              <Button
                className="flex-1"
                disabled={rating === 0}
                onClick={handleSubmit}
              >
                Enviar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
