import { SipayResource } from './base';
import { SipayApiResponse, RequestOptions } from '../types';
import { generateHashKey, generatePaymentHashKey } from '../utils';

export interface SaveCardRequest {
  merchant_key: string;
  customer_number: string;
  cc_holder_name: string;
  cc_no: string;
  expiry_month: string;
  expiry_year: string;
  hash_key: string;
}

export interface GetCardTokensRequest {
  merchant_key: string;
  customer_number: string;
}

export interface EditCardRequest {
  merchant_key: string;
  customer_number: string;
  card_token: string;
  cc_holder_name: string;
  expiry_month: string;
  expiry_year: string;
  hash_key: string;
}

export interface DeleteCardRequest {
  merchant_key: string;
  customer_number: string;
  card_token: string;
  hash_key: string;
}

export interface PayByCardTokenRequest {
  merchant_key: string;
  customer_number: string;
  card_token: string;
  currency_code: string;
  installments_number?: number;
  invoice_id: string;
  invoice_description: string;
  total: number;
  items: Array<{
    name: string;
    price: number;
    qnantity: number;
    description: string;
  }>;
  name: string;
  surname: string;
  hash_key: string;
}

export class Cards extends SipayResource {
  /**
   * Save a credit card for future use
   */
  async saveCard(
    cardData: Omit<SaveCardRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(cardData) as SaveCardRequest;

    // Generate hash key for save card
    // Hash format: merchant_key|customer_number|card_holder_name|card_number|expiry_month|expiry_year
    const hashParts = [
      data.merchant_key,
      data.customer_number,
      data.cc_holder_name,
      data.cc_no,
      data.expiry_month,
      data.expiry_year,
    ];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/saveCard', data, options);
  }

  /**
   * Get saved card tokens for a customer
   */
  async getCardTokens(
    customerData: Omit<GetCardTokensRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(customerData);
    return this.get('/api/getCardTokens', data, options);
  }

  /**
   * Edit a saved card
   */
  async editCard(
    cardData: Omit<EditCardRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(cardData) as EditCardRequest;

    // Generate hash key for edit card
    // Hash format: merchant_key|customer_number|card_token
    const hashParts = [data.merchant_key, data.customer_number, data.card_token];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/editCard', data, options);
  }

  /**
   * Delete a saved card
   */
  async deleteCard(
    cardData: Omit<DeleteCardRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(cardData) as DeleteCardRequest;

    // Generate hash key for delete card
    // Hash format: merchant_key|customer_number|card_token
    const hashParts = [data.merchant_key, data.customer_number, data.card_token];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/deleteCard', data, options);
  }

  /**
   * Pay using a saved card token (3D Secure)
   */
  async payByCardToken(
    paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
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
   */
  async payByCardTokenNonSecure(
    paymentData: Omit<PayByCardTokenRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
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
