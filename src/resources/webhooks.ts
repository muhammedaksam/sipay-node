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

export interface ChargebackWebhookEvent {
  action: string;
  previous_trx_status: string;
  current_trx_status: string;
  invoice_id: string;
  order_id: string;
  amount: number;
  currency: string;
  event_date: string;
  ref_no: string;
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
   * Accepts raw webhook data (form-encoded, all values as strings)
   */
  parseSalesWebhook(payload: Partial<SalesWebhookEvent>): SalesWebhookEvent {
    return {
      sipay_status: String(payload.sipay_status ?? ''),
      order_no: String(payload.order_no ?? ''),
      invoice_id: String(payload.invoice_id ?? ''),
      status_code: String(payload.status_code ?? ''),
      status_description: String(payload.status_description ?? ''),
      sipay_payment_method: String(payload.sipay_payment_method ?? ''),
      credit_card_no: String(payload.credit_card_no ?? ''),
      transaction_type:
        (String(payload.transaction_type ?? '') as SalesWebhookEvent['transaction_type']) || 'Auth',
      payment_status:
        (String(payload.payment_status ?? '') as SalesWebhookEvent['payment_status']) || '0',
      payment_method:
        (String(payload.payment_method ?? '') as SalesWebhookEvent['payment_method']) || '1',
      error_code: String(payload.error_code ?? ''),
      error: String(payload.error ?? ''),
      status: String(payload.status ?? ''),
      hash_key: String(payload.hash_key ?? ''),
    };
  }

  /**
   * Parse recurring webhook payload
   * Accepts raw webhook data (form-encoded, all values as strings)
   */
  parseRecurringWebhook(payload: Partial<RecurringWebhookEvent>): RecurringWebhookEvent {
    return {
      merchant_key: String(payload.merchant_key ?? ''),
      invoice_id: String(payload.invoice_id ?? ''),
      order_id: String(payload.order_id ?? ''),
      product_price: parseFloat(String(payload.product_price ?? '')) || 0,
      plan_code: String(payload.plan_code ?? ''),
      recurring_number: String(payload.recurring_number ?? ''),
      status: String(payload.status ?? ''),
      attempts: String(payload.attempts ?? ''),
      action_date: String(payload.action_date ?? ''),
    };
  }

  /**
   * Parse refund webhook payload
   * Accepts raw webhook data (form-encoded, all values as strings)
   */
  parseRefundWebhook(payload: Partial<RefundWebhookEvent>): RefundWebhookEvent {
    return {
      invoice_id: String(payload.invoice_id ?? ''),
      order_id: String(payload.order_id ?? ''),
      amount: parseFloat(String(payload.amount ?? '')) || 0,
      status: String(payload.status ?? ''),
      hash_key: String(payload.hash_key ?? ''),
    };
  }

  /**
   * Parse chargeback webhook payload
   * Accepts raw webhook data (JSON with typed fields)
   */
  parseChargebackWebhook(payload: Partial<ChargebackWebhookEvent>): ChargebackWebhookEvent {
    return {
      action: String(payload.action ?? ''),
      previous_trx_status: String(payload.previous_trx_status ?? ''),
      current_trx_status: String(payload.current_trx_status ?? ''),
      invoice_id: String(payload.invoice_id ?? ''),
      order_id: String(payload.order_id ?? ''),
      amount: parseFloat(String(payload.amount ?? '')) || 0,
      currency: String(payload.currency ?? ''),
      event_date: String(payload.event_date ?? ''),
      ref_no: String(payload.ref_no ?? ''),
      hash_key: String(payload.hash_key ?? ''),
    };
  }

  /**
   * Verify chargeback webhook - validates hash and parses event
   */
  verifyChargebackWebhook(
    payload: Partial<ChargebackWebhookEvent> | null,
    appSecret: string
  ): {
    isValid: boolean;
    event?: ChargebackWebhookEvent;
    validation?: WebhookValidationResult;
    error?: string;
  } {
    try {
      if (!payload) {
        return { isValid: false, error: 'Chargeback webhook payload is null or undefined' };
      }

      const event = this.parseChargebackWebhook(payload);

      if (!event.hash_key) {
        return { isValid: false, error: 'Missing hash key in chargeback webhook payload' };
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
        error: `Chargeback webhook verification failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Verify sales webhook - validates hash and parses event
   */
  verifySalesWebhook(
    payload: Partial<SalesWebhookEvent> | null,
    appSecret: string
  ): {
    isValid: boolean;
    event?: SalesWebhookEvent;
    validation?: WebhookValidationResult;
    error?: string;
  } {
    try {
      if (!payload) {
        return { isValid: false, error: 'Sales webhook payload is null or undefined' };
      }

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
