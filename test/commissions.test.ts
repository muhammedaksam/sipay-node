import { Commissions } from '../src/resources/commissions';
import { SipayHttpClient } from '../src/utils/http-client';
import { CommissionRequest } from '../src/types';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Commissions Resource', () => {
  let commissions: Commissions;
  let mockHttpClient: jest.Mocked<SipayHttpClient>;

  beforeEach(() => {
    mockHttpClient = new SipayHttpClient({
      appId: 'test_app_id',
      appSecret: 'test_app_secret',
      merchantKey: 'test_merchant_key',
    }) as jest.Mocked<SipayHttpClient>;

    // Mock HTTP client methods
    mockHttpClient.get = jest.fn();

    commissions = new Commissions(mockHttpClient);
  });

  describe('getCommissions', () => {
    it('should get commission information', async () => {
      const commissionData: CommissionRequest = {
        currency_code: 'TRY',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: {
          currency_code: 'TRY',
          commission_rate: 2.5,
          minimum_commission: 0.5,
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await commissions.getCommissions(commissionData);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/api/commissions',
        commissionData,
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle commission query errors', async () => {
      const commissionData: CommissionRequest = {
        currency_code: 'USD',
      };

      const mockError = new Error('Commission query failed');
      mockHttpClient.get.mockRejectedValue(mockError);

      await expect(commissions.getCommissions(commissionData)).rejects.toThrow(
        'Commission query failed'
      );
    });

    it('should work with different currencies', async () => {
      const currencies = ['TRY', 'USD', 'EUR'];

      for (const currency of currencies) {
        const commissionData: CommissionRequest = {
          currency_code: currency,
        };

        const mockResponse = {
          status_code: 100,
          status_description: 'Success',
          data: {
            currency_code: currency,
            commission_rate: 2.5,
          },
        };

        mockHttpClient.get.mockResolvedValue(mockResponse);

        const result = await commissions.getCommissions(commissionData);

        expect(result.data?.currency_code).toBe(currency);
      }
    });
  });
});
