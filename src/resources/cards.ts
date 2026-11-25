import { SipayResource } from './base';
import {
  SipayApiResponse,
  RequestOptions,
  SaveCardResponse,
  CardTokensResponse,
  EditCardResponse,
  DeleteCardResponse,
  CardPaymentResponse,
  SipayAppLang,
  SipayCardProgram,
  SipayCurrency,
  SipayOrderType,
  SipayRecurringCycle,
  SipayTransactionType,
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
  app_lang?: SipayAppLang;
}

export interface GetCardTokensRequest {
  merchant_key: string;
  customer_number: number;
  app_lang?: SipayAppLang;
}

export interface EditCardRequest {
  merchant_key: string;
  customer_number: number;
  card_token: string;
  card_holder_name?: string;
  expiry_month: number;
  expiry_year: number;
  hash_key: string;
  app_lang?: SipayAppLang;
}

export interface DeleteCardRequest {
  merchant_key: string;
  customer_number: number;
  card_token: string;
  hash_key: string;
  app_lang?: SipayAppLang;
}

/** @see https://apidocs.sipay.com.tr/3d-secure-pay-by-card-token-26908142e0.md */
export interface PayByCardTokenRequest {
  merchant_key: string;
  card_token: string;
  customer_number: number;
  customer_email: string;
  customer_phone: string;
  customer_name: string;
  currency_code: SipayCurrency | (string & {});
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
  bill_address1: string;
  bill_address2?: string;
  bill_city?: string;
  bill_postcode?: string;
  bill_state?: string;
  bill_country?: string;
  bill_email: string;
  bill_phone: string;
  /** Optional; valid values: WORLD, BONUS, MAXIMUM, BANKKART_COMBO, PARAF, AXESS, ADVANT, CARD_FNS */
  card_program?: SipayCardProgram | (string & {});
  /** Required for Non-Secure payByCardTokenNonSecure; optional for 3D Secure */
  ip?: string;
  transaction_type?: SipayTransactionType;
  sale_web_hook_key?: string;
  // Recurring parameters
  /** Required for Non-Secure; if set to 1, recurring_payment_number/cycle/interval/web_hook_key become required */
  order_type?: SipayOrderType;
  /** Required when order_type = 1 */
  recurring_payment_number?: number;
  /** Required when order_type = 1. Values: D (Day), M (Month), Y (Year) */
  recurring_payment_cycle?: SipayRecurringCycle;
  /** Required when order_type = 1 */
  recurring_payment_interval?: string;
  /** Required when order_type = 1 */
  recurring_web_hook_key?: string;
  app_lang?: SipayAppLang;
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
  ): Promise<SaveCardResponse> {
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

    return this.post('/api/saveCard', data, options) as unknown as SaveCardResponse;
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
  ): Promise<EditCardResponse> {
    const data = this.addMerchantKey(cardData) as EditCardRequest;

    // Generate hash key for edit card
    // Hash format: merchant_key|customer_number|card_token
    const hashParts = [data.merchant_key, data.customer_number.toString(), data.card_token];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/editCard', data, options) as unknown as EditCardResponse;
  }

  /**
   * Delete a saved card
   * POST /api/deleteCard
   * Hash format: merchant_key|customer_number|card_token
   */
  async deleteCard(
    cardData: Omit<DeleteCardRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<DeleteCardResponse> {
    const data = this.addMerchantKey(cardData) as DeleteCardRequest;

    // Generate hash key for delete card
    // Hash format: merchant_key|customer_number|card_token
    const hashParts = [data.merchant_key, data.customer_number.toString(), data.card_token];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/deleteCard', data, options) as unknown as DeleteCardResponse;
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
    const installments = data.installments_number || 1;
    data.installments_number = installments;

    // Generate hash key for card token payment
    // Hash format: total|installments_number|currency_code|merchant_key|invoice_id
    const hashKey = generatePaymentHashKey(
      data.total,
      installments,
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
    const installments = data.installments_number || 1;
    data.installments_number = installments;

    // Generate hash key for non-secure card token payment
    // Hash format: total|installments_number|currency_code|merchant_key|invoice_id
    const hashKey = generatePaymentHashKey(
      data.total,
      installments,
      data.currency_code,
      data.merchant_key,
      data.invoice_id,
      this.client['config'].appSecret
    );
    data.hash_key = hashKey;

    return this.post('/api/payByCardTokenNonSecure', data, options);
  }
}
