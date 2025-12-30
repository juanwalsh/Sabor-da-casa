'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Users, Link2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCartStore } from '@/store/cartStore';
import { useShareCartStore } from '@/store/shareCartStore';
import { toast } from 'sonner';

interface ShareCartProps {
  className?: string;
}

export function ShareCart({ className }: ShareCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [mounted, setMounted] = useState(false);

  const { items } = useCartStore();
  const { generateShareLink, isSharedCart, sharedCartOwner } = useShareCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleGenerateLink = () => {
    if (!ownerName.trim()) {
      toast.error('Digite seu nome');
      return;
    }

    if (items.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    const link = generateShareLink(items, ownerName);
    setShareLink(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pedido Sabor da Casa',
          text: `${ownerName} compartilhou um carrinho com você!`,
          url: shareLink,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      {/* Shared Cart Banner */}
      {isSharedCart && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 mb-4"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary" />
            <p className="text-sm">
              Carrinho compartilhado por <strong>{sharedCartOwner}</strong>
            </p>
          </div>
        </motion.div>
      )}

      {/* Share Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`gap-2 ${className}`}
        disabled={items.length === 0}
      >
        <Share2 className="w-4 h-4" />
        Compartilhar carrinho
      </Button>

      {/* Share Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Compartilhar Carrinho
            </DialogTitle>
            <DialogDescription>
              Envie o link para amigos e façam o pedido juntos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!shareLink ? (
              <>
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seu nome</label>
                  <Input
                    placeholder="Digite seu nome"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </div>

                {/* Cart Summary */}
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm font-medium mb-2">
                    Itens no carrinho ({items.length})
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {items.slice(0, 3).map((item) => (
                      <li key={item.product.id}>
                        {item.quantity}x {item.product.name}
                      </li>
                    ))}
                    {items.length > 3 && (
                      <li>... e mais {items.length - 3} itens</li>
                    )}
                  </ul>
                </div>

                <Button onClick={handleGenerateLink} className="w-full">
                  <Link2 className="w-4 h-4 mr-2" />
                  Gerar link de compartilhamento
                </Button>
              </>
            ) : (
              <>
                {/* Generated Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link do carrinho</label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={shareLink}
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Share Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>

                {/* Info */}
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">
                    O link expira em 24 horas. Quem acessar poderá ver e
                    adicionar os mesmos itens ao carrinho.
                  </p>
                </div>

                {/* New Link */}
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShareLink('')}
                >
                  Gerar novo link
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
