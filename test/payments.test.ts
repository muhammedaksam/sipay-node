import { Payments } from '../src/resources/payments';
import { SipayHttpClient } from '../src/utils/http-client';
import {
  Payment2DRequest,
  Payment3DRequest,
  GetPosRequest,
  OrderStatusRequest,
  RefundRequest,
} from '../src/types';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Payments Resource', () => {
  let payments: Payments;
  let mockHttpClient: jest.Mocked<SipayHttpClient>;

  // Helper function to create complete 2D payment data
  const create2DPaymentData = (overrides?: Partial<Omit<Payment2DRequest, 'merchant_key'>>) => ({
    cc_holder_name: 'John Doe',
    cc_no: '4111111111111111',
    expiry_month: '12',
    expiry_year: '2025',
    cvv: '123',
    currency_code: 'TRY',
    invoice_id: 'INV123',
    invoice_description: 'Test payment',
    total: 100.0,
    installments_number: 1,
    cancel_url: 'https://example.com/cancel',
    return_url: 'https://example.com/return',
    ip: '127.0.0.1',
    order_type: 'sale',
    items: [
      {
        name: 'Test Item',
        price: 100.0,
        qnantity: 1,
        description: 'Test description',
      },
    ],
    name: 'John',
    surname: 'Doe',
    ...overrides,
  });

  // Helper function to create complete 3D payment data
  const create3DPaymentData = (overrides?: Partial<Omit<Payment3DRequest, 'merchant_key'>>) => ({
    cc_holder_name: 'John Doe',
    cc_no: '4111111111111111',
    expiry_month: '12',
    expiry_year: '2025',
    cvv: '123',
    currency_code: 'TRY',
    invoice_id: 'INV123',
    invoice_description: 'Test payment',
    total: 100.0,
    installments_number: 1,
    cancel_url: 'https://example.com/cancel',
    return_url: 'https://example.com/return',
    order_type: 'sale',
    bill_email: 'test@example.com',
    bill_phone: '+901234567890',
    response_method: 'POST',
    items: [
      {
        name: 'Test Item',
        price: 100.0,
        qnantity: 1,
        description: 'Test description',
      },
    ],
    name: 'John',
    surname: 'Doe',
    ...overrides,
  });

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

    payments = new Payments(mockHttpClient);
  });

  describe('pay2D', () => {
    it('should make 2D payment request', async () => {
      const paymentData = create2DPaymentData();

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { transaction_id: 'TXN123' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await payments.pay2D(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/paySmart2D',
        expect.objectContaining({
          ...paymentData,
          merchant_key: expect.any(String),
        }),
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle payment errors', async () => {
      const paymentData = create2DPaymentData();

      const mockError = new Error('Payment failed');
      mockHttpClient.post.mockRejectedValue(mockError);

      await expect(payments.pay2D(paymentData)).rejects.toThrow('Payment failed');
    });
  });

  describe('pay3D', () => {
    it('should make 3D payment request', async () => {
      const paymentData = create3DPaymentData();

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { redirect_url: 'https://3dsecure.example.com' },
      };

      mockHttpClient.postForm.mockResolvedValue(mockResponse);

      const result = await payments.pay3D(paymentData);

      expect(mockHttpClient.postForm).toHaveBeenCalledWith(
        '/api/paySmart3D',
        expect.objectContaining({
          ...paymentData,
          merchant_key: expect.any(String),
        }),
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPos', () => {
    it('should get POS information', async () => {
      const posData: Omit<GetPosRequest, 'merchant_key'> = {
        credit_card: '4111111111111111',
        amount: '100.00',
        currency_code: 'TRY',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { pos_id: 'POS123' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await payments.getPos(posData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/getpos',
        expect.objectContaining({
          ...posData,
          merchant_key: expect.any(String),
        }),
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('checkStatus', () => {
    it('should check payment status', async () => {
      const statusData: Omit<OrderStatusRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Payment successful',
        data: { status: 'completed' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await payments.checkStatus(statusData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/checkstatus',
        expect.objectContaining({
          ...statusData,
          merchant_key: expect.any(String),
        }),
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refund', () => {
    it('should process refund', async () => {
      const refundData: Omit<RefundRequest, 'merchant_key'> = {
        invoice_id: 'INV123',
        amount: '50.00',
      };

      const mockResponse = {
        status_code: 100,
        status_description: 'Refund successful',
        data: { refund_id: 'REF123' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await payments.refund(refundData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/refund',
        expect.objectContaining({
          ...refundData,
          merchant_key: expect.any(String),
        }),
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('pay', () => {
    it('should make payment request', async () => {
      const paymentData = create2DPaymentData({
        name: 'John',
        surname: 'Doe',
        items: [
          {
            name: 'Test Product',
            price: 100.0,
            qnantity: 1,
            description: 'Test Product',
          },
        ],
        hash_key: 'test_hash_key',
      });

      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { payment_id: 'pay_123' },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await payments.pay(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/pay',
        { ...paymentData, merchant_key: 'test_merchant_key' },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should make payment request with options', async () => {
      const paymentData = create2DPaymentData({
        items: [],
        hash_key: 'test_hash',
      });

      const options = { timeout: 5000 };
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await payments.pay(paymentData, options);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/pay',
        { ...paymentData, merchant_key: 'test_merchant_key' },
        options
      );
      expect(result).toBe(mockResponse);
    });
  });
});
