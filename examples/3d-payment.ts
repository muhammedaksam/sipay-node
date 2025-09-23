import Sipay from '../src/index';

async function threeDPaymentExample() {
  const sipay = new Sipay({
    appId: 'your-app-id',
    appSecret: 'your-app-secret',
    merchantKey: 'your-merchant-key',
  });

  try {
    console.log('Processing 3D Secure payment...');

    const payment3D = await sipay.payments.pay3D({
      cc_holder_name: 'John Doe',
      cc_no: '4111111111111111',
      expiry_month: '12',
      expiry_year: '2025',
      currency_code: 'TRY',
      installments_number: 1,
      invoice_id: `INV3D${Date.now()}`,
      invoice_description: 'Test 3D Secure Payment',
      total: 250.0,
      items: [
        {
          name: 'Premium Product',
          price: 250.0,
          qnantity: 1,
          description: 'Premium product with 3D Secure',
        },
      ],
      name: 'John',
      surname: 'Doe',
      return_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      order_type: 'sale',
      bill_email: 'john@example.com',
      bill_phone: '+905001234567',
      response_method: 'POST',
      ip: '127.0.0.1',
    });

    console.log('3D Payment Result:', payment3D);

    // In a real application, you would render this HTML form
    // The form will automatically redirect to the 3D Secure page
    if (payment3D.status_code === 100) {
      console.log('3D Secure form generated successfully');
      console.log('You should render this HTML in the browser:');
      console.log(payment3D.data);
    }
  } catch (error) {
    console.error('3D Payment Error:', error);
  }
}

// Example of handling 3D Secure callback
async function handle3DCallback(sipay: Sipay, invoiceId: string) {
  try {
    console.log('Handling 3D Secure callback...');

    const status = await sipay.payments.checkStatus({
      invoice_id: invoiceId,
    });

    if (status.status_code === 100) {
      console.log('3D Secure payment completed successfully');
      return { success: true, data: status.data };
    } else {
      console.log('3D Secure payment failed:', status.status_description);
      return { success: false, error: status.status_description };
    }
  } catch (error) {
    console.error('3D Callback Error:', error);
    return { success: false, error: error.message };
  }
}

// Run the example
if (require.main === module) {
  threeDPaymentExample().catch(console.error);
}

export { threeDPaymentExample, handle3DCallback };
