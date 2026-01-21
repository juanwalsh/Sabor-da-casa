import { NextResponse } from "next/server";
import { createPixPayment, createCardPayment } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, email, orderId, description, paymentMethod } = body;

    // Normaliza o valor para evitar problemas de floating point (ex: 198.29999999999998)
    // Mercado Pago exige transaction_amount válido com no máximo 2 casas decimais
    const rawAmount = Number(amount);
    const normalizedAmount = Number(rawAmount.toFixed(2));

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valor do pagamento inválido" },
        { status: 400 }
      );
    }

    // Pagamento via PIX
    if (paymentMethod === 'pix') {
      const payment = await createPixPayment({
        amount: normalizedAmount,
        email: email || "comprador@email.com",
        orderId,
        description
      });

      return NextResponse.json({
        success: true,
        method: 'pix',
        qr_code: payment.point_of_interaction?.transaction_data?.qr_code || (payment as any).init_point || '',
        qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64 || null,
        payment_id: payment.id,
        status: payment.status
      });
    }

    // Pagamento via Cartão de Crédito/Débito
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      const { token, installments, paymentMethodId, issuerId, payer } = body;

      if (!token) {
        return NextResponse.json(
          { success: false, error: "Token do cartão não fornecido" },
          { status: 400 }
        );
      }

      const payment = await createCardPayment({
        amount: normalizedAmount,
        email: email || "comprador@email.com",
        orderId,
        description,
        token,
        installments: installments || 1,
        paymentMethodId: paymentMethodId || 'visa',
        issuerId,
        payer
      });

      return NextResponse.json({
        success: true,
        method: 'card',
        payment_id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail
      });
    }

    return NextResponse.json(
      { success: false, error: "Método de pagamento inválido" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Erro ao processar pagamento"
    }, { status: 500 });
  }
}
