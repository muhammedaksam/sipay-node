import Sipay from '../../src/index';
import {
  TEST_CREDENTIALS,
  REAL_TEST_CREDENTIALS,
  TEST_CARDS,
  TEST_URLS,
  generateInvoiceId,
  createTestItems,
} from './test-credentials';

/**
 * Test runner for Sipay SDK with real test credentials
 * Set SIPAY_USE_REAL_TEST=true environment variable to use real test environment
 */

const USE_REAL_TEST_ENV = process.env.SIPAY_USE_REAL_TEST === 'true';

async function runPaymentTests() {
  const credentials = USE_REAL_TEST_ENV ? REAL_TEST_CREDENTIALS : TEST_CREDENTIALS;

  // eslint-disable-next-line no-console
  console.log(`\n🔧 Test Environment: ${credentials.description}`);
  // eslint-disable-next-line no-console
  console.log(`💳 Base URL: ${TEST_URLS.test}`);

  if (USE_REAL_TEST_ENV) {
    // eslint-disable-next-line no-console
    console.log('⚠️  WARNING: Using real test environment - actual charges may occur!');
  }

  const sipay = new Sipay({
    appId: credentials.appKey,
    appSecret: credentials.appSecret,
    merchantKey: credentials.merchantKey,
    baseUrl: TEST_URLS.test,
  });

  try {
    // Test authentication
    // eslint-disable-next-line no-console
    console.log('\n🔐 Testing authentication...');
    await sipay.authenticate();
    const token = sipay.getToken();
    // eslint-disable-next-line no-console
    console.log(`✅ Authentication successful, token length: ${token?.length}`);

    // Test POS information
    // eslint-disable-next-line no-console
    console.log('\n📋 Testing POS information...');
    const visaCard = TEST_CARDS.find((card) => card.type === 'Visa')!;
    const posInfo = await sipay.payments.getPos({
      credit_card: visaCard.number.substring(0, 6),
      amount: '100.00',
      currency_code: 'TRY',
    });
    // eslint-disable-next-line no-console
    console.log(
      `✅ POS Info - Status: ${posInfo.status_code}, Description: ${posInfo.status_description}`
    );

    // Test 2D payment
    // eslint-disable-next-line no-console
    console.log('\n💳 Testing 2D payment with Visa...');
    const invoiceId2D = generateInvoiceId('TEST_2D');
    const payment2D = await sipay.payments.pay2D({
      invoice_id: invoiceId2D,
      invoice_description: 'SDK Test 2D Payment',
      total: 100.0,
      currency_code: 'TRY',
      installments_number: 1,
      items: createTestItems(1, 100.0),
      name: 'Test',
      surname: 'User',
      cc_holder_name: 'Test User',
      cc_no: visaCard.number,
      expiry_month: visaCard.expiry_month,
      expiry_year: visaCard.expiry_year,
      cvv: visaCard.cvv,
      cancel_url: 'https://example.com/cancel',
      return_url: 'https://example.com/success',
      order_type: 'sale',
      ip: '127.0.0.1',
    });
    // eslint-disable-next-line no-console
    console.log(
      `✅ 2D Payment - Status: ${payment2D.status_code}, Description: ${payment2D.status_description}`
    );

    // Test payment status check
    if (payment2D.status_code === 100) {
      // eslint-disable-next-line no-console
      console.log('\n🔍 Testing payment status check...');
      const statusCheck = await sipay.payments.checkStatus({
        invoice_id: invoiceId2D,
      });
      // eslint-disable-next-line no-console
      console.log(
        `✅ Status Check - Status: ${statusCheck.status_code}, Description: ${statusCheck.status_description}`
      );
    }

    // Test 3D payment
    // eslint-disable-next-line no-console
    console.log('\n🔐 Testing 3D payment with Visa...');
    const invoiceId3D = generateInvoiceId('TEST_3D');
    const payment3D = await sipay.payments.pay3D({
      invoice_id: invoiceId3D,
      invoice_description: 'SDK Test 3D Payment',
      total: 150.0,
      currency_code: 'TRY',
      installments_number: 1,
      items: createTestItems(1, 150.0),
      name: 'Test',
      surname: 'User',
      cc_holder_name: 'Test User',
      cc_no: visaCard.number,
      expiry_month: visaCard.expiry_month,
      expiry_year: visaCard.expiry_year,
      cvv: visaCard.cvv,
      cancel_url: 'https://example.com/cancel',
      return_url: 'https://example.com/success',
      order_type: 'sale',
      bill_email: 'test@example.com',
      bill_phone: '+905001234567',
      response_method: 'POST',
      ip: '127.0.0.1',
    });
    // eslint-disable-next-line no-console
    console.log(
      `✅ 3D Payment - Status: ${payment3D.status_code}, Description: ${payment3D.status_description}`
    );
    if (payment3D.status_code === 100) {
      // eslint-disable-next-line no-console
      console.log(
        `🔑 3D Form generated - Use password: "${visaCard.secure_password}" for authentication`
      );
    }

    // Test with MasterCard
    // eslint-disable-next-line no-console
    console.log('\n💳 Testing 2D payment with MasterCard...');
    const masterCard = TEST_CARDS.find((card) => card.type === 'MasterCard')!;
    const masterInvoiceId = generateInvoiceId('TEST_MASTER');
    const masterPayment = await sipay.payments.pay2D({
      invoice_id: masterInvoiceId,
      invoice_description: 'SDK Test MasterCard Payment',
      total: 200.0,
      currency_code: 'TRY',
      installments_number: 1,
      items: createTestItems(1, 200.0),
      name: 'Test',
      surname: 'User',
      cc_holder_name: 'Test User',
      cc_no: masterCard.number,
      expiry_month: masterCard.expiry_month,
      expiry_year: masterCard.expiry_year,
      cvv: masterCard.cvv,
      cancel_url: 'https://example.com/cancel',
      return_url: 'https://example.com/success',
      order_type: 'sale',
      ip: '127.0.0.1',
    });
    // eslint-disable-next-line no-console
    console.log(
      `✅ MasterCard Payment - Status: ${masterPayment.status_code}, Description: ${masterPayment.status_description}`
    );

    // Test with Troy card
    // eslint-disable-next-line no-console
    console.log('\n💳 Testing 2D payment with Troy...');
    const troyCard = TEST_CARDS.find((card) => card.type === 'Troy')!;
    const troyInvoiceId = generateInvoiceId('TEST_TROY');
    const troyPayment = await sipay.payments.pay2D({
      invoice_id: troyInvoiceId,
      invoice_description: 'SDK Test Troy Payment',
      total: 175.0,
      currency_code: 'TRY',
      installments_number: 1,
      items: createTestItems(1, 175.0),
      name: 'Test',
      surname: 'User',
      cc_holder_name: 'Test User',
      cc_no: troyCard.number,
      expiry_month: troyCard.expiry_month,
      expiry_year: troyCard.expiry_year,
      cvv: troyCard.cvv,
      cancel_url: 'https://example.com/cancel',
      return_url: 'https://example.com/success',
      order_type: 'sale',
      ip: '127.0.0.1',
    });
    // eslint-disable-next-line no-console
    console.log(
      `✅ Troy Payment - Status: ${troyPayment.status_code}, Description: ${troyPayment.status_description}`
    );

    // Test installment payment
    // eslint-disable-next-line no-console
    console.log('\n💰 Testing installment payment...');
    const installmentInvoiceId = generateInvoiceId('TEST_INSTALL');
    const installmentPayment = await sipay.payments.pay2D({
      invoice_id: installmentInvoiceId,
      invoice_description: 'SDK Test Installment Payment',
      total: 600.0,
      currency_code: 'TRY',
      installments_number: 3,
      items: createTestItems(1, 600.0),
      name: 'Test',
      surname: 'User',
      cc_holder_name: 'Test User',
      cc_no: visaCard.number,
      expiry_month: visaCard.expiry_month,
      expiry_year: visaCard.expiry_year,
      cvv: visaCard.cvv,
      cancel_url: 'https://example.com/cancel',
      return_url: 'https://example.com/success',
      order_type: 'sale',
      ip: '127.0.0.1',
    });
    // eslint-disable-next-line no-console
    console.log(
      `✅ Installment Payment - Status: ${installmentPayment.status_code}, Description: ${installmentPayment.status_description}`
    );

    // eslint-disable-next-line no-console
    console.log('\n🏁 All tests completed successfully!');
    // eslint-disable-next-line no-console
    console.log('📊 Test Results Summary:');
    // eslint-disable-next-line no-console
    console.log(`   - Authentication: ✅`);
    // eslint-disable-next-line no-console
    console.log(`   - POS Info: ✅ (${posInfo.status_code})`);
    // eslint-disable-next-line no-console
    console.log(`   - 2D Visa: ✅ (${payment2D.status_code})`);
    // eslint-disable-next-line no-console
    console.log(`   - 3D Visa: ✅ (${payment3D.status_code})`);
    // eslint-disable-next-line no-console
    console.log(`   - MasterCard: ✅ (${masterPayment.status_code})`);
    // eslint-disable-next-line no-console
    console.log(`   - Troy: ✅ (${troyPayment.status_code})`);
    // eslint-disable-next-line no-console
    console.log(`   - Installment: ✅ (${installmentPayment.status_code})`);

    if (USE_REAL_TEST_ENV) {
      // eslint-disable-next-line no-console
      console.log('\n⚠️  Remember: Real charges may have occurred in the test environment');
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('\n❌ Test failed:', error.message);
    // eslint-disable-next-line no-console
    console.error('Status Code:', error.status_code);
    // eslint-disable-next-line no-console
    console.error('Status Description:', error.status_description);
    throw error;
  }
}

// Export for use in other files
export { runPaymentTests };

// Run if called directly
if (require.main === module) {
  runPaymentTests().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}
