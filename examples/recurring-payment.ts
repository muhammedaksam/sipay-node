import Sipay from '../src/index';

async function recurringPaymentExample() {
  const sipay = new Sipay({
    appId: 'your-app-id',
    appSecret: 'your-app-secret',
    merchantKey: 'your-merchant-key',
  });

  try {
    console.log('Querying recurring payment plans...');

    // Query existing recurring plans
    const recurringQuery = await sipay.recurring.query({
      merchant_key: 'your-merchant-key',
      plan_code: 'MONTHLY_PLAN_001',
      app_id: 'your-app-id',
      app_secret: 'your-app-secret',
    });

    console.log('Recurring Query Result:', recurringQuery);

    if (recurringQuery.status_code === 100) {
      console.log('Processing recurring plan...');

      // Process a recurring payment plan
      const planProcess = await sipay.recurring.processPlan({
        merchant_id: 'your-merchant-id',
        plan_code: 'MONTHLY_PLAN_001',
      });

      console.log('Plan Process Result:', planProcess);

      if (planProcess.status_code === 100) {
        console.log('Recurring plan processed successfully!');
      } else {
        console.log('Plan processing failed:', planProcess.status_description);
      }
    }
  } catch (error) {
    console.error('Recurring Payment Error:', error);
  }
}

// Example: Set up a subscription
async function setupSubscription(sipay: Sipay, customerId: string, planCode: string) {
  try {
    console.log('Setting up subscription for customer:', customerId);

    // First, query the plan details
    const planQuery = await sipay.recurring.query({
      merchant_key: 'your-merchant-key',
      plan_code: planCode,
      app_id: 'your-app-id',
      app_secret: 'your-app-secret',
    });

    if (planQuery.status_code !== 100) {
      throw new Error(`Plan query failed: ${planQuery.status_description}`);
    }

    console.log('Plan details:', planQuery.data);

    // Process the subscription
    const subscription = await sipay.recurring.processPlan({
      merchant_id: customerId,
      plan_code: planCode,
    });

    if (subscription.status_code === 100) {
      console.log('Subscription created successfully!');
      return {
        success: true,
        subscriptionId: subscription.data?.subscription_id,
        planDetails: planQuery.data,
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
