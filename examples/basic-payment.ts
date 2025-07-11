import Sipay from '../src/index';

async function basicPaymentExample() {
  const sipay = new Sipay({
    appId: 'your-app-id',
    appSecret: 'your-app-secret',
    merchantKey: 'your-merchant-key',
  });

  try {
    // Example 1: 2D Payment
    console.log('Processing 2D payment...');

    const payment2D = await sipay.payments.pay2D({
      cc_holder_name: 'John Doe',
      cc_no: '4111111111111111',
      expiry_month: '12',
      expiry_year: '2025',
      cvv: '123',
      currency_code: 'TRY',
      installments_number: 1,
      invoice_id: `INV${Date.now()}`,
      invoice_description: 'Test 2D Payment',
      total: 100.0,
      items: [
        {
          name: 'Test Product',
          price: 100.0,
          qnantity: 1,
          description: 'Test product description',
        },
      ],
      name: 'John',
      surname: 'Doe',
    });

    console.log('2D Payment Result:', payment2D);

    // Example 2: Get POS Information
    console.log('Getting POS information...');

    const posInfo = await sipay.payments.getPos({
      credit_card: '411111',
      amount: '100.00',
      currency_code: 'TRY',
    });

    console.log('POS Info:', posInfo);

    // Example 3: Check Payment Status
    if (payment2D.status_code === 100) {
      console.log('Checking payment status...');

      const status = await sipay.payments.checkStatus({
        invoice_id: payment2D.data?.invoice_id || `INV${Date.now()}`,
      });

      console.log('Payment Status:', status);
    }
  } catch (error) {
    console.error('Payment Error:', error);
  }
}

// Run the example
if (require.main === module) {
  basicPaymentExample().catch(console.error);
}

export default basicPaymentExample;
