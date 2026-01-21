import { NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/mercadopago";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    // Mercado Pago envia o ID do pagamento de duas formas
    const body = await request.text();
    let paymentId: string | null = null;

    try {
      const jsonBody = JSON.parse(body);
      paymentId = jsonBody.data?.id;
    } catch {
      // Se falhar ao parsear JSON, tenta pegar da query string
      const { searchParams } = new URL(request.url);
      paymentId = searchParams.get("data.id");
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
