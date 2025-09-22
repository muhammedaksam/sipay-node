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
} from '../types';
import { generatePaymentHashKey, generateStatusHashKey } from '../utils';

export class Payments extends SipayResource {
  /**
   * Make a 2D payment (without 3D Secure authentication)
   */
  async pay2D(
    paymentData: Omit<Payment2DRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(paymentData);

    // Generate hash key for payment
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
