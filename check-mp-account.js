import { MercadoPagoConfig, Payment } from 'mercadopago';

const TOKEN = "APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326";

console.log("🔍 Verificando configurações da conta Mercado Pago...\n");

try {
  const client = new MercadoPagoConfig({ accessToken: TOKEN });

  // Teste 1: Verificar se pode criar pagamento direto
  console.log("1️⃣ Testando criação de pagamento PIX direto...");
  const payment = new Payment(client);

  const result = await payment.create({
    body: {
      transaction_amount: 0.01, // Valor mínimo
      description: "Teste ativação Checkout Transparente",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
      }
    }
  });

  console.log("✅ CONTA ATIVADA! Checkout Transparente funciona!");
  console.log("ID:", result.id);
  console.log("QR Code disponível:", result.point_of_interaction?.transaction_data?.qr_code ? "SIM" : "NÃO");

} catch (error) {
  if (error.message.includes("Unauthorized use")) {
    console.log("❌ CONTA NÃO ATIVADA para Checkout Transparente\n");
    console.log("📋 Como ATIVAR:");
    console.log("1. Acesse: https://www.mercadopago.com.br/developers/panel");
    console.log("2. Vá em 'Suas integrações'");
    console.log("3. Clique na sua aplicação");
    console.log("4. Em 'Configurações', ative 'Checkout Transparente'");
    console.log("5. OU entre em contato com suporte: developers@mercadopago.com");
    console.log("\nAlternativamente, você pode usar conta de TESTE:");
    console.log("https://www.mercadopago.com.br/developers/panel/test-users");
  } else {
    console.error("Erro:", error.message);
    if (error.cause) console.error("Detalhes:", error.cause);
  }
}
