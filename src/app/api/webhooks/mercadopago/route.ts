import { NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/mercadopago";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import crypto from "crypto";

// Verifica a assinatura do webhook do Mercado Pago
function verifyWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string | null
): boolean {
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  // Em desenvolvimento, permite sem verificação se não tiver secret configurado
  if (!webhookSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Webhook] ERRO: MERCADO_PAGO_WEBHOOK_SECRET não configurado em produção');
      return false;
    }
    console.warn('[Webhook] Aviso: Webhook secret não configurado, pulando verificação');
    return true;
  }

  if (!xSignature || !xRequestId) {
    console.error('[Webhook] Headers de assinatura ausentes');
    return false;
  }

  // Parse do header x-signature (formato: ts=xxx,v1=xxx)
  const parts = xSignature.split(',');
  const tsMatch = parts.find(p => p.startsWith('ts='));
  const v1Match = parts.find(p => p.startsWith('v1='));

  if (!tsMatch || !v1Match) {
    console.error('[Webhook] Formato de assinatura inválido');
    return false;
  }

  const ts = tsMatch.replace('ts=', '');
  const v1 = v1Match.replace('v1=', '');

  // Monta o manifest conforme documentação do MP
  // Template: id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
  const manifest = `id:${dataId || ''};request-id:${xRequestId};ts:${ts};`;

  // Calcula HMAC SHA256
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(manifest);
  const calculatedSignature = hmac.digest('hex');

  // Compara de forma segura contra timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(v1, 'hex'),
      Buffer.from(calculatedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Pega os headers para verificação
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    // Mercado Pago envia o ID do pagamento de duas formas
    const body = await request.text();
    let paymentId: string | null = null;
    let dataIdFromBody: string | null = null;

    try {
      const jsonBody = JSON.parse(body);
      paymentId = jsonBody.data?.id;
      dataIdFromBody = jsonBody.data?.id;
    } catch {
      // Se falhar ao parsear JSON, tenta pegar da query string
      const { searchParams } = new URL(request.url);
      paymentId = searchParams.get("data.id");
      dataIdFromBody = paymentId;
    }

    // Verifica assinatura do webhook
    if (!verifyWebhookSignature(xSignature, xRequestId, dataIdFromBody)) {
      console.error('[Webhook] Assinatura inválida - possível tentativa de fraude');
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (!paymentId) {
      console.log("Webhook chamado sem ID de pagamento");
      return NextResponse.json({ status: "ok" });
    }

    console.log(`[Webhook] Processando pagamento ID: ${paymentId}`);

    // 1. Busca o status real no Mercado Pago
    const payment = await getPaymentStatus(paymentId);

    console.log(`[Webhook] Status do pagamento: ${payment.status}`);

    // 2. Processa apenas pagamentos aprovados
    if (payment.status === "approved") {
      const orderId = payment.external_reference;

      if (!orderId) {
        console.error("[Webhook] External reference (orderId) não encontrado");
        return NextResponse.json({ status: "ok" });
      }

      // 3. Busca o pedido no Firebase
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        console.error(`[Webhook] Pedido ${orderId} não encontrado no Firebase`);
        return NextResponse.json({ status: "ok" });
      }

      const orderData = orderSnap.data();

      // Evita processar pagamentos já confirmados
      if (orderData.status === "confirmed") {
        console.log(`[Webhook] Pedido ${orderId} já foi confirmado anteriormente`);
        return NextResponse.json({ status: "ok" });
      }

      // 4. Atualiza o status do pedido para "Confirmado"
      await updateDoc(orderRef, {
        status: "confirmed",
        paidAt: new Date().toISOString(),
        paymentId: paymentId,
        paymentStatus: payment.status,
        paymentMethod: payment.payment_method_id
      });

      console.log(`[Webhook] Pedido ${orderId} marcado como confirmado`);

      console.log(`[Webhook] ✅ Pedido ${orderId} processado com sucesso`);
    } else if (payment.status === "rejected" || payment.status === "cancelled") {
      // Opcional: Marcar pedido como cancelado
      const orderId = payment.external_reference;
      if (orderId) {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
          status: "cancelled",
          paymentStatus: payment.status,
          cancelledAt: new Date().toISOString()
        });
        console.log(`[Webhook] Pedido ${orderId} cancelado/rejeitado`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Webhook] Erro:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
