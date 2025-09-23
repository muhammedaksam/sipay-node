import { PaymentCompletion } from '../src/resources/payment-completion';
import { SipayHttpClient } from '../src/utils/http-client';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('PaymentCompletion Resource', () => {
  let paymentCompletion: PaymentCompletion;
  let mockHttpClient: jest.Mocked<SipayHttpClient>;

  beforeEach(() => {
    mockHttpClient = new SipayHttpClient({
      appId: 'test_app_id',
      appSecret: 'test_app_secret',
      merchantKey: 'test_merchant_key',
    }) as jest.Mocked<SipayHttpClient>;

    // Mock HTTP client methods
    mockHttpClient.post = jest.fn();
    mockHttpClient.get = jest.fn();
    mockHttpClient.postForm = jest.fn();

    // Mock the config property that addMerchantKey accesses
    (mockHttpClient as any)['config'] = {
      merchantKey: 'test_merchant_key',
      appSecret: 'test_app_secret',
    };

    paymentCompletion = new PaymentCompletion(mockHttpClient);
  });

  describe('completePayment', () => {
    it('should complete a 3D payment transaction', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const completionData = {
        invoice_id: 'INV123',
        order_id: 'ORDER123',
        status: 'complete' as const,
      };

      const result = await paymentCompletion.completePayment(completionData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/payment/complete',
        {
          ...completionData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should cancel a 3D payment transaction', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const completionData = {
        invoice_id: 'INV123',
        order_id: 'ORDER123',
        status: 'cancel' as const,
      };

      const result = await paymentCompletion.completePayment(completionData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/payment/complete',
        {
          ...completionData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should generate correct hash key', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const completionData = {
        invoice_id: 'INV123',
        order_id: 'ORDER123',
        status: 'complete' as const,
      };

      await paymentCompletion.completePayment(completionData);

      const callArgs = mockHttpClient.post.mock.calls[0][1] as any;
      expect(callArgs.hash_key).toBeDefined();
      expect(callArgs.hash_key).not.toBe('');
      expect(typeof callArgs.hash_key).toBe('string');
    });

    it('should handle custom request options', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const completionData = {
        invoice_id: 'INV123',
        order_id: 'ORDER123',
        status: 'complete' as const,
      };

      const options = {
        timeout: 5000,
        headers: { 'Custom-Header': 'test' },
      };

      const result = await paymentCompletion.completePayment(completionData, options);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/payment/complete',
        expect.any(Object),
        options
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockHttpClient.post.mockRejectedValue(error);

      const completionData = {
        invoice_id: 'INV123',
        order_id: 'ORDER123',
        status: 'complete' as const,
      };

      await expect(paymentCompletion.completePayment(completionData)).rejects.toThrow('API Error');
    });

    it('should handle hash generation errors', async () => {
      // Mock the crypto module to throw an error
      const originalConfig = (paymentCompletion as any).client.config;
      (paymentCompletion as any).client.config = {
        ...originalConfig,
        appSecret: null, // This should cause hash generation to fail
      };

      const completionData = {
        invoice_id: 'INV123',
        order_id: 'ORDER123',
        status: 'complete' as const,
      };

      await expect(paymentCompletion.completePayment(completionData)).rejects.toThrow();
    });
  });
});
