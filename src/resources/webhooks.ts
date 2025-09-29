import { SipayResource } from './base';
import { validateHashKey } from '../utils';

export interface SalesWebhookEvent {
  sipay_status: string;
  order_no: string;
  invoice_id: string;
  status_code: string;
  status_description: string;
  sipay_payment_method: string;
  credit_card_no: string;
  transaction_type: 'Auth' | 'Pre-Authorization';
  payment_status: '0' | '1';
  payment_method: '1' | '2' | '3'; // 1=Credit card, 2=Mobile, 3=Wallet
  error_code: string;
  error: string;
  status: string;
  hash_key: string;
}

export interface RecurringWebhookEvent {
  merchant_key: string;
  invoice_id: string;
  order_id: string;
  product_price: number;
  plan_code: string;
  recurring_number: string;
  status: string;
  attempts: string;
  action_date: string;
}

export interface RefundWebhookEvent {
  invoice_id: string;
  order_id: string;
  amount: number;
  status: string;
  hash_key: string;
}

export interface WebhookValidationResult {
  isValid: boolean;
  status?: string;
  total?: number;
  invoiceId?: string;
  orderId?: number;
  currencyCode?: string;
  error?: string;
}

/**
 * Webhooks resource for handling Sipay webhook events
 * Provides methods to validate and parse webhook notifications
 *
 * Uses the existing validateHashKey utility from utils for hash validation,
 * which provides full AES-256-CBC decryption compatible with PHP SDK
 */
export class SipayWebhooks extends SipayResource {
  /**
   * Validate webhook hash key to ensure request authenticity
   * Uses the existing validateHashKey utility function
   */
  validateHashKey(hashKey: string, secretKey: string): WebhookValidationResult {
    try {
      if (!hashKey) {
        return { isValid: false, error: 'Hash key is required' };
      }

      // Use the existing validateHashKey function from utils
      const [status, total, invoiceId, orderId, currencyCode] = validateHashKey(hashKey, secretKey);

      // If we got valid data back, consider it a successful validation
      const isValid =
        status !== '' || total !== 0 || invoiceId !== '' || orderId !== 0 || currencyCode !== '';

      return {
        isValid,
        status,
        total,
        invoiceId,
        orderId,
        currencyCode,
        error: isValid ? undefined : 'Hash validation failed',
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Hash validation error: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Parse sales webhook payload
   */
  parseSalesWebhook(payload: any): SalesWebhookEvent {
    return {
      sipay_status: payload.sipay_status || '',
      order_no: payload.order_no || '',
      invoice_id: payload.invoice_id || '',
      status_code: payload.status_code || '',
      status_description: payload.status_description || '',
      sipay_payment_method: payload.sipay_payment_method || '',
      credit_card_no: payload.credit_card_no || '',
      transaction_type: payload.transaction_type || 'Auth',
      payment_status: payload.payment_status || '0',
      payment_method: payload.payment_method || '1',
      error_code: payload.error_code || '',
      error: payload.error || '',
      status: payload.status || '',
      hash_key: payload.hash_key || '',
    };
  }

  /**
   * Parse recurring webhook payload
   */
  parseRecurringWebhook(payload: any): RecurringWebhookEvent {
    return {
      merchant_key: payload.merchant_key || '',
      invoice_id: payload.invoice_id || '',
      order_id: payload.order_id || '',
      product_price: parseFloat(payload.product_price) || 0,
      plan_code: payload.plan_code || '',
      recurring_number: payload.recurring_number || '',
      status: payload.status || '',
      attempts: payload.attempts || '',
      action_date: payload.action_date || '',
    };
  }

  /**
   * Parse refund webhook payload
   */
  parseRefundWebhook(payload: any): RefundWebhookEvent {
    return {
      invoice_id: payload.invoice_id || '',
      order_id: payload.order_id || '',
      amount: parseFloat(payload.amount) || 0,
      status: payload.status || '',
      hash_key: payload.hash_key || '',
    };
  }

  /**
   * Verify sales webhook - validates hash and parses event
   */
  verifySalesWebhook(
    payload: any,
    appSecret: string
  ): {
    isValid: boolean;
    event?: SalesWebhookEvent;
    validation?: WebhookValidationResult;
    error?: string;
  } {
    try {
      const event = this.parseSalesWebhook(payload);

      if (!event.hash_key) {
        return { isValid: false, error: 'Missing hash key in webhook payload' };
      }

      const validation = this.validateHashKey(event.hash_key, appSecret);

      return {
        isValid: validation.isValid,
        event: validation.isValid ? event : undefined,
        validation,
        error: validation.error,
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Webhook verification failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Check if payment was successful based on webhook data
   */
  isPaymentSuccessful(event: SalesWebhookEvent): boolean {
    return event.payment_status === '1' && event.status_code === '100';
  }

  /**
   * Check if payment was pre-authorized (needs confirmation)
   */
  isPaymentPreAuthorized(event: SalesWebhookEvent): boolean {
    return event.payment_status === '1' && event.transaction_type === 'Pre-Authorization';
  }

  /**
   * Check if payment failed
   */
  isPaymentFailed(event: SalesWebhookEvent): boolean {
    return event.payment_status === '0';
  }

  /**
   * Get human-readable payment status
   */
  getPaymentStatusDescription(event: SalesWebhookEvent): string {
    if (this.isPaymentSuccessful(event)) {
      return event.transaction_type === 'Pre-Authorization'
        ? 'Payment pre-authorized successfully - requires confirmation'
        : 'Payment completed successfully';
    }

    if (this.isPaymentFailed(event)) {
      return `Payment failed: ${event.status_description}`;
    }

    return `Payment status: ${event.status_description}`;
  }
}
