import { Marketplace } from '../src/resources/marketplace';
import { SipayHttpClient } from '../src/utils/http-client';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Marketplace Resource', () => {
  let marketplace: Marketplace;
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

    marketplace = new Marketplace(mockHttpClient);
  });

  describe('pay3D', () => {
    it('should make 3D marketplace payment', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const items = [
        {
          name: 'Test Item',
          price: 100.0,
          qnantity: 1,
          description: 'Test Description',
          sub_merchant_key: 'sub_merchant_123',
          sub_merchant_price: 100.0,
        },
      ];

      const paymentData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        cvv: '123',
        currency_code: 'TRY',
        installments_number: 1,
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        items,
        name: 'John',
        surname: 'Doe',
      };

      const result = await marketplace.pay3D(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/marketplace/sale/pay/smart/secure',
        {
          ...paymentData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should make 3D marketplace payment with hash_key', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const items = [
        {
          name: 'Test Item',
          price: 100.0,
          qnantity: 1,
          description: 'Test Description',
          sub_merchant_key: 'sub_merchant_123',
          sub_merchant_price: 100.0,
        },
      ];

      const paymentData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        cvv: '123',
        currency_code: 'TRY',
        installments_number: 1,
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        items,
        name: 'John',
        surname: 'Doe',
        hash_key: 'provided_hash_key',
      };

      const result = await marketplace.pay3D(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/marketplace/sale/pay/smart/secure',
        {
          ...paymentData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('pay2D', () => {
    it('should make 2D marketplace payment', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const items = [
        {
          name: 'Test Item',
          price: 100.0,
          qnantity: 1,
          description: 'Test Description',
          sub_merchant_key: 'sub_merchant_123',
          sub_merchant_price: 100.0,
        },
      ];

      const paymentData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        cvv: '123',
        currency_code: 'TRY',
        installments_number: 1,
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        items,
        name: 'John',
        surname: 'Doe',
      };

      const result = await marketplace.pay2D(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/marketplace/sale/pay/smart/non-secure',
        {
          ...paymentData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should make 2D marketplace payment without installments_number', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const items = [
        {
          name: 'Test Item',
          price: 100.0,
          qnantity: 1,
          description: 'Test Description',
          sub_merchant_key: 'sub_merchant_123',
          sub_merchant_price: 100.0,
        },
      ];

      const paymentData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        cvv: '123',
        currency_code: 'TRY',
        // No installments_number - should default to 1
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        items,
        name: 'John',
        surname: 'Doe',
      };

      const result = await marketplace.pay2D(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/marketplace/sale/pay/smart/non-secure',
        {
          ...paymentData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('refund', () => {
    it('should refund marketplace payment', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const refundData = {
        invoice_id: 'INV123',
        amount: '50.00',
        sub_merchant_key: 'sub_merchant_123',
      };

      const result = await marketplace.refund(refundData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/marketplace/sale/refund',
        {
          ...refundData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('checkStatus', () => {
    it('should check marketplace payment status', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const statusData = {
        invoice_id: 'INV123',
        include_pending_status: '1',
      };

      const result = await marketplace.checkStatus(statusData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/marketplace/sale/check/status',
        {
          ...statusData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('getSettlements', () => {
    it('should get marketplace settlements', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success', data: [] };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const settlementsData = {
        sub_merchant_key: 'sub_merchant_123',
        start_date: '2025-01-01',
        end_date: '2025-01-31',
      };

      const result = await marketplace.getSettlements(settlementsData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/settlements',
        {
          ...settlementsData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('approveTransaction', () => {
    it('should approve marketplace transaction', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const approvalData = {
        invoice_id: 'INV123',
        sub_merchant_key: 'sub_merchant_123',
        amount: '100.00',
      };

      const result = await marketplace.approveTransaction(approvalData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/marketplace/sale/transaction/approve',
        {
          ...approvalData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('payout', () => {
    it('should process payout to sub merchant', async () => {
      const payoutData = {
        sub_merchant_key: 'sub123',
        amount: 100.0,
        currency_code: 'TRY',
        description: 'Commission payout',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        payout_id: 'PAYOUT123',
        amount: 100.0,
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await marketplace.payout(payoutData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/marketplace/sub-merchant/payout',
        { ...payoutData, merchant_key: 'test_merchant_key' },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should process payout with options', async () => {
      const payoutData = {
        sub_merchant_key: 'sub456',
        amount: 75.0,
        currency_code: 'TRY',
        description: 'Sale payout',
      };

      const options = { timeout: 10000 };
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        payout_id: 'PAYOUT456',
        amount: 75.0,
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await marketplace.payout(payoutData, options);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/ccpayment/api/marketplace/sub-merchant/payout',
        { ...payoutData, merchant_key: 'test_merchant_key' },
        options
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockHttpClient.post.mockRejectedValue(error);

      const refundData = {
        invoice_id: 'INV123',
        amount: '50.00',
      };

      await expect(marketplace.refund(refundData)).rejects.toThrow('API Error');
    });
  });
});
