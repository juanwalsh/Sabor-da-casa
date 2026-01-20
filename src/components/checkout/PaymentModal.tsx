import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Smartphone, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice } from "@/data/mockData";

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

  // Simula o fluxo de pagamento
  useEffect(() => {
    if (isOpen) {
      setStatus('pending');
      if (method === 'pix') {
        setMessage('Aguardando pagamento Pix...');
        // Aqui chamaria a API para gerar o QR Code real
      } else if (method === 'credit_card' || method === 'debit_card') {
        setMessage('Insira o cartão na maquininha SmartPOS...');
        // Aqui chamaria a API para iniciar transação na maquininha
        setTimeout(() => setStatus('processing'), 2000);
      } else {
        // Dinheiro
        setStatus('success');
        setTimeout(onPaymentComplete, 1000);
      }
    }
  }, [isOpen, method, onPaymentComplete]);

  // Simula confirmação externa (ex: webhook ou polling)
  const simulatePayment = () => {
    setStatus('processing');
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
            <div className="text-center space-y-4">
              <div className="relative w-48 h-48 mx-auto border-4 border-white shadow-lg rounded-xl overflow-hidden">
                {/* QR Code Simulado - Em produção, viria da API */}
                <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126360014BR.GOV.BCB.PIX0114+55119999999995204000053039865802BR5913EP LOPES GELO6009SAO PAULO62070503***63041234`}
                  alt="QR Code Pix"
                  width={200}
                  height={200}
                  className="w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">
                Escaneie o QR Code para pagar
              </p>
              <Button onClick={simulatePayment} className="w-full" variant="outline">
                Simular Pagamento Aprovado
              </Button>
            </div>
          )}

          {status === 'pending' && (method === 'credit_card' || method === 'debit_card') && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CreditCard className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-lg font-medium">{message}</p>
              <p className="text-sm text-muted-foreground">Siga as instruções no visor da maquininha</p>
              <Button onClick={simulatePayment} className="w-full" variant="outline">
                Simular Pagamento Aprovado
              </Button>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <p className="text-lg font-medium">Processando pagamento...</p>
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
