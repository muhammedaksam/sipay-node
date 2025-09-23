import { SipayResource } from './base';
import { CommissionRequest, SipayApiResponse, RequestOptions, CommissionResponse } from '../types';

export class Commissions extends SipayResource {
  /**
   * Get commission information for a currency
   */
  async getCommissions(
    commissionData: CommissionRequest,
    options?: RequestOptions
  ): Promise<SipayApiResponse<CommissionResponse>> {
    return this.get('/api/commissions', commissionData, options);
  }
}
