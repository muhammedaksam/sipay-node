import { SipayResource } from './base';
import {
  RecurringQueryRequest,
  RecurringPlanProcessRequest,
  SipayApiResponse,
  RequestOptions,
} from '../types';

export class Recurring extends SipayResource {
  /**
   * Query recurring payment information
   */
  async query(
    queryData: RecurringQueryRequest,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    return this.post('/api/QueryRecurring', queryData, options);
  }

  /**
   * Process a recurring payment plan
   */
  async processPlan(
    planData: RecurringPlanProcessRequest,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    return this.post('/api/recurring/plan/process', planData, options);
  }
}
