import { Recurring } from '../src/resources/recurring';
import { SipayHttpClient } from '../src/utils/http-client';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Recurring Resource', () => {
  let recurring: Recurring;
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

    recurring = new Recurring(mockHttpClient);
  });

  describe('instantiation', () => {
    it('should be instantiated without errors', () => {
      expect(recurring).toBeDefined();
      expect(recurring).toBeInstanceOf(Recurring);
    });

    it('should have access to base resource methods', () => {
      expect(typeof recurring['addMerchantKey']).toBe('function');
      expect(typeof recurring['post']).toBe('function');
      expect(typeof recurring['get']).toBe('function');
    });
  });

  describe('queryPlan', () => {
    it('should query recurring plan details', async () => {
      const mockResponse = {
        status_code: 100,
        message: 'Success',
        recurring_id: 42,
        plan_code: 'PLAN001',
        currency: 'TRY',
        currency_symbol: '₺',
        first_amount: 100,
        recurring_amount: 50,
        total_amount: 600,
        payment_number: 12,
        payment_interval: 1,
        payment_cycle: 'M',
        first_order_id: 'ORD001',
        merchant_id: 18309,
        card_no: '411111******1111',
        next_action_date: '2026-05-01',
        recurring_status: 'Active',
        transaction_date: '2026-04-01',
        transactionHistories: [],
      };

      mockHttpClient.post.mockResolvedValue(mockResponse as any);

      const result = await recurring.queryPlan({
        plan_code: 'PLAN001',
        recurring_number: 1,
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/recurringPlan/query',
        {
          plan_code: 'PLAN001',
          recurring_number: 1,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should query plan with app_lang', async () => {
      const mockResponse = { status_code: 100, message: 'Success', status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse as any);

      await recurring.queryPlan({
        plan_code: 'PLAN002',
        recurring_number: 3,
        app_lang: 'tr',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/recurringPlan/query',
        expect.objectContaining({
          plan_code: 'PLAN002',
          recurring_number: 3,
          app_lang: 'tr',
          merchant_key: 'test_merchant_key',
        }),
        undefined
      );
    });

    it('should handle query errors', async () => {
      const error = new Error('Plan not found');
      mockHttpClient.post.mockRejectedValue(error as any);

      await expect(
        recurring.queryPlan({ plan_code: 'INVALID', recurring_number: 1 })
      ).rejects.toThrow('Plan not found');
    });
  });

  describe('processPlan', () => {
    it('should process a recurring plan', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { status_code: 100, message: 'Plan processed' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await recurring.processPlan({
        merchant_id: '18309',
        plan_code: 'PLAN001',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/recurring/plan/process',
        {
          merchant_id: '18309',
          plan_code: 'PLAN001',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should process plan with options', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const options = { timeout: 10000 };

      await recurring.processPlan(
        { merchant_id: '18309', plan_code: 'PLAN001' },
        options
      );

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/recurring/plan/process',
        { merchant_id: '18309', plan_code: 'PLAN001' },
        options
      );
    });

    it('should handle process errors', async () => {
      const error = new Error('Processing failed');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(
        recurring.processPlan({ merchant_id: '18309', plan_code: 'BAD' })
      ).rejects.toThrow('Processing failed');
    });
  });

  describe('updatePlan', () => {
    it('should update a recurring plan', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { status_code: 100, message: 'Plan updated' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await recurring.updatePlan({
        plan_code: 'PLAN001',
        recurring_amount: '75.00',
        recurring_status: 'Active',
        recurring_payment_number: '6',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/recurringPlan/update',
        {
          plan_code: 'PLAN001',
          recurring_amount: '75.00',
          recurring_status: 'Active',
          recurring_payment_number: '6',
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should update plan status to Passive', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      await recurring.updatePlan({
        plan_code: 'PLAN001',
        recurring_amount: '50.00',
        recurring_status: 'Passive',
        recurring_payment_number: '0',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/recurringPlan/update',
        expect.objectContaining({
          recurring_status: 'Passive',
          merchant_key: 'test_merchant_key',
        }),
        undefined
      );
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(
        recurring.updatePlan({
          plan_code: 'BAD',
          recurring_amount: '50',
          recurring_status: 'Active',
          recurring_payment_number: '1',
        })
      ).rejects.toThrow('Update failed');
    });
  });
});
