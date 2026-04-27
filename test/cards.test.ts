import {
  Cards,
  SaveCardRequest,
  EditCardRequest,
  DeleteCardRequest,
  PayByCardTokenRequest,
  GetCardTokensRequest,
} from '../src/resources/cards';
import { SipayHttpClient } from '../src/utils/http-client';
import { PaymentItem } from '../src/types';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Cards Resource', () => {
  let cards: Cards;
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

    cards = new Cards(mockHttpClient);
  });

  describe('saveCard', () => {
    it('should save a card with proper hash generation', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const cardData: Omit<SaveCardRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        card_holder_name: 'John Doe',
        card_number: 4111111111111111,
        expiry_month: 12,
        expiry_year: 2025,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: 5551234567,
      };

      const result = await cards.saveCard(cardData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/saveCard',
        {
          ...cardData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should generate correct hash for save card request', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const cardData: Omit<SaveCardRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        card_holder_name: 'John Doe',
        card_number: 4111111111111111,
        expiry_month: 12,
        expiry_year: 2025,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: 5551234567,
      };

      await cards.saveCard(cardData);

      const callArgs = mockHttpClient.post.mock.calls[0][1] as SaveCardRequest;
      expect(callArgs.hash_key).toBeDefined();
      expect(callArgs.hash_key).not.toBe('');
    });
  });

  describe('editCard', () => {
    it('should edit a card with proper hash generation', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const editData: Omit<EditCardRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        card_holder_name: 'John Doe Updated',
        expiry_month: 6,
        expiry_year: 2026,
        card_token: 'token123',
      };

      const result = await cards.editCard(editData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/editCard',
        {
          ...editData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('deleteCard', () => {
    it('should delete a card with proper hash generation', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const deleteData: Omit<DeleteCardRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        card_token: 'token123',
      };

      const result = await cards.deleteCard(deleteData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/deleteCard',
        {
          ...deleteData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('payByCardToken', () => {
    it('should make payment by card token with proper hash generation', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const items: PaymentItem[] = [
        {
          name: 'Test Item',
          price: 100.0,
          quantity: 1,
          description: 'Test Description',
        },
      ];

      const paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        customer_email: 'john@example.com',
        customer_phone: '+905551234567',
        customer_name: 'John Doe',
        currency_code: 'TRY',
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        card_token: 'token123',
        installments_number: 1,
        items,
        cancel_url: 'https://example.com/cancel',
        return_url: 'https://example.com/return',
      };

      const result = await cards.payByCardToken(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/payByCardToken',
        {
          ...paymentData,
          merchant_key: 'test_merchant_key',
          hash_key: expect.any(String),
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should make payment by card token without installments_number', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const items: PaymentItem[] = [
        {
          name: 'Test Item',
          price: 100.0,
          quantity: 1,
          description: 'Test Description',
        },
      ];

      const paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        customer_email: 'john@example.com',
        customer_phone: '+905551234567',
        customer_name: 'John Doe',
        currency_code: 'TRY',
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        // No installments_number - should default to 1
        items,
        card_token: 'token123',
        cancel_url: 'https://example.com/cancel',
        return_url: 'https://example.com/return',
      };

      const result = await cards.payByCardToken(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/payByCardToken',
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

  describe('payByCardTokenNonSecure', () => {
    it('should make non-secure payment by card token with proper hash generation', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const items: PaymentItem[] = [
        {
          name: 'Test Item',
          price: 100.0,
          quantity: 1,
          description: 'Test Description',
        },
      ];

      const paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        customer_email: 'john@example.com',
        customer_phone: '+905551234567',
        customer_name: 'John Doe',
        currency_code: 'TRY',
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        card_token: 'token123',
        installments_number: 1,
        items,
        cancel_url: 'https://example.com/cancel',
        return_url: 'https://example.com/return',
      };

      const result = await cards.payByCardTokenNonSecure(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/payByCardTokenNonSecure',
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

  describe('getCardTokens', () => {
    it('should get card tokens', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: [],
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const requestData: Omit<GetCardTokensRequest, 'merchant_key'> = {
        customer_number: 123,
      };

      const result = await cards.getCardTokens(requestData);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/api/getCardTokens',
        {
          ...requestData,
          merchant_key: 'test_merchant_key',
        },
        undefined
      );
      expect(result).toBe(mockResponse);
    });

    it('should pay by card token (non-secure) without installments_number', async () => {
      const mockResponse = { status_code: 100, status_description: 'Success' };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        customer_email: 'john@example.com',
        customer_phone: '+905551234567',
        customer_name: 'John Doe',
        card_token: 'token123',
        currency_code: 'TRY',
        // No installments_number - should default to 1
        invoice_id: 'INV123',
        invoice_description: 'Test payment',
        total: 100.0,
        items: [
          {
            name: 'Test Item',
            price: 100.0,
            quantity: 1,
            description: 'Test Description',
          },
        ],
        cancel_url: 'https://example.com/cancel',
        return_url: 'https://example.com/return',
      };

      const result = await cards.payByCardTokenNonSecure(paymentData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/payByCardTokenNonSecure',
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

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockHttpClient.post.mockRejectedValue(error);

      const cardData: Omit<SaveCardRequest, 'merchant_key' | 'hash_key'> = {
        customer_number: 123,
        card_holder_name: 'John Doe',
        card_number: 4111111111111111,
        expiry_month: 12,
        expiry_year: 2025,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: 5551234567,
      };

      await expect(cards.saveCard(cardData)).rejects.toThrow('API Error');
    });
  });
});
