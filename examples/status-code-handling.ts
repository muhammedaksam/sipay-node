/**
 * Example: Using Sipay Status Code Utilities
 *
 * This example demonstrates how to use the comprehensive status code
 * utilities provided by the Sipay SDK.
 */

import Sipay, {
  SipayStatusCode,
  getStatusCodeInfo,
  getSuggestedAction,
} from '@muhammedaksam/sipay-node';

const sipay = new Sipay({
  appId: 'your-app-id',
  appSecret: 'your-app-secret',
  merchantKey: 'your-merchant-key',
});

async function makePaymentWithErrorHandling() {
  try {
    const response = await sipay.payments.pay2D({
      cc_holder_name: 'John Doe',
      cc_no: '4111111111111111',
      expiry_month: '12',
      expiry_year: '2025',
      cvv: '123',
      currency_code: 'TRY',
      installments_number: 1,
      invoice_id: 'INV-12345',
      invoice_description: 'Test Payment',
      total: 100.0,
      order_type: 'Sale',
      cancel_url: 'https://example.com/cancel',
      return_url: 'https://example.com/return',
      ip: '127.0.0.1',
      items: [
        {
          name: 'Test Product',
          price: 100.0,
          qnantity: 1, // Note: API uses 'qnantity' (original typo)
          description: 'Test product description',
        },
      ],
      name: 'John',
      surname: 'Doe',
    });

    if (response.status_code === SipayStatusCode.SUCCESSFUL) {
      console.log('✅ Payment successful!');
      console.log('Order ID:', response.data?.order_id);
    } else {
      // Use status code utilities for detailed error information
      const statusInfo = getStatusCodeInfo(response.status_code);
      const suggestion = getSuggestedAction(response.status_code);

      console.log('❌ Payment failed:');
      console.log('Status Code:', statusInfo.code);
      console.log('Description:', statusInfo.description);
      console.log('Category:', statusInfo.category);
      console.log('Suggestion:', suggestion);

      // Handle retryable errors
      if (statusInfo.isRetryable) {
        console.log('🔄 This error is retryable - you can try again after a delay');
        // Implement retry logic here
      }
    }
  } catch (error) {
    console.error('💥 SDK Error:', error.message);

    if (error.status_code) {
      const statusInfo = getStatusCodeInfo(error.status_code);
      const suggestion = getSuggestedAction(error.status_code);

      console.log('Error Details:');
      console.log('- Status Code:', statusInfo.code);
      console.log('- Category:', statusInfo.category);
      console.log('- HTTP Equivalent:', statusInfo.httpEquivalent);
      console.log('- Suggested Action:', suggestion);
    }
  }
}

// Example of checking specific error types
function handleSpecificErrors(statusCode: number) {
  const statusInfo = getStatusCodeInfo(statusCode);

  switch (statusInfo.category) {
    case 'validation_error':
      console.log('🔍 Validation Error - Check your request parameters');
      break;

    case 'card_error':
      console.log('💳 Card Error - Try a different card');
      break;

    case 'merchant_error':
      console.log('🏪 Merchant Error - Contact your payment provider');
      break;

    case 'hash_error':
      console.log('🔐 Hash Error - Verify your hash key generation');
      break;

    default:
      console.log('⚠️ Other Error - Check the suggestion:', getSuggestedAction(statusCode));
  }
}

export { makePaymentWithErrorHandling, handleSpecificErrors };
