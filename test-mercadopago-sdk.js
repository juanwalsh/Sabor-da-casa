// Script de teste usando SDK oficial do Mercado Pago
// Execute: node test-mercadopago-sdk.js

import { MercadoPagoConfig, Payment } from 'mercadopago';

const TOKEN = "APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326";

console.log("🔍 Testando Access Token com SDK oficial do Mercado Pago...\n");
console.log(`Token: ${TOKEN.substring(0, 20)}...`);

try {
  // Configura o cliente
  const client = new MercadoPagoConfig({ accessToken: TOKEN });
  const payment = new Payment(client);

  console.log("\n1️⃣ Cliente SDK configurado com sucesso!");
  console.log("\n2️⃣ Tentando criar pagamento PIX de teste...\n");

  // Tenta criar um pagamento PIX
  const result = await payment.create({
    body: {
      transaction_amount: 10.00,
      description: "Teste SDK - Integração Restaurante",
      payment_method_id: "pix",
      payer: {
        email: "teste@sabordacasa.com.br",
        first_name: "Cliente",
        last_name: "Teste"
      }
    }
  });

  console.log("✅ SUCESSO! Pagamento PIX criado com SDK oficial!");
  console.log(`\nID: ${result.id}`);
  console.log(`Status: ${result.status}`);

  if (result.point_of_interaction?.transaction_data?.qr_code) {
    console.log("\n✅ QR Code gerado com sucesso!");
    console.log(`Código Pix: ${result.point_of_interaction.transaction_data.qr_code.substring(0, 50)}...`);
    console.log(`\nQR Code Base64 disponível: ${result.point_of_interaction.transaction_data.qr_code_base64 ? 'SIM' : 'NÃO'}`);
  }

  console.log("\n🎉 TUDO FUNCIONANDO! Sua integração está pronta com o SDK oficial.");
  console.log("\n📝 Próximos passos:");
  console.log("  1. Reinicie o servidor: npm run dev");
  console.log("  2. Teste no site: http://localhost:3000");
  console.log("  3. Faça um pedido e escolha PIX");

} catch (error) {
  console.error("\n❌ ERRO ao criar pagamento:");
  console.error("Message:", error.message);

  if (error.cause) {
    console.error("\nDetalhes:", JSON.stringify(error.cause, null, 2));
  }

  console.log("\n📋 Possíveis soluções:");
  console.log("  1. Verifique se o token é de PRODUÇÃO (começa com APP_USR-)");
  console.log("  2. Acesse: https://www.mercadopago.com.br/developers/panel");
  console.log("  3. Complete a verificação da conta se necessário");
  console.log("  4. Ative 'Checkout Transparente' nas configurações");
}
