import { BrandedSolution } from '../src/resources/branded-solution';
import { SipayHttpClient } from '../src/utils/http-client';
import { BrandedSolutionRequest, BrandedStatusRequest } from '../src/types';

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
    it('should create a payment link', async () => {
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
            qnantity: 1,
            description: 'Test description',
          },
        ],
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { link: 'https://payment.sipay.com.tr/link123' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await brandedSolution.createPaymentLink(linkData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/purchase/link',
        expect.objectContaining({
          ...linkData,
          merchant_key: 'test_merchant_key',
        }),
        undefined
      );
      expect(result).toEqual(mockResponse);
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
            qnantity: 1,
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

  describe('checkStatus', () => {
    it('should check payment status', async () => {
      const statusData: Omit<BrandedStatusRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Payment completed',
        data: {
          status: 'success',
          transaction_id: 'TXN123',
        },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await brandedSolution.checkStatus(statusData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/purchase/status',
        expect.objectContaining({
          ...statusData,
          merchant_key: 'test_merchant_key',
        }),
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle status check errors', async () => {
      const statusData: Omit<BrandedStatusRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
      };

      const mockError = new Error('Status check failed');
      mockHttpClient.post.mockRejectedValue(mockError);

      await expect(brandedSolution.checkStatus(statusData)).rejects.toThrow('Status check failed');
    });
  });
});
