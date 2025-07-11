import Sipay from '../src/index';

async function brandedSolutionExample() {
  const sipay = new Sipay({
    appId: 'your-app-id',
    appSecret: 'your-app-secret',
    merchantKey: 'your-merchant-key',
  });

  try {
    console.log('Creating branded payment link...');

    const paymentLink = await sipay.brandedSolution.createPaymentLink({
      invoice_id: `BRANDED${Date.now()}`,
      invoice_description: 'Branded Payment Solution',
      total: 500.0,
      currency_code: 'TRY',
      items: [
        {
          name: 'Branded Product',
          price: 500.0,
          qnantity: 1,
          description: 'Product sold through branded solution',
        },
      ],
      name: 'Jane',
      surname: 'Smith',
      return_url: 'https://yoursite.com/payment/success',
      cancel_url: 'https://yoursite.com/payment/cancel',
    });

    console.log('Payment Link Result:', paymentLink);

    if (paymentLink.status_code === 100) {
      console.log('Payment link created successfully!');
      console.log('Redirect customer to:', paymentLink.link);

      const invoiceId = `BRANDED${Date.now()}`;

      // Simulate checking the status later
      setTimeout(async () => {
        try {
          const status = await sipay.brandedSolution.checkStatus({
            invoice_id: invoiceId,
          });

          console.log('Branded Payment Status:', status);
        } catch (error) {
          console.error('Status Check Error:', error);
        }
      }, 5000);
    }
  } catch (error) {
    console.error('Branded Solution Error:', error);
  }
}

// Example webhook handler for branded solutions
async function handleBrandedWebhook(sipay: Sipay, invoiceId: string) {
  try {
    console.log('Handling branded solution webhook...');

    const status = await sipay.brandedSolution.checkStatus({
      invoice_id: invoiceId,
    });

    switch (status.status_code) {
      case 100:
        console.log('Payment completed successfully');
        // Update your database, send confirmation email, etc.
        break;
      case 200:
        console.log('Payment failed');
        // Handle failed payment
        break;
      default:
        console.log('Payment status:', status.status_description);
    }

    return status;
  } catch (error) {
    console.error('Webhook Error:', error);
    throw error;
  }
}

// Run the example
if (require.main === module) {
  brandedSolutionExample().catch(console.error);
}

export { brandedSolutionExample, handleBrandedWebhook };
