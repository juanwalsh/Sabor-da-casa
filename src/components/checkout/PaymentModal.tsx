import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, CreditCard, Copy, Clock, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice } from "@/data/mockData";
import { toast } from "sonner";
import { generatePixPayload } from "@/lib/pix";
import { STORE_CONFIG } from "@/lib/store-config";

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
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos (padrão Pix)
  const [pixCode, setPixCode] = useState('');

  // Gera código Pix REAL ao abrir
  useEffect(() => {
    if (isOpen && method === 'pix') {
      try {
        // Gera o payload oficial do Banco Central
        const payload = generatePixPayload({
          key: STORE_CONFIG.pix.key,
          name: STORE_CONFIG.pix.name,
          city: STORE_CONFIG.pix.city,
          amount: total,
          txid: orderId.slice(-10).replace(/[^a-zA-Z0-9]/g, '') // TxID alfanumérico limpo
        });
        
        setPixCode(payload);
        setStatus('pending');
        setMessage('Aguardando pagamento Pix...');
        setTimeLeft(900);
      } catch (error) {
        console.error("Erro ao gerar Pix:", error);
        toast.error("Erro ao gerar QR Code Pix");
      }
    } else if (isOpen) {
      // Reset para outros métodos
      setStatus('pending');
      if (method === 'credit_card' || method === 'debit_card') {
        setMessage('Processando pagamento seguro online...');
        setTimeout(() => setStatus('processing'), 3000);
      } else if (method === 'cash') {
        setStatus('success');
        setTimeout(onPaymentComplete, 1500);
      }
    }
  }, [isOpen, method, total, orderId, onPaymentComplete]);

  // Timer regressivo
  useEffect(() => {
    if (!isOpen || status !== 'pending' || method !== 'pix') return;
    const timer = setInterval(() => setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [isOpen, status, method]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success("Código Pix copiado!");
  };

  const simulatePayment = () => {
    setStatus('processing');
    setMessage('Verificando recebimento...');
    setTimeout(() => {
      setStatus('success');
      setTimeout(onPaymentComplete, 1500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pagamento via {method === 'pix' ? 'Pix' : 'Cartão'}</DialogTitle>
          <DialogDescription>
            Total a pagar: <span className="font-bold text-primary">{formatPrice(total)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-6">
          {/* PIX FLOW */}
          {status === 'pending' && method === 'pix' && (
            <div className="text-center space-y-5 w-full">
              {/* Timer */}
              <div className="inline-flex items-center justify-center gap-2 text-sm text-orange-600 font-medium bg-orange-50 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span>Pague em {formatTime(timeLeft)}</span>
              </div>

              {/* QR Code Container */}
              <div className="flex justify-center">
                <div className="relative w-64 h-64 border-4 border-white shadow-xl rounded-2xl overflow-hidden bg-white">
                   {/* Usando API externa apenas para RENDERIZAR a string Pix Real gerada localmente */}
                  <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(pixCode)}`}
                    alt="QR Code Pix Real"
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              </div>

              {/* Copy Paste */}
              <div className="space-y-2 w-full">
                <p className="text-sm font-medium text-muted-foreground">Pix Copia e Cola:</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted p-3 rounded-lg text-xs break-all font-mono border text-left leading-relaxed">
                    {pixCode}
                  </div>
                  <Button size="icon" variant="outline" className="h-auto shrink-0 w-12" onClick={copyToClipboard} title="Copiar código">
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Warning Key */}
              {STORE_CONFIG.pix.key.includes("123") && (
                <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200 text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Atenção: Configure sua chave Pix real em src/lib/store-config.ts para receber.</span>
                </div>
              )}

              {/* Action */}
              <div className="pt-2 w-full">
                 <Button onClick={simulatePayment} className="w-full h-12 text-base shadow-md" variant="default">
                    Já realizei o pagamento
                 </Button>
                 <p className="text-xs text-muted-foreground mt-3">
                    A confirmação automática pode levar alguns segundos.
                 </p>
              </div>
            </div>
          )}

          {/* CARD FLOW */}
          {status === 'pending' && (method === 'credit_card' || method === 'debit_card') && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CreditCard className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Processando Pagamento</h3>
                <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                  Estamos conectando com a operadora do seu cartão de forma segura...
                </p>
              </div>
              <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-indeterminate-bar" />
              </div>
            </div>
          )}

          {/* SUCCESS FLOW */}
          {status === 'success' && (
            <div className="text-center space-y-6 py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto scale-in-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-700">Pagamento Confirmado!</h3>
                <p className="text-muted-foreground">Seu pedido já foi enviado para a cozinha.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}