import Sipay from '../src/index';

// Example: Webhook handling in an Express.js application
async function handleSalesWebhook() {
  const sipay = new Sipay({
    appId: '6d4a7e9374a76c15260fcc75e315b0b9',
    appSecret: 'b46a67571aa1e7ef5641dc3fa6f1712a',
    merchantKey: '$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO',
  });

  // Example webhook payload received from Sipay
  const webhookPayload = {
    sipay_status: '1',
    order_no: '162754070457149',
    invoice_id: '1627540702924',
    status_code: '100',
    status_description: 'Approved',
    sipay_payment_method: '1',
    credit_card_no: '450803****4509',
    transaction_type: 'Auth',
    payment_status: '1',
    payment_method: '1',
    error_code: '100',
    error: 'Approved',
    status: 'Completed',
    hash_key: '4c63ed8a964ab9a3:f20f:WMnQTMI128rDslYQKRp',
  };

  console.log('🔄 Processing sales webhook...');

  try {
    // Verify and parse the sales webhook using existing validateHashKey utility
    const result = sipay.webhooks.verifySalesWebhook(
      webhookPayload,
      'b46a67571aa1e7ef5641dc3fa6f1712a' // App Secret
    );

    if (!result.isValid) {
      console.error('❌ Webhook verification failed:', result.error);
      return;
    }

    const event = result.event!;
    console.log('✅ Webhook verified successfully');
    console.log('📋 Payment Details:');
    console.log(`   Invoice ID: ${event.invoice_id}`);
    console.log(`   Order No: ${event.order_no}`);
    console.log(`   Amount Status: ${sipay.webhooks.getPaymentStatusDescription(event)}`);

    // Check payment status
    if (sipay.webhooks.isPaymentSuccessful(event)) {
      console.log('💰 Payment completed successfully!');

      if (sipay.webhooks.isPaymentPreAuthorized(event)) {
        console.log('⚠️  Payment is pre-authorized - needs confirmation');
        // Call /api/confirmPayment endpoint here if needed
      } else {
        console.log('✅ Payment amount deducted immediately');
        // Process successful payment (update database, send confirmation email, etc.)
      }
    } else if (sipay.webhooks.isPaymentFailed(event)) {
      console.log('❌ Payment failed:', event.status_description);
      // Handle failed payment (update order status, notify customer, etc.)
    }

    // Additional webhook processing
    console.log(`💳 Card: ${event.credit_card_no}`);
    console.log(`🔄 Transaction Type: ${event.transaction_type}`);
    console.log(`📊 Status Code: ${event.status_code}`);
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
  }
}

// Example: Recurring webhook handling
async function handleRecurringWebhook() {
  const sipay = new Sipay({
    appId: '6d4a7e9374a76c15260fcc75e315b0b9',
    appSecret: 'b46a67571aa1e7ef5641dc3fa6f1712a',
    merchantKey: '$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO',
  });

  // Example recurring webhook payload
  const recurringPayload = {
    merchant_key: '$2y$10$snLdZ5xKfpmP561tpNlfWurcNl8r.r7Jg.w8Fi88PGFiGPQDOlfXO',
    invoice_id: '266011626686877',
    order_id: '162709021159202',
    product_price: 0.1,
    plan_code: '162668699215UOjS',
    recurring_number: '6',
    status: 'Completed',
    attempts: '1',
    action_date: '2021-07-24 03:00:49',
  };

  console.log('🔄 Processing recurring webhook...');

  try {
    const event = sipay.webhooks.parseRecurringWebhook(recurringPayload);

    console.log('✅ Recurring webhook parsed');
    console.log('📋 Recurring Payment Details:');
    console.log(`   Invoice ID: ${event.invoice_id}`);
    console.log(`   Plan Code: ${event.plan_code}`);
    console.log(`   Amount: ${event.product_price}`);
    console.log(`   Status: ${event.status}`);
    console.log(`   Attempt: ${event.attempts}`);
    console.log(`   Recurring Number: ${event.recurring_number}`);

    if (event.status === 'Completed') {
      console.log('💰 Recurring payment completed successfully!');
      // Process successful recurring payment
    } else {
      console.log('❌ Recurring payment failed');
      // Handle failed recurring payment
    }
  } catch (error) {
    console.error('❌ Error processing recurring webhook:', error);
  }
}

// Example: Refund webhook handling
async function handleRefundWebhook() {
  const sipay = new Sipay({
    appId: '6d4a7e9374a76c15260fcc75e315b0b9',
    appSecret: 'b46a67571aa1e7ef5641dc3fa6f1712a',
    merchantKey: '$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO',
  });

  // Example refund webhook payload
  const refundPayload = {
    invoice_id: '8iu75g',
    order_id: '15767887576675',
    amount: 10.5,
    status: 'Completed',
    hash_key: '5uUVKijz5im5FfStic2wVX4gG8ngRfMS3H+FvAauQvOc1nAnh9GZ9T6zyx',
  };

  console.log('🔄 Processing refund webhook...');

  try {
    const event = sipay.webhooks.parseRefundWebhook(refundPayload);

    console.log('✅ Refund webhook parsed');
    console.log('📋 Refund Details:');
    console.log(`   Invoice ID: ${event.invoice_id}`);
    console.log(`   Order ID: ${event.order_id}`);
    console.log(`   Amount: ${event.amount}`);
    console.log(`   Status: ${event.status}`);

    if (event.status === 'Completed') {
      console.log('💸 Refund completed successfully!');
      // Process successful refund (update order status, notify customer, etc.)
    } else {
      console.log('❌ Refund failed');
      // Handle failed refund
    }
  } catch (error) {
    console.error('❌ Error processing refund webhook:', error);
  }
}

// Express.js webhook endpoint example
function expressWebhookExample() {
  try {
    const express = require('express');
    const app = express();

    app.use(express.json());

    // Sales webhook endpoint
    app.post('/webhooks/sipay/sales', async (req, res) => {
      try {
        const sipay = new Sipay({
          appId: process.env.SIPAY_APP_ID!,
          appSecret: process.env.SIPAY_APP_SECRET!,
          merchantKey: process.env.SIPAY_MERCHANT_KEY!,
        });

        const result = sipay.webhooks.verifySalesWebhook(req.body, process.env.SIPAY_APP_SECRET!);

        if (!result.isValid) {
          console.error('Invalid webhook signature');
          return res.status(400).json({ error: 'Invalid signature' });
        }

        const event = result.event!;

        // Process the webhook event
        if (sipay.webhooks.isPaymentSuccessful(event)) {
          // Handle successful payment
          console.log(`Payment successful for invoice ${event.invoice_id}`);
        }

        res.status(200).json({ status: 'success' });
      } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    console.log('📝 Express webhook endpoints configured (example code shown)');
  } catch {
    console.log('⚠️  Express not installed - skipping Express example');
    console.log('💡 To use Express integration, install express: npm install express');
    console.log('📝 Express webhook endpoint example available in source code');
  }
} // Run examples
async function runExamples() {
  console.log('🚀 Running Sipay Webhook Examples...\n');

  await handleSalesWebhook();
  console.log('\n' + '='.repeat(60) + '\n');

  await handleRecurringWebhook();
  console.log('\n' + '='.repeat(60) + '\n');

  await handleRefundWebhook();
  console.log('\n' + '='.repeat(60) + '\n');

  expressWebhookExample();
}

if (require.main === module) {
  runExamples().catch(console.error);
}

export { runExamples };
