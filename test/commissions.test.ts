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

    // Mock HTTP client methods — now POST instead of GET
    mockHttpClient.post = jest.fn();

    commissions = new Commissions(mockHttpClient);
  });

  describe('getCommissions', () => {
    it('should get commission information via POST', async () => {
      const commissionData: CommissionRequest = {
        currency_code: 'TRY',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: {
          '1': [
            {
              title: 'VISA',
              card_program: 'VISA',
              merchant_commission_percentage: '2.5',
              merchant_commission_fixed: '0',
              user_commission_percentage: '0',
              user_commission_fixed: '0',
              currency_code: 'TRY',
              installment: 1,
            },
          ],
        },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await commissions.getCommissions(commissionData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
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
      mockHttpClient.post.mockRejectedValue(mockError);

      await expect(commissions.getCommissions(commissionData)).rejects.toThrow(
        'Commission query failed'
      );
    });

    it('should work with commission_by parameter', async () => {
      const commissionData: CommissionRequest = {
        currency_code: 'TRY',
        commission_by: 'merchant',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: {},
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await commissions.getCommissions(commissionData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/commissions',
        commissionData,
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
