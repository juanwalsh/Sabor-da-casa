// Script de teste para verificar o Access Token do Mercado Pago
// Execute: node test-mercadopago.js

const TOKEN = "APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326";

console.log("🔍 Testando Access Token do Mercado Pago...\n");
console.log(`Token: ${TOKEN.substring(0, 20)}...`);
console.log("\n1️⃣ Verificando se o token é válido...\n");

// Teste 1: Verificar se o token é válido
fetch("https://api.mercadopago.com/v1/payment_methods", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  }
})
  .then(res => {
    console.log(`Status: ${res.status} ${res.statusText}`);
    if (res.status === 401) {
      console.log("❌ Token inválido ou expirado!");
      console.log("\n📋 Possíveis causas:");
      console.log("  1. Token é de ambiente de TESTE (use token de PRODUÇÃO)");
      console.log("  2. Token expirou");
      console.log("  3. Token foi revogado");
      console.log("\n🔧 Solução:");
      console.log("  1. Acesse: https://www.mercadopago.com.br/developers/panel");
      console.log("  2. Vá em 'Suas integrações' > 'Credenciais'");
      console.log("  3. Copie o Access Token de PRODUÇÃO");
      console.log("  4. Cole no arquivo .env.local");
      return;
    }
    if (res.ok) {
      console.log("✅ Token válido!");
      return res.json();
    }
  })
  .then(data => {
    if (!data) return;
    console.log(`✅ ${data.length} métodos de pagamento disponíveis\n`);

    // Teste 2: Tentar criar um pagamento PIX de teste
    console.log("2️⃣ Tentando criar pagamento PIX de teste...\n");

    return fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": `test-${Date.now()}`
      },
      body: JSON.stringify({
        transaction_amount: 10.00,
        description: "Teste de integração",
        payment_method_id: "pix",
        payer: {
          email: "teste@email.com",
          first_name: "Cliente",
          last_name: "Teste"
        }
      })
    });
  })
  .then(res => {
    if (!res) return;
    console.log(`Status: ${res.status} ${res.statusText}`);

    if (res.status === 401) {
      console.log("❌ Não autorizado para criar pagamentos!");
      console.log("\n📋 Possíveis causas:");
      console.log("  1. Conta do Mercado Pago não está ativada");
      console.log("  2. Necessário completar verificação da conta");
      console.log("  3. Token não tem permissões de write");
      return;
    }

    return res.json();
  })
  .then(data => {
    if (!data) return;

    if (data.id) {
      console.log(`✅ Pagamento PIX criado com sucesso!`);
      console.log(`ID: ${data.id}`);
      console.log(`Status: ${data.status}`);

      if (data.point_of_interaction?.transaction_data?.qr_code) {
        console.log("\n✅ QR Code gerado com sucesso!");
        console.log(`Código Pix: ${data.point_of_interaction.transaction_data.qr_code.substring(0, 50)}...`);
      }

      console.log("\n🎉 TUDO FUNCIONANDO! Sua integração está pronta.");
    } else if (data.message) {
      console.log(`❌ Erro: ${data.message}`);
      console.log("\nDetalhes:", JSON.stringify(data, null, 2));
    } else {
      console.log("⚠️ Resposta inesperada:");
      console.log(JSON.stringify(data, null, 2));
    }
  })
  .catch(err => {
    console.error("❌ Erro de rede:", err.message);
  });
