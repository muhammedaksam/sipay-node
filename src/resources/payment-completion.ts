import { SipayResource } from './base';
import { SipayApiResponse, RequestOptions, PaymentCompleteResponse } from '../types';
import * as crypto from 'crypto';
const { createHash, createCipheriv } = crypto;

export interface PaymentCompleteRequest {
  merchant_key: string;
  invoice_id: string;
  order_id: string;
  status: 'complete' | 'cancel';
  hash_key: string;
}

export class PaymentCompletion extends SipayResource {
  /**
   * Complete or cancel a 3D payment transaction
   * This is used for merchant 3D model where payment completion is done by merchant
   */
  async completePayment(
    completionData: Omit<PaymentCompleteRequest, 'merchant_key' | 'hash_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse<PaymentCompleteResponse>> {
    const data = this.addMerchantKey(completionData) as PaymentCompleteRequest;

    // Generate hash key using the payment completion format
    // Hash format: merchant_key|invoice_id|order_id|status
    const hashKey = this.generatePaymentCompletionHashKey(
      this.client['config'].merchantKey,
      data.invoice_id,
      data.order_id,
      data.status,
      this.client['config'].appSecret
    );

    data.hash_key = hashKey;

    return this.post('/payment/complete', data, options);
  }

  /**
   * Generate hash key for payment completion (using official method)
   */
  private generatePaymentCompletionHashKey(
    merchantKey: string,
    invoiceId: string,
    orderId: string,
    status: string,
    appSecret: string
  ): string {
    try {
      const data = merchantKey + '|' + invoiceId + '|' + orderId + '|' + status;

      const iv = createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 16);

      const password = createHash('sha1').update(appSecret).digest('hex');

      const salt = createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 4);

      const saltWithPassword = createHash('sha256')
        .update(password + salt)
        .digest('hex')
        .slice(0, 32);

      const cipher = createCipheriv('aes-256-cbc', saltWithPassword, iv);

      let encrypted = cipher.update(data, 'binary', 'base64');
      encrypted += cipher.final('base64');

      const msgBundle = iv + ':' + salt + ':' + encrypted;

      return msgBundle.replace(/\//g, '__');
    } catch (error) {
      throw new Error(`Payment completion hash key generation failed: ${error}`);
    }
  }
}
