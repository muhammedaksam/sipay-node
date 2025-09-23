import { SubMerchant } from '../src/resources/sub-merchant';
import { SipayHttpClient } from '../src/utils/http-client';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('SubMerchant Resource', () => {
  let subMerchant: SubMerchant;
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

    subMerchant = new SubMerchant(mockHttpClient);
  });

  describe('add', () => {
    it('should add a new sub-merchant', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const subMerchantData = {
        sub_merchant_name: 'Test Sub Merchant',
        sub_merchant_email: 'test@example.com',
        sub_merchant_phone: '+901234567890',
        identity_number: '12345678901',
        sub_merchant_description: 'Test Description',
        full_company_name: 'Test Company Ltd.',
        authorized_person_name: 'John Doe',
        authorized_person_email: 'john@example.com',
        authorized_person_phone: '+901234567891',
        contact_person_phone: '+901234567892',
        business_area: 'E-commerce',
        zip_code: '34000',
        iban_no: 'TR1234567890123456789012345',
        is_enable_auto_withdrawal: '1',
        settlement_id: 1,
        currency_code: 'TRY',
        auto_withdrawal_settlement_id: 1,
        auto_withdrawal_remain_amount: 100,
      };

      const result = await subMerchant.add(subMerchantData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/sub-merchant/add',
        {
          ...subMerchantData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('edit', () => {
    it('should edit an existing sub-merchant', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const editData = {
        sub_merchant_key: 'SUB_MERCHANT_123',
        name: 'Updated Sub Merchant',
        tax_number: '1234567890',
        tax_office: 'Updated Tax Office',
        address: 'Updated Address',
        phone: '+901234567890',
        email: 'updated@example.com',
      };

      const result = await subMerchant.edit(editData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/sub-merchant/edit',
        {
          ...editData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a sub-merchant', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const deleteData = {
        sub_merchant_key: 'SUB_MERCHANT_123',
      };

      const result = await subMerchant.delete(deleteData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/sub-merchant/delete',
        {
          ...deleteData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('list', () => {
    it('should list all sub-merchants', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success', data: [] };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await subMerchant.list();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/sub-merchant/list',
        {
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('addPF', () => {
    it('should add a new PF sub-merchant', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const pfData = {
        sub_merchant_key: 'SUB_MERCHANT_PF_123',
        sub_merchant_name: 'Test PF Merchant',
        sub_merchant_email: 'testpf@example.com',
        sub_merchant_phone: '+901234567890',
        sub_merchant_address: 'Test Address',
        sub_merchant_tax_office: 'Test Tax Office',
        sub_merchant_tax_number: '1234567890',
        sub_merchant_identity_number: '12345678901',
        sub_merchant_iban: 'TR1234567890123456789012345',
      };

      const result = await subMerchant.addPF(pfData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/addSubMerchantPF',
        {
          ...pfData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('deletePF', () => {
    it('should delete a PF sub-merchant', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const deleteData = {
        sub_merchant_key: 'SUB_MERCHANT_PF_123',
      };

      const result = await subMerchant.deletePF(deleteData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/deleteSubMerchantPF',
        {
          ...deleteData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('viewPF', () => {
    it('should view a PF sub-merchant', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success', data: {} };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const viewData = {
        sub_merchant_key: 'SUB_MERCHANT_PF_123',
      };

      const result = await subMerchant.viewPF(viewData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/subMerchantPF/view',
        {
          ...viewData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('listPF', () => {
    it('should list all PF sub-merchants', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success', data: [] };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await subMerchant.listPF();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/listSubMerchantPF',
        {
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('payout', () => {
    it('should make payout to sub merchants', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const payoutData = {
        payout_data: [
          {
            sub_merchant_id: 'SUB_MERCHANT_123',
            amount: '100.00',
            currency_code: 'TRY',
          },
        ],
      };

      const result = await subMerchant.payout(payoutData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/marketplace/sub-merchant/payout',
        {
          ...payoutData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should handle multiple payout entries', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const payoutData = {
        payout_data: [
          {
            sub_merchant_id: 'SUB_MERCHANT_123',
            amount: '50.00',
            currency_code: 'TRY',
          },
          {
            sub_merchant_id: 'SUB_MERCHANT_124',
            amount: '75.00',
            currency_code: 'TRY',
          },
        ],
      };

      const result = await subMerchant.payout(payoutData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/marketplace/sub-merchant/payout',
        expect.objectContaining({
          ...payoutData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        }),
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should throw error if payout data is empty', async () => {
      const payoutData = {
        payout_data: [],
      };

      await expect(subMerchant.payout(payoutData)).rejects.toThrow('Payout data is required');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockHttpClient.post.mockRejectedValue(error);

      const subMerchantData = {
        sub_merchant_name: 'Test Sub Merchant',
        sub_merchant_email: 'test@example.com',
        sub_merchant_phone: '+901234567890',
        identity_number: '12345678901',
        sub_merchant_description: 'Test Description',
        full_company_name: 'Test Company Ltd.',
        authorized_person_name: 'John Doe',
        authorized_person_email: 'john@example.com',
        authorized_person_phone: '+901234567891',
        contact_person_phone: '+901234567892',
        business_area: 'E-commerce',
        zip_code: '34000',
        iban_no: 'TR1234567890123456789012345',
        is_enable_auto_withdrawal: '1',
        settlement_id: 1,
        currency_code: 'TRY',
        auto_withdrawal_settlement_id: 1,
        auto_withdrawal_remain_amount: 100,
      };

      await expect(subMerchant.add(subMerchantData)).rejects.toThrow('API Error');
    });
  });
});
