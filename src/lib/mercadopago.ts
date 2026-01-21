import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// Configura o cliente do Mercado Pago usando SDK oficial
const client = MERCADO_PAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({ accessToken: MERCADO_PAGO_ACCESS_TOKEN })
  : null;

interface PaymentData {
  amount: number;
  email: string;
  orderId: string;
  description: string;
}

interface CardPaymentData extends PaymentData {
  token: string;
  installments: number;
  paymentMethodId: string;
  issuerId?: string;
  payer?: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

/**
 * Cria pagamento PIX - tenta Checkout Transparente primeiro (QR Code direto),
 * se não funcionar usa Preference (redireciona para MP)
 */
export async function createPixPayment(data: PaymentData) {
  if (!client) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado no .env.local");
  }

  // TENTA CHECKOUT TRANSPARENTE (QR Code direto no site)
  try {
    console.log("[MP SDK] Tentando Checkout Transparente (QR Code direto)...");
    const payment = new Payment(client);

    const paymentData = {
      transaction_amount: data.amount,
      description: data.description,
      payment_method_id: "pix",
      payer: {
        email: data.email,
        first_name: "Cliente",
        last_name: "Restaurante"
      },
      external_reference: data.orderId,
      notification_url: process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost')
        ? undefined
        : `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`
    };

    const result = await payment.create({ body: paymentData });

    console.log("[MP SDK] ✅ Checkout Transparente funcionou!");
    console.log("[MP SDK] ID:", result.id);
    console.log("[MP SDK] QR Code:", result.point_of_interaction?.transaction_data?.qr_code ? "Disponível" : "N/A");

    return result; // Retorna Payment com QR Code direto
  } catch (error: any) {
    // Se falhar (conta não ativada), usa Preference
    if (error.message?.includes("Unauthorized use")) {
      console.log("[MP SDK] ⚠️ Checkout Transparente não disponível, usando Preference...");

      const preference = new Preference(client);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const preferenceData: any = {
        items: [
          {
            id: data.orderId,
            title: data.description,
            quantity: 1,
            unit_price: data.amount,
            currency_id: "BRL"
          }
        ],
        payer: {
          email: data.email,
          name: "Cliente",
          surname: "Restaurante"
        },
        payment_methods: {
          // ACEITA TODOS OS MÉTODOS: PIX, Cartão Crédito, Débito, Boleto
          installments: 12, // Até 12x no cartão
          default_installments: 1
        },
        external_reference: data.orderId,
        statement_descriptor: "SABOR DA CASA"
      };

      // Adiciona URLs apenas se não for localhost
      if (!siteUrl.includes('localhost')) {
        preferenceData.notification_url = `${siteUrl}/api/webhooks/mercadopago`;
        preferenceData.back_urls = {
          success: `${siteUrl}/checkout?status=success`,
          failure: `${siteUrl}/checkout?status=failure`,
          pending: `${siteUrl}/checkout?status=pending`
        };
        preferenceData.auto_return = "approved";
      }

      const result = await preference.create({ body: preferenceData });

      console.log("[MP SDK] ✅ Preference criada (fallback)");
      console.log("[MP SDK] ID:", result.id);

      // Retorna no formato compatível
      return {
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        status: "pending",
        point_of_interaction: {
          transaction_data: {
            qr_code: result.init_point, // URL para redirecionar
            qr_code_base64: null, // Não disponível em Preference
            ticket_url: result.init_point
          }
        }
      };
    } else {
      // Outro erro, propaga
      throw error;
    }
  }
}

export async function createCardPayment(data: CardPaymentData) {
  if (!client) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado no .env.local");
  }

  console.log("[MP SDK] Criando pagamento com cartão para:", data.orderId);

  try {
    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: data.amount,
        token: data.token,
        description: data.description,
        installments: data.installments,
        payment_method_id: data.paymentMethodId,
        issuer_id: data.issuerId ? Number(data.issuerId) : undefined,
        payer: data.payer || {
          email: data.email
        },
        external_reference: data.orderId,
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`
      }
    });

    console.log("[MP SDK] ✅ Pagamento com cartão criado:", result.id);
    return result;
  } catch (error: any) {
    console.error("[MP SDK Erro Cartão]:", error);
    throw new Error(error.message || "Falha ao processar pagamento com cartão");
  }
}

export async function getPaymentStatus(id: string | number) {
  if (!client) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado");
  }

  try {
    const payment = new Payment(client);
    const result = await payment.get({ id: String(id) });
    return result;
  } catch (error: any) {
    console.error("[MP SDK] Erro ao buscar pagamento:", error);
    throw error;
  }
}
