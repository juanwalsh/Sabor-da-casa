const fs = require('fs');

const filePath = 'src/app/checkout/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Substituir o onSubmit
const oldOnSubmit = /const onSubmit = async \(data: CheckoutFormData\) => \{[\s\S]*?  \};/m;

const newOnSubmit = `const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    const total = getTotal();
    const firebaseOrderId = \`order-\${Date.now()}\`;

    try {
      // 1. CRIAR PAGAMENTO NO MERCADO PAGO PRIMEIRO
      toast.info('Criando link de pagamento...');
      
      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          orderId: firebaseOrderId,
          paymentMethod: 'pix',
          email: data.email || 'cliente@sabordacasa.com.br',
          description: \`Pedido - Sabor da Casa - Total: R$ \${total.toFixed(2)}\`
        })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.success) {
        toast.error('Erro ao criar pagamento. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      // 2. CRIAR PEDIDO NO FIREBASE
      const pedidoData: Record<string, unknown> = {
        cliente: {
          nome: data.name || '',
          telefone: data.phone || '',
          endereco: {
            rua: data.street || '',
            numero: data.number || '',
            bairro: data.neighborhood || '',
            cidade: data.city || 'Sao Paulo',
            cep: data.zipCode || '',
          },
        },
        itens: formatCartItemsForOrder(items),
        subtotal: subtotal,
        taxaEntrega: deliveryFee,
        desconto: discount,
        total: total,
        status: 'pendente' as const,
        formaPagamento: 'mercadopago',
        paymentId: paymentData.payment_id,
        paymentUrl: paymentData.qr_code
      };

      if (data.email) {
        (pedidoData.cliente as Record<string, unknown>).email = data.email;
      }
      if (data.complement) {
        ((pedidoData.cliente as Record<string, unknown>).endereco as Record<string, unknown>).complemento = data.complement;
      }
      if (data.notes) {
        pedidoData.observacoes = data.notes;
      }
      if (isScheduled) {
        pedidoData.agendamento = getFormattedSchedule();
      }

      const createdOrderId = await criarPedido(pedidoData, items);

      if (!createdOrderId) {
        toast.error('Erro ao criar pedido. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      const orderId = addOrder({
        items: items,
        total: total,
        status: 'pending',
      });
      setCurrentOrderId(createdOrderId);

      if (appliedCoupon) {
        markCouponAsUsed(appliedCoupon.code);
      }

      setIsSubmitting(false);

      // 3. ABRIR CHECKOUT DO MERCADO PAGO
      const checkoutUrl = paymentData.qr_code;
      window.open(checkoutUrl, '_blank');

      toast.success('Pedido criado! Finalize o pagamento na janela do Mercado Pago.', {
        duration: 6000
      });

      // 4. MONITORAR PAGAMENTO
      setPaymentId(paymentData.payment_id);
      setPixCode(checkoutUrl);
      setShowPaymentModal(true);

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };`;

content = content.replace(oldOnSubmit, newOnSubmit);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Checkout atualizado!');
