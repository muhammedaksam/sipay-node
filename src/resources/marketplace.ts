import { SipayResource } from './base';
import { SipayApiResponse, RequestOptions } from '../types';
import { generatePaymentHashKey } from '../utils';

export interface MarketplaceSaleRequest {
  merchant_key: string;
  cc_holder_name: string;
  cc_no: string;
  expiry_month: string;
  expiry_year: string;
  cvv?: string;
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
    sub_merchant_key: string;
    sub_merchant_price: number;
  }>;
  name: string;
  surname: string;
  hash_key?: string;
}

export interface MarketplaceRefundRequest {
  merchant_key: string;
  invoice_id: string;
  amount: string;
  sub_merchant_key?: string;
}

export interface MarketplaceStatusRequest {
  merchant_key: string;
  invoice_id: string;
  include_pending_status?: string;
}

export interface MarketplaceApproveRequest {
  merchant_key: string;
  invoice_id: string;
  sub_merchant_key: string;
  amount: string;
}

export interface SettlementsRequest {
  merchant_key: string;
  sub_merchant_key?: string;
  start_date?: string;
  end_date?: string;
}

export class Marketplace extends SipayResource {
  /**
   * Make a marketplace payment (non-secure/2D)
   */
  async pay2D(
    paymentData: Omit<MarketplaceSaleRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(paymentData) as MarketplaceSaleRequest;

    // Generate hash key for marketplace payment
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

    return this.post('/api/marketplace/sale/pay/smart/non-secure', data, options);
  }

  /**
   * Make a marketplace payment with 3D Secure
   */
  async pay3D(
    paymentData: Omit<MarketplaceSaleRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(paymentData);
    return this.post('/api/marketplace/sale/pay/smart/secure', data, options);
  }

  /**
   * Refund a marketplace payment
   */
  async refund(
    refundData: Omit<MarketplaceRefundRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(refundData);
    return this.post('/ccpayment/api/marketplace/sale/refund', data, options);
  }

  /**
   * Check status of a marketplace payment
   */
  async checkStatus(
    statusData: Omit<MarketplaceStatusRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(statusData);
    return this.post('/ccpayment/api/marketplace/sale/check/status', data, options);
  }

  /**
   * Get settlements information
   */
  async getSettlements(
    settlementsData: Omit<SettlementsRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(settlementsData);
    return this.post('/ccpayment/api/settlements', data, options);
  }

  /**
   * Approve a marketplace transaction
   */
  async approveTransaction(
    approveData: Omit<MarketplaceApproveRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(approveData);
    return this.post('/ccpayment/api/marketplace/sale/transaction/approve', data, options);
  }
}
