import { SipayResource } from './base';
import { BrandedSolutionRequest, SipayApiResponse, RequestOptions } from '../types';

export class BrandedSolution extends SipayResource {
  /**
   * Create a branded payment link
   */
  async createPaymentLink(
    linkData: Omit<BrandedSolutionRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<{ link: string }>> {
    const data = this.addMerchantKey(linkData);
    return this.post('/purchase/link', data, options);
  }

  // Note: For checking branded payment status, use the standard Payments.checkStatus() method
  // with the invoice_id from the branded payment link
}
