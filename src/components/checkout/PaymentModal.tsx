import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Smartphone, CreditCard, Copy, Clock } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice } from "@/data/mockData";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  total: number;
  method: 'pix' | 'credit_card' | 'debit_card' | 'cash';
  orderId: string;
}

export function PaymentModal({ isOpen, onClose, onPaymentComplete, total, method, orderId }: PaymentModalProps) {
  const [status, setStatus] = useState<'pending' | 'processing' | 'success'>('pending');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos
  const [pixCode, setPixCode] = useState('');

  // Gera código Pix simulado único por pedido
  useEffect(() => {
    if (isOpen && method === 'pix') {
      const simulatedPix = `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${total.toFixed(2).replace('.', '')}5802BR5913EP LOPES GELO6009SAO PAULO62070503***6304${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setPixCode(simulatedPix);
      setStatus('pending');
      setMessage('Aguardando pagamento Pix...');
      setTimeLeft(600);
    } else if (isOpen) {
      // Reset para outros métodos
      setStatus('pending');
      if (method === 'credit_card' || method === 'debit_card') {
        setMessage('Processando pagamento seguro online...');
        // Simula interação com gateway
        setTimeout(() => setStatus('processing'), 3000);
      } else if (method === 'cash') {
        setStatus('success');
        setTimeout(onPaymentComplete, 1500);
      }
    }
  }, [isOpen, method, total, onPaymentComplete]);

  // Timer regressivo
  useEffect(() => {
    if (!isOpen || status !== 'pending' || method !== 'pix') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, status, method]);

  // Formata o tempo MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success("Código Pix copiado!");
  };

  // Simula confirmação externa (webhook)
  const simulatePayment = () => {
    setStatus('processing');
    setMessage('Verificando pagamento...');
    setTimeout(() => {
      setStatus('success');
      setTimeout(onPaymentComplete, 1500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Pagamento</DialogTitle>
          <DialogDescription>
            Pedido #{orderId.slice(-6).toUpperCase()} - Total: {formatPrice(total)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          {status === 'pending' && method === 'pix' && (
            <div className="text-center space-y-4 w-full">
              <div className="flex items-center justify-center gap-2 text-sm text-orange-600 font-medium bg-orange-50 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                Expira em: {formatTime(timeLeft)}
              </div>

              <div className="relative w-48 h-48 mx-auto border-4 border-white shadow-lg rounded-xl overflow-hidden">
                <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`}
                  alt="QR Code Pix"
                  width={200}
                  height={200}
                  className="w-full h-full"
                  unoptimized // Evita cache do Next.js para garantir atualização visual se mudar URL
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code ou copie o código abaixo:
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted p-2 rounded text-xs truncate font-mono border">
                    {pixCode}
                  </div>
                  <Button size="icon" variant="outline" onClick={copyToClipboard} title="Copiar">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                 <p className="text-xs text-muted-foreground mb-2 animate-pulse">
                    Aguardando confirmação automática do banco...
                 </p>
                 <Button onClick={simulatePayment} className="w-full" variant="secondary">
                    Já fiz o pagamento
                 </Button>
              </div>
            </div>
          )}

          {status === 'pending' && (method === 'credit_card' || method === 'debit_card') && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CreditCard className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-lg font-medium">{message}</p>
              <p className="text-sm text-muted-foreground">Aguarde a confirmação da operadora...</p>
              <div className="pt-4">
                 <Button onClick={simulatePayment} className="w-full" variant="outline">
                    Simular Aprovação (Debug)
                 </Button>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <p className="text-lg font-medium">{message || 'Processando...'}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-600">Pagamento Confirmado!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
