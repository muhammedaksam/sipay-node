import { SipayResource } from './base';
import {
  Payment2DRequest,
  Payment3DRequest,
  GetPosRequest,
  PosInfo,
  SipayApiResponse,
  RequestOptions,
  OrderStatusRequest,
  RefundRequest,
  ConfirmPaymentRequest,
  InstallmentsResponse,
  GetTokenRequest,
  TokenResponse,
} from '../types';
import {
  generatePaymentHashKey,
  generateStatusHashKey,
  generateConfirmPaymentHashKey,
} from '../utils';

export class Payments extends SipayResource {
  /**
   * Make a 2D payment (without 3D Secure authentication)
   */
  async pay2D(
    paymentData: Omit<Payment2DRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(paymentData) as Payment2DRequest;

    // Generate hash key for payment verification
    const hashKey = generatePaymentHashKey(
      data.total,
      data.installments_number || 1,
      data.currency_code,
      this.client['config'].merchantKey,
      data.invoice_id,
      this.client['config'].appSecret
    );

    data.hash_key = hashKey;

    return this.post('/api/paySmart2D', data, options);
  }

  /**
   * Process a 3D payment (with 3D Secure authentication)
   * Returns HTML form that should be rendered and auto-submitted
   */
  async pay3D(
    paymentData: Omit<Payment3DRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(paymentData);
    return this.postForm('/api/paySmart3D', data, options);
  }

  /**
   * Get POS information and installment options for a credit card
   */
  async getPos(
    posData: Omit<GetPosRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<PosInfo[]>> {
    const data = this.addMerchantKey({
      ...posData,
      credit_card: posData.credit_card,
    });
    return this.post('/api/getpos', data, options);
  }

  /**
   * Check the status of a payment
   */
  async checkStatus(
    statusData: Omit<OrderStatusRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(statusData);

    // Generate hash key for status check
    const hashKey = generateStatusHashKey(
      data.invoice_id,
      this.client['config'].merchantKey,
      this.client['config'].appSecret
    );

    data.hash_key = hashKey;

    return this.post('/api/checkstatus', data, options);
  }

  /**
   * Confirm a pre-authorization payment
   */
  async confirmPayment(
    confirmData: Omit<ConfirmPaymentRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(confirmData) as ConfirmPaymentRequest;

    // Generate hash key for payment confirmation
    // Hash format: merchant_key|invoice_id|status
    const hashKey = generateConfirmPaymentHashKey(
      data.merchant_key,
      data.invoice_id,
      data.status,
      this.client['config'].appSecret
    );
    data.hash_key = hashKey;

    return this.post('/api/confirmPayment', data, options);
  }

  /**
   * Refund a payment
   */
  async refund(
    refundData: Omit<RefundRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(refundData);
    return this.post('/api/refund', data, options);
  }

  /**
   * Get merchant active installments
   * Note: This endpoint uses Bearer token authentication
   */
  async getInstallments(options?: RequestOptions): Promise<SipayApiResponse<InstallmentsResponse>> {
    // This endpoint doesn't require request body, only headers with Bearer token
    return this.post('/api/installments', {}, options);
  }

  /**
   * Get authentication token
   * Used for Bearer token authentication in certain endpoints
   */
  async getToken(
    tokenData: GetTokenRequest,
    options?: RequestOptions
  ): Promise<SipayApiResponse<TokenResponse>> {
    return this.post('/api/token', tokenData, options);
  }

  /**
   * Legacy 2D payment method (maintains compatibility)
   */
  async pay(
    paymentData: Omit<Payment2DRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(paymentData);
    return this.post('/api/pay', data, options);
  }
}
