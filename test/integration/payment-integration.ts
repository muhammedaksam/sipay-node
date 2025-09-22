import Sipay from '../../src/index';
import {
  TEST_CREDENTIALS,
  REAL_TEST_CREDENTIALS,
  TEST_CARDS,
  CURRENCY_TEST_CARD,
  TEST_URLS,
  generateInvoiceId,
  createTestItems,
} from './test-credentials';

const USE_REAL_TEST_ENV = process.env.SIPAY_USE_REAL_TEST === 'true';

describe('Sipay Integration Tests', () => {
  let sipay: Sipay;
  let credentials: typeof TEST_CREDENTIALS;

  beforeAll(() => {
    credentials = USE_REAL_TEST_ENV ? REAL_TEST_CREDENTIALS : TEST_CREDENTIALS;

    sipay = new Sipay({
      appId: credentials.appKey,
      appSecret: credentials.appSecret,
      merchantKey: credentials.merchantKey,
      baseUrl: TEST_URLS.test,
    });
  });

  describe('Authentication', () => {
    test('should authenticate successfully', async () => {
      await expect(sipay.authenticate()).resolves.not.toThrow();

      const token = sipay.getToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      if (token) {
        expect(token.length).toBeGreaterThan(0);
      }
    });
  });

  describe('POS Information', () => {
    test('should get POS information for Visa card', async () => {
      const visaCard = TEST_CARDS.find((card) => card.type === 'Visa')!;

      const result = await sipay.payments.getPos({
        credit_card: visaCard.number.substring(0, 6),
        amount: '100.00',
        currency_code: 'TRY',
      });

      expect(result).toBeDefined();
      expect(result.status_code).toBeDefined();
    });
  });

  describe('2D Payments', () => {
    test('should process 2D payment with Visa card', async () => {
      const visaCard = TEST_CARDS.find((card) => card.type === 'Visa')!;
      const invoiceId = generateInvoiceId('2D_VISA');

      const payment = await sipay.payments.pay2D({
        invoice_id: invoiceId,
        invoice_description: 'Test 2D Visa Payment',
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
      });

      expect(payment).toBeDefined();
      expect(payment.status_code).toBeDefined();
    });
  });

  describe('Currency Test Card', () => {
    test('should handle currency test card', async () => {
      const invoiceId = generateInvoiceId('CURRENCY');

      const payment = await sipay.payments.pay2D({
        invoice_id: invoiceId,
        invoice_description: 'Currency Test Card Payment',
        total: 125.0,
        currency_code: 'TRY',
        installments_number: 1,
        items: createTestItems(1, 125.0),
        name: 'Test',
        surname: 'User',
        cc_holder_name: 'Test User',
        cc_no: CURRENCY_TEST_CARD.number,
        expiry_month: CURRENCY_TEST_CARD.expiry_month,
        expiry_year: CURRENCY_TEST_CARD.expiry_year,
        cvv: CURRENCY_TEST_CARD.cvv,
      });

      expect(payment).toBeDefined();
      expect(payment.status_code).toBeDefined();
    });
  });
});
