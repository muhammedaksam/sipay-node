import { Recurring } from '../src/resources/recurring';
import { SipayHttpClient } from '../src/utils/http-client';
import { RecurringQueryRequest } from '../src/types';

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

    recurring = new Recurring(mockHttpClient);
  });

  describe('query', () => {
    it('should query recurring payments', async () => {
      const queryData: RecurringQueryRequest = {
        merchant_key: 'test_merchant_key',
        plan_code: 'PLAN123',
        app_id: 'test_app_id',
        app_secret: 'test_app_secret',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: [
          { id: 'REC1', status: 'active' },
          { id: 'REC2', status: 'active' },
        ],
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await recurring.query(queryData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/QueryRecurring', queryData, undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should handle query errors', async () => {
      const queryData: RecurringQueryRequest = {
        merchant_key: 'test_merchant_key',
        plan_code: 'PLAN123',
        app_id: 'test_app_id',
        app_secret: 'test_app_secret',
      };

      const mockError = new Error('Query failed');
      mockHttpClient.post.mockRejectedValue(mockError);

      await expect(recurring.query(queryData)).rejects.toThrow('Query failed');
    });

    it('should process recurring plan', async () => {
      const planData = {
        merchant_id: 'test_merchant_id',
        plan_code: 'PLAN123',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Plan processed successfully',
        data: { plan_id: 'PLAN123' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await recurring.processPlan(planData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/recurring/plan/process',
        planData,
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
