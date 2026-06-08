import { BrandedSolution } from '../src/resources/branded-solution';
import { SipayHttpClient } from '../src/utils/http-client';
import { BrandedSolutionRequest } from '../src/types';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('BrandedSolution Resource', () => {
  let brandedSolution: BrandedSolution;
  let mockHttpClient: jest.Mocked<SipayHttpClient>;

  beforeEach(() => {
    mockHttpClient = new SipayHttpClient({
      appId: 'test_app_id',
      appSecret: 'test_app_secret',
      merchantKey: 'test_merchant_key',
    }) as jest.Mocked<SipayHttpClient>;

    // Mock HTTP client methods
    mockHttpClient.post = jest.fn();

    // Mock the config property that addMerchantKey accesses
    (mockHttpClient as any)['config'] = {
      merchantKey: 'test_merchant_key',
    };

    brandedSolution = new BrandedSolution(mockHttpClient);
  });

  describe('createPaymentLink', () => {
    it('should create a payment link with invoice JSON', async () => {
      const linkData: Omit<BrandedSolutionRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
        total: 100.0,
        currency_code: 'TRY',
        invoice_description: 'Test product',
        name: 'John',
        surname: 'Doe',
        items: [
          {
            name: 'Test Item',
            price: 100.0,
            quantity: 1,
            description: 'Test description',
          },
        ],
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { link: 'https://payment.sipay.com.tr/link123' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await brandedSolution.createPaymentLink(linkData);

      // Verify the invoice JSON was built correctly
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/purchase/link',
        expect.objectContaining({
          merchant_key: 'test_merchant_key',
          currency_code: 'TRY',
          name: 'John',
          surname: 'Doe',
          invoice: expect.any(String),
        }),
        undefined
      );

      // Verify invoice JSON content
      const callArg = (mockHttpClient.post as jest.Mock).mock.calls[0][1];
      const parsedInvoice = JSON.parse(callArg.invoice);
      expect(parsedInvoice.invoice_id).toBe('INV123');
      expect(parsedInvoice.total).toBe('100.00');
      expect(parsedInvoice.invoice_description).toBe('Test product');
      expect(parsedInvoice.items).toHaveLength(1);
      expect(parsedInvoice.return_url).toBe('https://example.com/return');
      expect(parsedInvoice.cancel_url).toBe('https://example.com/cancel');

      expect(result).toEqual(mockResponse);
    });

    it('should include optional top-level parameters', async () => {
      const linkData: Omit<BrandedSolutionRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
        total: 100.0,
        currency_code: 'TRY',
        invoice_description: 'Test product',
        name: 'John',
        surname: 'Doe',
        items: [
          {
            name: 'Test Item',
            price: 100.0,
            quantity: 1,
            description: 'Test description',
          },
        ],
        max_installment: 12,
        sale_web_hook_key: 'hook_key',
        order_type: 1,
        app_lang: 'en',
        show_installment_table: true,
        is_comission_from_user: 1,
      };

      mockHttpClient.post.mockResolvedValue({
        status_code: 100,
        status_description: 'Success',
        data: { link: 'https://payment.sipay.com.tr/link123' },
      });

      await brandedSolution.createPaymentLink(linkData);

      const callArg = (mockHttpClient.post as jest.Mock).mock.calls[0][1];
      expect(callArg.max_installment).toBe(12);
      expect(callArg.sale_web_hook_key).toBe('hook_key');
      expect(callArg.order_type).toBe(1);
      expect(callArg.app_lang).toBe('en');
      expect(callArg.show_installment_table).toBe(true);
      expect(callArg.is_comission_from_user).toBe(1);
    });

    it('should include recurring and commission fields in invoice and request', async () => {
      const linkData: Omit<BrandedSolutionRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
        total: 100.0,
        currency_code: 'TRY',
        invoice_description: 'Test product',
        name: 'John',
        surname: 'Doe',
        items: [
          {
            name: 'Test Item',
            price: 100.0,
            quantity: 1,
            description: 'Test description',
          },
        ],
        commission_for_installment: '2',
        recurring_payment_number: 5,
        recurring_payment_cycle: 'M',
        recurring_payment_interval: '1',
        recurring_web_hook_key: 'recurring_hook',
      };

      mockHttpClient.post.mockResolvedValue({
        status_code: 100,
        status_description: 'Success',
      });

      await brandedSolution.createPaymentLink(linkData);

      const callArg = (mockHttpClient.post as jest.Mock).mock.calls[0][1];
      // Top-level recurring params
      expect(callArg.recurring_payment_number).toBe(5);
      expect(callArg.recurring_payment_cycle).toBe('M');
      expect(callArg.recurring_payment_interval).toBe('1');
      expect(callArg.recurring_web_hook_key).toBe('recurring_hook');
      expect(callArg.commission_for_installment).toBe('2');
      // Invoice JSON should also contain commission_for_installment
      const parsedInvoice = JSON.parse(callArg.invoice);
      expect(parsedInvoice.commission_for_installment).toBe('2');
    });

    it('should include billing address, discount, coupon, and response_method in invoice', async () => {
      const linkData: Omit<BrandedSolutionRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
        total: 100.0,
        currency_code: 'TRY',
        invoice_description: 'Test product',
        name: 'John',
        surname: 'Doe',
        items: [
          {
            name: 'Test Item',
            price: 100.0,
            quantity: 1,
            description: 'Test description',
          },
        ],
        discount: 10,
        coupon: 'SAVE10',
        response_method: 'POST',
        bill_address1: '123 Main St',
        bill_address2: 'Apt 4',
        bill_city: 'Istanbul',
        bill_postcode: '34000',
        bill_state: 'Istanbul',
        bill_country: 'TR',
        bill_email: 'john@example.com',
        bill_phone: '5551234567',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel',
      };

      mockHttpClient.post.mockResolvedValue({
        status_code: 100,
        status_description: 'Success',
      });

      await brandedSolution.createPaymentLink(linkData);

      const callArg = (mockHttpClient.post as jest.Mock).mock.calls[0][1];
      const parsedInvoice = JSON.parse(callArg.invoice);
      expect(parsedInvoice.discount).toBe(10);
      expect(parsedInvoice.coupon).toBe('SAVE10');
      expect(parsedInvoice.response_method).toBe('POST');
      expect(parsedInvoice.bill_address1).toBe('123 Main St');
      expect(parsedInvoice.bill_address2).toBe('Apt 4');
      expect(parsedInvoice.bill_city).toBe('Istanbul');
      expect(parsedInvoice.bill_postcode).toBe('34000');
      expect(parsedInvoice.bill_state).toBe('Istanbul');
      expect(parsedInvoice.bill_country).toBe('TR');
      expect(parsedInvoice.bill_email).toBe('john@example.com');
      expect(parsedInvoice.bill_phone).toBe('5551234567');
    });

    it('should handle link creation errors', async () => {
      const linkData: Omit<BrandedSolutionRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
        total: 100.0,
        currency_code: 'TRY',
        invoice_description: 'Test product',
        name: 'John',
        surname: 'Doe',
        items: [
          {
            name: 'Test Item',
            price: 100.0,
            quantity: 1,
            description: 'Test description',
          },
        ],
      };

      const mockError = new Error('Link creation failed');
      mockHttpClient.post.mockRejectedValue(mockError);

      await expect(brandedSolution.createPaymentLink(linkData)).rejects.toThrow(
        'Link creation failed'
      );
    });
  });

  describe('error handling', () => {
    it('should handle create payment link errors', async () => {
      const linkData: Omit<BrandedSolutionRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        currency_code: 'TRY',
        items: [
          {
            name: 'Test Item',
            price: 100.0,
            quantity: 1,
            description: 'Test description',
          },
        ],
        name: 'John',
        surname: 'Doe',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel',
      };

      const mockError = new Error('Link creation failed');
      mockHttpClient.post.mockRejectedValue(mockError);

      await expect(brandedSolution.createPaymentLink(linkData)).rejects.toThrow(
        'Link creation failed'
      );
    });
  });
});
