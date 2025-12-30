'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, BellRing, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { usePushNotificationStore } from '@/store/pushNotificationStore';
import { toast } from 'sonner';

export function PushNotificationToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    isSupported,
    isSubscribed,
    permission,
    preferences,
    checkSupport,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendLocalNotification,
  } = usePushNotificationStore();

  useEffect(() => {
    setMounted(true);
    checkSupport();
  }, [checkSupport]);

  if (!mounted) return null;

  const handleToggleSubscription = async () => {
    if (isSubscribed) {
      unsubscribe();
      toast.info('Notificações desativadas');
    } else {
      const success = await subscribe();
      if (success) {
        toast.success('Notificações ativadas!');
      } else if (permission === 'denied') {
        toast.error('Permissão negada. Ative nas configurações do navegador.');
      }
    }
  };

  const handleTestNotification = () => {
    sendLocalNotification(
      'Teste de notificação',
      'As notificações estão funcionando corretamente!'
    );
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        {isSubscribed ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {isSubscribed && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </Button>

      {/* Settings Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notificações
            </SheetTitle>
            <SheetDescription>
              Receba atualizações sobre seus pedidos e promoções
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Main Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                {isSubscribed ? (
                  <BellRing className="w-6 h-6 text-primary" />
                ) : (
                  <BellOff className="w-6 h-6 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-xs text-muted-foreground">
                    {isSubscribed ? 'Ativadas' : 'Desativadas'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isSubscribed}
                onCheckedChange={handleToggleSubscription}
              />
            </div>

            {/* Permission Status */}
            {permission === 'denied' && (
              <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                <p className="text-sm text-destructive">
                  Permissão negada. Para ativar, acesse as configurações do seu
                  navegador e permita notificações para este site.
                </p>
              </div>
            )}

            {/* Preferences */}
            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Preferências
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-order" className="flex-1">
                      <p className="font-medium">Status do pedido</p>
                      <p className="text-xs text-muted-foreground">
                        Atualizações sobre seus pedidos
                      </p>
                    </Label>
                    <Switch
                      id="pref-order"
                      checked={preferences.orderStatus}
                      onCheckedChange={(checked) =>
                        updatePreferences({ orderStatus: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-promo" className="flex-1">
                      <p className="font-medium">Promoções</p>
                      <p className="text-xs text-muted-foreground">
                        Ofertas e descontos especiais
                      </p>
                    </Label>
                    <Switch
                      id="pref-promo"
                      checked={preferences.promotions}
                      onCheckedChange={(checked) =>
                        updatePreferences({ promotions: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-new" className="flex-1">
                      <p className="font-medium">Novidades</p>
                      <p className="text-xs text-muted-foreground">
                        Novos pratos no cardápio
                      </p>
                    </Label>
                    <Switch
                      id="pref-new"
                      checked={preferences.newItems}
                      onCheckedChange={(checked) =>
                        updatePreferences({ newItems: checked })
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Test Button */}
            {isSubscribed && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleTestNotification}
              >
                <BellRing className="w-4 h-4 mr-2" />
                Testar notificação
              </Button>
            )}

            {/* Info */}
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground">
                Você pode desativar as notificações a qualquer momento nas
                configurações do seu navegador ou aqui neste menu.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
