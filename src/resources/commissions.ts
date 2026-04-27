import { SipayResource } from './base';
import { CommissionRequest, SipayApiResponse, RequestOptions, CommissionResponse } from '../types';

export class Commissions extends SipayResource {
  /**
   * Get commission information for a currency
   * POST /api/commissions
   */
  async getCommissions(
    commissionData: CommissionRequest,
    options?: RequestOptions
  ): Promise<SipayApiResponse<CommissionResponse>> {
    return this.post('/api/commissions', commissionData, options);
  }
}
