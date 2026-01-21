import { MercadoPagoConfig, Preference } from 'mercadopago';

const TOKEN = "APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326";

console.log("🔍 Testando Preference (como Pixel Link)...\n");

try {
  const client = new MercadoPagoConfig({ accessToken: TOKEN });
  const preference = new Preference(client);

  console.log("✅ Cliente configurado");
  console.log("⏳ Criando Preference para PIX...\n");

  const result = await preference.create({
    body: {
      items: [
        {
          id: 'test-123',
          title: 'Teste Restaurante - PIX',
          quantity: 1,
          unit_price: 10.00,
          currency_id: 'BRL'
        }
      ],
      payment_methods: {
        excluded_payment_types: [
          { id: 'credit_card' },
          { id: 'debit_card' },
          { id: 'ticket' }
        ]
      }
    }
  });

  console.log("✅ SUCESSO! Preference criada:");
  console.log("ID:", result.id);
  console.log("URL de Pagamento:", result.init_point);
  console.log("\n🎉 Funcionando! Este método é compatível com sua conta.");

} catch (error) {
  console.error("❌ Erro:", error.message);
  if (error.cause) {
    console.error("Detalhes:", JSON.stringify(error.cause, null, 2));
  }
}
