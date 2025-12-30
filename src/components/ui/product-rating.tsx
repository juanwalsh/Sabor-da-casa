'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
  verified: boolean;
}

interface ProductRatingProps {
  productId: string;
  productName: string;
  className?: string;
}

// Mock de avaliações
const mockReviews: Record<string, Review[]> = {
  'prod-1': [
    {
      id: 'r1',
      userId: 'u1',
      userName: 'Maria S.',
      rating: 5,
      comment: 'Melhor feijoada que ja comi! Muito saborosa e a porcao e generosa.',
      date: new Date('2024-12-20'),
      helpful: 12,
      verified: true,
    },
    {
      id: 'r2',
      userId: 'u2',
      userName: 'Joao P.',
      rating: 5,
      comment: 'Excelente! Lembra a comida da minha avo.',
      date: new Date('2024-12-18'),
      helpful: 8,
      verified: true,
    },
    {
      id: 'r3',
      userId: 'u3',
      userName: 'Ana C.',
      rating: 4,
      comment: 'Muito boa, mas gostaria que viesse mais couve.',
      date: new Date('2024-12-15'),
      helpful: 3,
      verified: false,
    },
  ],
};

// Store local para avaliações (simulando persistência)
let userReviews: Record<string, { rating: number; comment: string }> = {};

export function ProductRating({ productId, productName, className = '' }: ProductRatingProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Carregar avaliações mock
    setReviews(mockReviews[productId] || []);

    // Carregar avaliação do usuário (se existir)
    const saved = userReviews[productId];
    if (saved) {
      setUserRating(saved.rating);
      setUserComment(saved.comment);
    }
  }, [productId]);

  if (!mounted) return null;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 4.9; // Valor padrão se não houver avaliações

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast.error('Por favor, selecione uma avaliacao');
      return;
    }

    // Salvar avaliação
    userReviews[productId] = { rating: userRating, comment: userComment };

    // Adicionar à lista
    const newReview: Review = {
      id: `r-${Date.now()}`,
      userId: 'current-user',
      userName: 'Voce',
      rating: userRating,
      comment: userComment,
      date: new Date(),
      helpful: 0,
      verified: true,
    };

    setReviews([newReview, ...reviews]);
    setShowAddReview(false);
    toast.success('Avaliacao enviada com sucesso!');
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      )
    );
    toast.success('Obrigado pelo feedback!');
  };

  return (
    <div className={className}>
      {/* Summary */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {reviews.length} {reviews.length === 1 ? 'avaliacao' : 'avaliacoes'}
            </p>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-3">{star}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Progress value={percentage} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setShowAddReview(true)}
          className="w-full mt-6 rounded-xl"
        >
          <Star className="w-4 h-4 mr-2" />
          Avaliar produto
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-semibold">Avaliacoes dos clientes</h4>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma avaliacao ainda. Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Compra verificada
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {review.comment}
                      </p>
                    )}
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Util ({review.helpful})
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add Review Modal */}
      <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Avaliar {productName}</DialogTitle>
            <DialogDescription>
              Compartilhe sua experiencia com outros clientes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Star Rating */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Toque para avaliar
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoverRating || userRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium mt-2">
                {userRating === 0
                  ? 'Selecione uma nota'
                  : userRating === 5
                  ? 'Excelente!'
                  : userRating === 4
                  ? 'Muito bom!'
                  : userRating === 3
                  ? 'Bom'
                  : userRating === 2
                  ? 'Regular'
                  : 'Ruim'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Comentario (opcional)
              </label>
              <Textarea
                placeholder="Conte sua experiencia com este produto..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="resize-none h-24"
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              className="w-full rounded-xl"
              disabled={userRating === 0}
            >
              Enviar avaliacao
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente compacto para mostrar rating inline
export function ProductRatingInline({
  productId,
  showCount = true,
}: {
  productId: string;
  showCount?: boolean;
}) {
  const reviews = mockReviews[productId] || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 4.9;

  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
      {showCount && reviews.length > 0 && (
        <span className="text-xs text-muted-foreground">({reviews.length})</span>
      )}
    </div>
  );
}
