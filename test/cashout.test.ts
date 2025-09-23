import { Cashout } from '../src/resources/cashout';
import { SipayHttpClient } from '../src/utils/http-client';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Cashout Resource', () => {
  let cashout: Cashout;
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

    cashout = new Cashout(mockHttpClient);
  });

  describe('toBank', () => {
    it('should initiate cashout to bank account', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const cashoutData = {
        invoice_id: 'INV123',
        cashout_type: 1,
        cashout_data: [
          {
            unique_id: 'UNIQUE123',
            name_surname: 'John Doe',
            iban: 'TR1234567890123456789012345',
            name_of_bank: 'Test Bank',
            amount: 100,
            currency: 'TRY',
            id_tc_kn: '12345678901',
            gsm_number: '+901234567890',
            description: 'Test cashout',
          },
        ],
      };

      const result = await cashout.toBank(cashoutData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/cashout/tobank',
        {
          ...cashoutData,
          merchant_key: 'test_merchant_key',
          hash_key: 'TODO_IMPLEMENT_CASHOUT_HASH_GENERATION',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should handle multiple cashout entries', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const cashoutData = {
        invoice_id: 'INV124',
        cashout_type: 1,
        cashout_data: [
          {
            unique_id: 'UNIQUE123',
            name_surname: 'John Doe',
            iban: 'TR1234567890123456789012345',
            amount: 50,
            currency: 'TRY',
            id_tc_kn: '12345678901',
            gsm_number: '+901234567890',
          },
          {
            unique_id: 'UNIQUE124',
            name_surname: 'Jane Doe',
            iban: 'TR1234567890123456789012346',
            amount: 75,
            currency: 'TRY',
            id_tc_kn: '12345678902',
            gsm_number: '+901234567891',
          },
        ],
      };

      const result = await cashout.toBank(cashoutData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/cashout/tobank',
        expect.objectContaining({
          ...cashoutData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        }),
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should handle optional fields', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const cashoutData = {
        invoice_id: 'INV125',
        cashout_type: 1,
        cashout_data: [
          {
            unique_id: 'UNIQUE125',
            name_surname: 'John Doe',
            iban: 'TR1234567890123456789012345',
            amount: 100,
            currency: 'TRY',
            id_tc_kn: '12345678901',
            gsm_number: '+901234567890',
            // Optional fields not included
          },
        ],
      };

      const result = await cashout.toBank(cashoutData);

      expect(result).toBe(mockResponse);
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockHttpClient.post.mockRejectedValue(error);

      const cashoutData = {
        invoice_id: 'INV123',
        cashout_type: 1,
        cashout_data: [
          {
            unique_id: 'UNIQUE123',
            name_surname: 'John Doe',
            iban: 'TR1234567890123456789012345',
            amount: 100,
            currency: 'TRY',
            id_tc_kn: '12345678901',
            gsm_number: '+901234567890',
          },
        ],
      };

      await expect(cashout.toBank(cashoutData)).rejects.toThrow('API Error');
    });
  });
});
