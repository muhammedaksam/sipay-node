import { SipayResource } from './base';
import {
  SipayApiResponse,
  RequestOptions,
  SaveCardResponse,
  CardTokensResponse,
  EditCardResponse,
  DeleteCardResponse,
  CardPaymentResponse,
} from '../types';
import { generateHashKey, generatePaymentHashKey } from '../utils';

export interface SaveCardRequest {
  merchant_key: string;
  card_holder_name: string;
  card_number: number;
  expiry_month: number;
  expiry_year: number;
  customer_number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: number;
  hash_key: string;
  app_lang?: string;
}

export interface GetCardTokensRequest {
  merchant_key: string;
  customer_number: number;
  app_lang?: string;
}

export interface EditCardRequest {
  merchant_key: string;
  customer_number: number;
  card_token: string;
  card_holder_name?: string;
  expiry_month: number;
  expiry_year: number;
  hash_key: string;
  app_lang?: string;
}

export interface DeleteCardRequest {
  merchant_key: string;
  customer_number: number;
  card_token: string;
  hash_key: string;
  app_lang?: string;
}

export interface PayByCardTokenRequest {
  merchant_key: string;
  card_token: string;
  customer_number: number;
  customer_email: string;
  customer_phone: string;
  customer_name: string;
  currency_code: string;
  installments_number?: number;
  invoice_id: string;
  invoice_description: string;
  total: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    description: string;
  }>;
  cancel_url: string;
  return_url: string;
  hash_key: string;
  // Billing address fields
  bill_address1?: string;
  bill_address2?: string;
  bill_city?: string;
  bill_postcode?: string;
  bill_state?: string;
  bill_country?: string;
  bill_email?: string;
  bill_phone?: string;
  // Payment options
  card_program?: string;
  ip?: string;
  transaction_type?: string;
  sale_web_hook_key?: string;
  // Recurring parameters
  order_type?: number;
  recurring_payment_number?: number;
  recurring_payment_cycle?: string;
  recurring_payment_interval?: string;
  recurring_web_hook_key?: string;
  app_lang?: string;
}

export class Cards extends SipayResource {
  /**
   * Save a credit card for future use
   * POST /api/saveCard
   * Hash format: merchant_key|customer_number|card_holder_name|expiry_month|expiry_year
   */
  async saveCard(
    cardData: Omit<SaveCardRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<SaveCardResponse>> {
    const data = this.addMerchantKey(cardData) as SaveCardRequest;

    // Generate hash key for save card
    // Hash format: merchant_key|customer_number|card_holder_name|expiry_month|expiry_year
    const hashParts = [
      data.merchant_key,
      data.customer_number.toString(),
      data.card_holder_name,
      data.expiry_month.toString(),
      data.expiry_year.toString(),
    ];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/saveCard', data, options);
  }

  /**
   * Get saved card tokens for a customer
   * GET /api/getCardTokens
   */
  async getCardTokens(
    customerData: Omit<GetCardTokensRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<CardTokensResponse>> {
    const data = this.addMerchantKey(customerData);
    return this.get('/api/getCardTokens', data, options);
  }

  /**
   * Edit a saved card
   * POST /api/editCard
   * Hash format: merchant_key|customer_number|card_token
   */
  async editCard(
    cardData: Omit<EditCardRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<EditCardResponse>> {
    const data = this.addMerchantKey(cardData) as EditCardRequest;

    // Generate hash key for edit card
    // Hash format: merchant_key|customer_number|card_token
    const hashParts = [data.merchant_key, data.customer_number.toString(), data.card_token];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/editCard', data, options);
  }

  /**
   * Delete a saved card
   * POST /api/deleteCard
   * Hash format: merchant_key|customer_number|card_token
   */
  async deleteCard(
    cardData: Omit<DeleteCardRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<DeleteCardResponse>> {
    const data = this.addMerchantKey(cardData) as DeleteCardRequest;

    // Generate hash key for delete card
    // Hash format: merchant_key|customer_number|card_token
    const hashParts = [data.merchant_key, data.customer_number.toString(), data.card_token];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/deleteCard', data, options);
  }

  /**
   * Pay using a saved card token (3D Secure)
   * POST /api/payByCardToken
   * Hash format: total|installments_number|currency_code|merchant_key|invoice_id
   */
  async payByCardToken(
    paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<CardPaymentResponse>> {
    const data = this.addMerchantKey(paymentData) as PayByCardTokenRequest;

    // Generate hash key for card token payment
    // Hash format: total|installments_number|currency_code|merchant_key|invoice_id
    const hashKey = generatePaymentHashKey(
      data.total,
      data.installments_number || 1,
      data.currency_code,
      data.merchant_key,
      data.invoice_id,
      this.client['config'].appSecret
    );
    data.hash_key = hashKey;

    return this.post('/api/payByCardToken', data, options);
  }

  /**
   * Pay using a saved card token (Non-Secure/2D)
   * POST /api/payByCardTokenNonSecure
   * Hash format: total|installments_number|currency_code|merchant_key|invoice_id
   */
  async payByCardTokenNonSecure(
    paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<CardPaymentResponse>> {
    const data = this.addMerchantKey(paymentData) as PayByCardTokenRequest;

    // Generate hash key for non-secure card token payment
    // Hash format: total|installments_number|currency_code|merchant_key|invoice_id
    const hashKey = generatePaymentHashKey(
      data.total,
      data.installments_number || 1,
      data.currency_code,
      data.merchant_key,
      data.invoice_id,
      this.client['config'].appSecret
    );
    data.hash_key = hashKey;

    return this.post('/api/payByCardTokenNonSecure', data, options);
  }
}
