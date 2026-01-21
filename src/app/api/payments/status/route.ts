import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const client = process.env.MERCADO_PAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN })
  : null;

/**
 * Consulta o status de um pagamento no Mercado Pago
 * Usado para polling/monitoramento após checkout externo
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const preferenceId = searchParams.get('preference_id');
    const paymentId = searchParams.get('payment_id');

    if (!client) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 500 }
      );
    }

    // Se tem payment_id, consulta direto
    if (paymentId) {
      const payment = new Payment(client);
      const result = await payment.get({ id: paymentId });

      return NextResponse.json({
        success: true,
        payment_id: result.id,
        status: result.status,
        status_detail: result.status_detail,
        transaction_amount: result.transaction_amount,
        date_approved: result.date_approved,
        external_reference: result.external_reference
      });
    }

    // Se tem preference_id, busca pagamentos relacionados
    if (preferenceId) {
      try {
        const payment = new Payment(client);

        // Busca pagamentos recentes (últimos 30 dias)
        const searchResult = await payment.search({
          options: {
            criteria: 'desc',
            range: 'date_created',
            begin_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: new Date().toISOString()
          }
        });

        // Filtra por preference_id (via metadata ou external_reference)
        const relatedPayments = searchResult.results?.filter((p: any) =>
          p.metadata?.preference_id === preferenceId ||
          p.external_reference?.includes(preferenceId)
        ) || [];

        if (relatedPayments.length > 0) {
          const latestPayment = relatedPayments[0];
          return NextResponse.json({
            success: true,
            payment_id: latestPayment.id,
            status: latestPayment.status,
            status_detail: latestPayment.status_detail,
            transaction_amount: latestPayment.transaction_amount,
            date_approved: latestPayment.date_approved,
            external_reference: latestPayment.external_reference
          });
        }

        // Nenhum pagamento encontrado ainda
        return NextResponse.json({
          success: true,
          status: 'pending',
          message: 'Aguardando pagamento'
        });

      } catch (searchError) {
        console.error("[MP] Erro ao buscar pagamentos:", searchError);

        // Se busca falhar, retorna status desconhecido
        return NextResponse.json({
          success: true,
          status: 'unknown',
          message: 'Não foi possível verificar status'
        });
      }
    }

    return NextResponse.json(
      { error: "preference_id ou payment_id é obrigatório" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("[Payment Status] Erro:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Erro ao consultar status"
    }, { status: 500 });
  }
}
