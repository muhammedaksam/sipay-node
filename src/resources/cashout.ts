import { SipayResource } from './base';
import { SipayApiResponse, RequestOptions, CashoutResponse } from '../types';
import { generateHashKey } from '../utils';

export interface CashoutToBankRequest {
  merchant_key: string;
  hash_key: string;
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
  reverse_web_hook_key?: string;
  app_lang?: string;
}

export class Cashout extends SipayResource {
  /**
   * Initiate a cashout to bank account
   * POST /api/cashout/tobank
   */
  async toBank(
    cashoutData: Omit<CashoutToBankRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<CashoutResponse>> {
    const data = this.addMerchantKey(cashoutData) as CashoutToBankRequest;

    // Generate hash key for cashout
    const hashParts = [data.merchant_key];
    data.hash_key = generateHashKey(hashParts, this.client['config'].appSecret);

    return this.post('/api/cashout/tobank', data, options);
  }
}
