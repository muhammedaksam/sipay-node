import Sipay from '../src/index';

async function recurringPaymentExample() {
  const sipay = new Sipay({
    appId: 'your-app-id',
    appSecret: 'your-app-secret',
    merchantKey: 'your-merchant-key',
  });

  try {
    console.log('Creating a recurring payment...');

    // Recurring payments are created using regular pay2D or pay3D methods
    // with additional recurring parameters
    const recurringPayment = await sipay.payments.pay2D({
      cc_holder_name: 'John Doe',
      cc_no: '4111111111111111',
      expiry_month: '12',
      expiry_year: '2025',
      cvv: '123',
      currency_code: 'TRY',
      installments_number: 1,
      invoice_id: `RECURRING_${Date.now()}`,
      invoice_description: 'Monthly Subscription Payment',
      total: 100.0,
      items: [
        {
          name: 'Monthly Subscription',
          price: 100.0,
          qnantity: 1,
          description: 'Monthly subscription service',
        },
      ],
      name: 'John',
      surname: 'Doe',
      return_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      order_type: '1', // Enable recurring (1 for recurring, 0 for normal)
      ip: '127.0.0.1',
      // Recurring payment specific parameters
      recurring_payment_number: 12, // 12 payments total
      recurring_payment_cycle: 'M', // Monthly (M = Month, D = Day, Y = Year)
      recurring_payment_interval: '1', // Every 1 month
      recurring_web_hook_key: 'your-webhook-key', // For status notifications
    });

    console.log('Recurring Payment Result:', recurringPayment);

    if (recurringPayment.status_code === 100) {
      console.log('Recurring payment setup successful!');
      console.log('Recurring plan will charge every month for 12 months');
    } else {
      console.log('Recurring payment failed:', recurringPayment.status_description);
    }
  } catch (error) {
    console.error('Recurring Payment Error:', error);
  }
}

// Example: Set up a subscription using recurring parameters
async function setupSubscription(sipay: Sipay, customerId: string, planCode: string) {
  try {
    console.log('Setting up subscription for customer:', customerId);

    // Create a recurring payment using pay2D with recurring parameters
    const subscription = await sipay.payments.pay2D({
      cc_holder_name: 'Customer Name',
      cc_no: '4111111111111111',
      expiry_month: '12',
      expiry_year: '2025',
      cvv: '123',
      currency_code: 'TRY',
      installments_number: 1,
      invoice_id: `SUB_${planCode}_${Date.now()}`,
      invoice_description: `Subscription: ${planCode}`,
      total: 100.0,
      items: [
        {
          name: 'Monthly Subscription',
          price: 100.0,
          qnantity: 1,
          description: 'Monthly subscription service',
        },
      ],
      name: 'Customer',
      surname: 'Name',
      return_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      order_type: '1', // Enable recurring
      ip: '127.0.0.1',
      // Recurring parameters
      recurring_payment_number: 12,
      recurring_payment_cycle: 'M',
      recurring_payment_interval: '1',
      recurring_web_hook_key: 'your-webhook-key',
    });

    if (subscription.status_code === 100) {
      console.log('Subscription created successfully!');
      return {
        success: true,
        subscriptionId: subscription.data?.order_no,
        planDetails: { planCode, customerId },
      };
    } else {
      throw new Error(`Subscription failed: ${subscription.status_description}`);
    }
  } catch (error) {
    console.error('Subscription Setup Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Example: Cancel subscription (requires additional API endpoint)
async function cancelSubscription(sipay: Sipay, subscriptionId: string) {
  try {
    console.log('Cancelling subscription:', subscriptionId);

    // Note: This would require additional API endpoint from Sipay
    // This is a placeholder for the cancellation logic
    console.log('Subscription cancellation would be processed here');

    return { success: true };
  } catch (error) {
    console.error('Subscription Cancellation Error:', error);
    return { success: false, error: error.message };
  }
}

// Run the example
if (require.main === module) {
  recurringPaymentExample().catch(console.error);
}

export { recurringPaymentExample, setupSubscription, cancelSubscription };
