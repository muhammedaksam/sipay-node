import { SipayResource } from './base';
import { SipayApiResponse, RequestOptions, CashoutResponse } from '../types';

export interface CashoutToBankRequest {
  merchant_key: string;
  hash_key: string;
  invoice_id: string;
  cashout_type: number; // Must be 1 for cashout to bank
  cashout_data: Array<{
    unique_id: string;
    name_surname: string;
    iban: string;
    name_of_bank?: string;
    amount: number;
    currency: string;
    id_tc_kn: string;
    gsm_number: string;
    description?: string;
  }>;
}

export class Cashout extends SipayResource {
  /**
   * Initiate a cashout to bank account
   * Note: This endpoint requires Bearer token authentication and uses a different request structure
   * Hash generation format is not documented in the API spec - requires investigation
   */
  async toBank(
    cashoutData: Omit<CashoutToBankRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<CashoutResponse>> {
    const data = this.addMerchantKey(cashoutData) as CashoutToBankRequest;

    // TODO: Implement hash generation for cashout endpoint
    // The API spec shows hash_key is required but doesn't provide hash generation examples
    // Hash format needs to be determined - possibly based on merchant_key + invoice_id + amount
    data.hash_key = 'TODO_IMPLEMENT_CASHOUT_HASH_GENERATION';

    return this.post('/api/cashout/tobank', data, options);
  }
}
