import { SipayResource } from './base';
import {
  BrandedSolutionRequest,
  BrandedStatusRequest,
  SipayApiResponse,
  RequestOptions,
} from '../types';

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

  /**
   * Check the status of a branded payment
   */
  async checkStatus(
    statusData: Omit<BrandedStatusRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(statusData);
    return this.post('/purchase/status', data, options);
  }
}
