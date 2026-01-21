const orderData = {
  amount: 150.00,
  orderId: `order-test-${Date.now()}`,
  paymentMethod: 'pix',
  email: 'teste@cliente.com',
  description: 'Pedido Teste - Sabor da Casa - Total: R$ 150.00'
};

console.log('🧪 TESTE: Criando pagamento no Mercado Pago...\n');
console.log('Dados do pedido:', JSON.stringify(orderData, null, 2), '\n');

fetch('http://localhost:3000/api/payments/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
})
.then(res => res.json())
.then(data => {
  console.log('✅ Resposta da API:\n', JSON.stringify(data, null, 2));

  if (data.success) {
    console.log('\n✅ SUCESSO!');
    console.log('   Payment ID:', data.payment_id);
    console.log('   Checkout URL:', data.qr_code);
    console.log('   Status:', data.status);

    // Testar API de status
    console.log('\n🔄 Testando API de status...');
    return fetch(`http://localhost:3000/api/payments/status?preference_id=${data.payment_id}`);
  } else {
    throw new Error(data.error || 'Falha ao criar pagamento');
  }
})
.then(res => res ? res.json() : null)
.then(statusData => {
  if (statusData) {
    console.log('✅ Status do pagamento:', JSON.stringify(statusData, null, 2));
    console.log('\n✅ TODOS OS TESTES PASSARAM!');
  }
})
.catch(err => {
  console.error('❌ ERRO:', err.message);
  process.exit(1);
});
