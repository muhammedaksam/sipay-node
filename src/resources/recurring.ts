import { SipayResource } from './base';
import {
  SipayApiResponse,
  RequestOptions,
  RecurringQueryRequest,
  RecurringQueryResponse,
  RecurringPlanProcessRequest,
  RecurringPlanProcessResponse,
  RecurringPlanUpdateRequest,
  RecurringPlanUpdateResponse,
} from '../types';

export class Recurring extends SipayResource {
  /**
   * Query recurring payment details
   * POST /api/recurringPlan/query
   */
  async queryPlan(
    queryData: Omit<RecurringQueryRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<RecurringQueryResponse> {
    const data = this.addMerchantKey(queryData);
    return this.post('/api/recurringPlan/query', data, options) as any;
  }

  /**
   * Check if a recurring plan has been processed
   * POST /api/recurring/plan/process
   */
  async processPlan(
    processData: RecurringPlanProcessRequest,
    options?: RequestOptions
  ): Promise<SipayApiResponse<RecurringPlanProcessResponse>> {
    return this.post('/api/recurring/plan/process', processData, options);
  }

  /**
   * Update a recurring plan (amount, status, payment number)
   * POST /api/recurringPlan/update
   */
  async updatePlan(
    updateData: Omit<RecurringPlanUpdateRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<RecurringPlanUpdateResponse>> {
    const data = this.addMerchantKey(updateData);
    return this.post('/api/recurringPlan/update', data, options);
  }
}
