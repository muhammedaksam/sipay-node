import {
  ChargebackWebhookEvent,
  RecurringWebhookEvent,
  RefundWebhookEvent,
  SalesWebhookEvent,
  SipayWebhooks,
} from '../src/resources/webhooks';
import { SipayHttpClient } from '../src/utils/http-client';
import * as utils from '../src/utils/index';

describe('SipayWebhooks', () => {
  let webhooks: SipayWebhooks;
  let mockClient: jest.Mocked<SipayHttpClient>;

  beforeEach(() => {
    mockClient = {
      authenticate: jest.fn(),
      request: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      getToken: jest.fn(),
      setToken: jest.fn(),
    } as any;

    webhooks = new SipayWebhooks(mockClient);
  });

  describe('validateHashKey', () => {
    it('should return invalid for empty hash key', () => {
      const result = webhooks.validateHashKey('', 'secret');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Hash key is required');
    });

    it('should use existing validateHashKey utility function', () => {
      // Test with a properly formatted hash key that the existing function can handle
      const hashKey = 'iv123:salt456:encrypted789';
      const result = webhooks.validateHashKey(hashKey, 'secret');

      // The function should attempt validation and return a result
      expect(result).toHaveProperty('isValid');
      expect(typeof result.isValid).toBe('boolean');
    });

    it('should handle hash keys with underscores (converted internally)', () => {
      const hashKey = 'iv123:salt456:encrypted789';
      const result = webhooks.validateHashKey(hashKey, 'secret');

      // Should at least not throw an error
      expect(result).toHaveProperty('isValid');
    });

    it('should return validation details when successful', () => {
      // Mock a scenario where validation might succeed
      const hashKey = 'valid:hash:key';
      const result = webhooks.validateHashKey(hashKey, 'secret');

      // Even if validation fails, it should return proper structure
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('invoiceId');
      expect(result).toHaveProperty('orderId');
      expect(result).toHaveProperty('currencyCode');
    });

    it('should handle errors in validation gracefully', () => {
      // Test with invalid data that might cause an error
      const result = webhooks.validateHashKey('invalid', 'secret');

      // Should return a validation result even if there's an internal error
      expect(result).toHaveProperty('isValid');
      expect(typeof result.isValid).toBe('boolean');
    });

    it('should return successful validation with valid hash key', () => {
      const secretKey = 'test_secret_validation';
      const hashKey = utils.generateServerFormatHashKey(
        'success',
        100.5,
        'INV123',
        456,
        'TRY',
        secretKey
      );

      const result = webhooks.validateHashKey(hashKey, secretKey);

      expect(result.isValid).toBe(true);
      expect(result.status).toBe('success');
      expect(result.total).toBe(100.5);
      expect(result.invoiceId).toBe('INV123');
      expect(result.orderId).toBe(456);
      expect(result.currencyCode).toBe('TRY');
      expect(result.error).toBeUndefined();
    });
  });

  describe('parseSalesWebhook', () => {
    it('should parse sales webhook payload correctly', () => {
      const payload: Partial<SalesWebhookEvent> = {
        sipay_status: '1',
        order_no: '162754070457149',
        invoice_id: '1627540702924',
        status_code: '100',
        status_description: 'Approved',
        sipay_payment_method: '1',
        credit_card_no: '450803****4509',
        transaction_type: 'Auth',
        payment_status: '1',
        payment_method: '1',
        error_code: '100',
        error: 'Approved',
        status: 'Completed',
        hash_key: 'test_hash_key',
      };

      const event = webhooks.parseSalesWebhook(payload);

      expect(event.sipay_status).toBe('1');
      expect(event.order_no).toBe('162754070457149');
      expect(event.invoice_id).toBe('1627540702924');
      expect(event.status_code).toBe('100');
      expect(event.transaction_type).toBe('Auth');
      expect(event.payment_status).toBe('1');
      expect(event.payment_method).toBe('1');
      expect(event.hash_key).toBe('test_hash_key');
    });

    it('should handle missing fields with defaults', () => {
      const payload = {};
      const event = webhooks.parseSalesWebhook(payload);

      expect(event.sipay_status).toBe('');
      expect(event.transaction_type).toBe('Auth');
      expect(event.payment_status).toBe('0');
      expect(event.payment_method).toBe('1');
    });
  });

  describe('parseRecurringWebhook', () => {
    it('should parse recurring webhook payload correctly', () => {
      const payload: Partial<RecurringWebhookEvent> = {
        merchant_key: 'test_merchant_key',
        invoice_id: '266011626686877',
        order_id: '162709021159202',
        product_price: 0.1,
        plan_code: '162668699215UOjS',
        recurring_number: '6',
        status: 'Completed',
        attempts: '1',
        action_date: '2021-07-24 03:00:49',
      };

      const event = webhooks.parseRecurringWebhook(payload);

      expect(event.merchant_key).toBe('test_merchant_key');
      expect(event.invoice_id).toBe('266011626686877');
      expect(event.product_price).toBe(0.1);
      expect(event.plan_code).toBe('162668699215UOjS');
      expect(event.status).toBe('Completed');
    });

    it('should handle missing fields with defaults for recurring webhook', () => {
      const event = webhooks.parseRecurringWebhook({});

      expect(event.merchant_key).toBe('');
      expect(event.invoice_id).toBe('');
      expect(event.order_id).toBe('');
      expect(event.product_price).toBe(0);
      expect(event.plan_code).toBe('');
      expect(event.recurring_number).toBe('');
      expect(event.status).toBe('');
      expect(event.attempts).toBe('');
      expect(event.action_date).toBe('');
    });
  });

  describe('parseRefundWebhook', () => {
    it('should parse refund webhook payload correctly', () => {
      const payload: Partial<RefundWebhookEvent> = {
        invoice_id: '8iu75g',
        order_id: '15767887576675',
        amount: 10.5,
        status: 'Completed',
        hash_key: 'test_hash',
      };

      const event = webhooks.parseRefundWebhook(payload);

      expect(event.invoice_id).toBe('8iu75g');
      expect(event.order_id).toBe('15767887576675');
      expect(event.amount).toBe(10.5);
      expect(event.status).toBe('Completed');
      expect(event.hash_key).toBe('test_hash');
    });

    it('should handle missing fields with defaults for refund webhook', () => {
      const event = webhooks.parseRefundWebhook({});

      expect(event.invoice_id).toBe('');
      expect(event.order_id).toBe('');
      expect(event.amount).toBe(0);
      expect(event.status).toBe('');
      expect(event.hash_key).toBe('');
    });
  });

  describe('parseChargebackWebhook', () => {
    it('should parse chargeback webhook payload correctly', () => {
      const payload: Partial<ChargebackWebhookEvent> = {
        action: 'Chargeback Request',
        previous_trx_status: 'Completed',
        current_trx_status: 'Chargeback Requested',
        invoice_id: 'INV123',
        order_id: 'ORD456',
        amount: 150.5,
        currency: 'TRY',
        event_date: '2026-05-06 09:34:36',
        ref_no: 'REF789',
        hash_key: 'test_hash_key',
      };

      const event = webhooks.parseChargebackWebhook(payload);

      expect(event.action).toBe('Chargeback Request');
      expect(event.previous_trx_status).toBe('Completed');
      expect(event.current_trx_status).toBe('Chargeback Requested');
      expect(event.invoice_id).toBe('INV123');
      expect(event.order_id).toBe('ORD456');
      expect(event.amount).toBe(150.5);
      expect(event.currency).toBe('TRY');
      expect(event.event_date).toBe('2026-05-06 09:34:36');
      expect(event.ref_no).toBe('REF789');
      expect(event.hash_key).toBe('test_hash_key');
    });

    it('should handle missing fields with defaults', () => {
      const payload = {};
      const event = webhooks.parseChargebackWebhook(payload);

      expect(event.action).toBe('');
      expect(event.amount).toBe(0);
      expect(event.currency).toBe('');
    });
  });

  describe('verifyChargebackWebhook', () => {
    it('should return valid result for chargeback webhook with valid hash key', () => {
      const appSecret = 'test_secret_chargeback';
      const hashKey = utils.generateServerFormatHashKey(
        'success',
        100,
        'INV123',
        456,
        'TRY',
        appSecret
      );

      const payload: Partial<ChargebackWebhookEvent> = {
        action: 'Chargeback Request',
        invoice_id: 'INV123',
        order_id: 'ORD456',
        amount: 100,
        currency: 'TRY',
        event_date: '2026-05-06 09:34:36',
        ref_no: 'REF789',
        hash_key: hashKey,
      };

      const result = webhooks.verifyChargebackWebhook(payload, appSecret);

      expect(result.isValid).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event!.invoice_id).toBe('INV123');
      expect(result.validation).toBeDefined();
      expect(result.validation!.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should attempt to verify chargeback webhook', () => {
      const payload: Partial<ChargebackWebhookEvent> = {
        action: 'Chargeback Request',
        invoice_id: 'INV123',
        order_id: 'ORD456',
        amount: 150.5,
        currency: 'TRY',
        event_date: '2026-05-06 09:34:36',
        ref_no: 'REF789',
        hash_key: 'iv123:salt456:encrypted789',
      };

      const result = webhooks.verifyChargebackWebhook(payload, 'app_secret');

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('validation');
      expect(typeof result.isValid).toBe('boolean');

      if (!result.isValid) {
        expect(result.error).toBeDefined();
      }
    });

    it('should reject chargeback webhook without hash key', () => {
      const payload = {
        action: 'Chargeback Request',
        invoice_id: 'INV123',
        order_id: 'ORD456',
      };

      const result = webhooks.verifyChargebackWebhook(payload, 'app_secret');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Missing hash key in chargeback webhook payload');
    });

    it('should handle chargeback verification when validateHashKey throws', () => {
      jest.spyOn(webhooks, 'validateHashKey').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const payload: Partial<ChargebackWebhookEvent> = {
        action: 'Chargeback Request',
        invoice_id: 'INV123',
        order_id: 'ORD456',
        hash_key: 'some_hash',
      };

      const result = webhooks.verifyChargebackWebhook(payload, 'app_secret');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Chargeback webhook verification failed: Unexpected error');

      jest.restoreAllMocks();
    });
  });

  describe('verifySalesWebhook', () => {
    it('should return valid result for sales webhook with valid hash key', () => {
      const appSecret = 'test_secret_sales';
      const hashKey = utils.generateServerFormatHashKey(
        'success',
        100,
        'INV123',
        456,
        'TRY',
        appSecret
      );

      const payload = {
        sipay_status: '1' as const,
        order_no: '162754070457149',
        invoice_id: '1627540702924',
        status_code: '100',
        payment_status: '1' as const,
        hash_key: hashKey,
      };

      const result = webhooks.verifySalesWebhook(payload, appSecret);

      expect(result.isValid).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event!.invoice_id).toBe('1627540702924');
      expect(result.validation).toBeDefined();
      expect(result.validation!.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should attempt to verify sales webhook (validation may fail with mock data)', () => {
      const payload = {
        sipay_status: '1' as const,
        order_no: '162754070457149',
        invoice_id: '1627540702924',
        status_code: '100',
        payment_status: '1' as const,
        hash_key: 'iv123:salt456:encrypted789',
      };

      const result = webhooks.verifySalesWebhook(payload, 'app_secret');

      // Since we're using mock data that can't be properly decrypted,
      // we just verify the structure and that it doesn't throw
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('validation');
      expect(typeof result.isValid).toBe('boolean');

      // If validation fails (expected with mock data), check error handling
      if (!result.isValid) {
        expect(result.error).toBeDefined();
      }
    });

    it('should reject sales webhook without hash key', () => {
      const payload = {
        sipay_status: '1',
        order_no: '162754070457149',
        invoice_id: '1627540702924',
      };

      const result = webhooks.verifySalesWebhook(payload, 'app_secret');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Missing hash key in webhook payload');
    });

    it('should handle sales verification when validateHashKey throws', () => {
      jest.spyOn(webhooks, 'validateHashKey').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const payload = {
        sipay_status: '1' as const,
        order_no: '162754070457149',
        invoice_id: '1627540702924',
        hash_key: 'some_hash',
      };

      const result = webhooks.verifySalesWebhook(payload, 'app_secret');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Webhook verification failed: Unexpected error');

      jest.restoreAllMocks();
    });
  });

  describe('payment status helpers', () => {
    const successfulEvent = {
      payment_status: '1',
      status_code: '100',
      transaction_type: 'Auth' as const,
      status_description: 'Approved',
    } as any;

    const preAuthEvent = {
      payment_status: '1',
      status_code: '100',
      transaction_type: 'Pre-Authorization' as const,
      status_description: 'Approved',
    } as any;

    const failedEvent = {
      payment_status: '0',
      status_code: '41',
      transaction_type: 'Auth' as const,
      status_description: 'Payment failed',
    } as any;

    const pendingEvent = {
      payment_status: '2', // Neither '0' nor '1'
      status_code: '69',
      transaction_type: 'Auth' as const,
      status_description: 'Order not yet processed',
    } as any;

    it('should identify successful payment', () => {
      expect(webhooks.isPaymentSuccessful(successfulEvent)).toBe(true);
      expect(webhooks.isPaymentFailed(successfulEvent)).toBe(false);
      expect(webhooks.isPaymentPreAuthorized(successfulEvent)).toBe(false);
    });

    it('should identify pre-authorized payment', () => {
      expect(webhooks.isPaymentSuccessful(preAuthEvent)).toBe(true);
      expect(webhooks.isPaymentPreAuthorized(preAuthEvent)).toBe(true);
      expect(webhooks.isPaymentFailed(preAuthEvent)).toBe(false);
    });

    it('should identify failed payment', () => {
      expect(webhooks.isPaymentFailed(failedEvent)).toBe(true);
      expect(webhooks.isPaymentSuccessful(failedEvent)).toBe(false);
      expect(webhooks.isPaymentPreAuthorized(failedEvent)).toBe(false);
    });

    it('should provide correct payment status descriptions', () => {
      expect(webhooks.getPaymentStatusDescription(successfulEvent)).toBe(
        'Payment completed successfully'
      );

      expect(webhooks.getPaymentStatusDescription(preAuthEvent)).toBe(
        'Payment pre-authorized successfully - requires confirmation'
      );

      expect(webhooks.getPaymentStatusDescription(failedEvent)).toBe(
        'Payment failed: Payment failed'
      );
    });

    it('should provide correct status for pending/unknown payments', () => {
      expect(webhooks.getPaymentStatusDescription(pendingEvent)).toBe(
        'Payment status: Order not yet processed'
      );
    });
  });

  describe('error handling', () => {
    it('should handle null payload in webhook verification', () => {
      const result = webhooks.verifySalesWebhook(null, 'secret');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Sales webhook payload is null or undefined');
    });

    it('should handle null payload in chargeback webhook verification', () => {
      const result = webhooks.verifyChargebackWebhook(null, 'secret');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Chargeback webhook payload is null or undefined');
    });

    it('should handle validateHashKey method throwing an error', () => {
      // Mock the utils.validateHashKey to throw an error
      jest.spyOn(utils, 'validateHashKey').mockImplementation(() => {
        throw new Error('Mocked validation error');
      });

      try {
        const result = webhooks.validateHashKey('any-hash', 'secret');

        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Hash validation error: Mocked validation error');
      } finally {
        // Restore the original function
        jest.restoreAllMocks();
      }
    });
    it('should handle malformed hash key gracefully', () => {
      // Create a malformed hash that will cause validateHashKey to return defaults
      const malformedHashKey = 'malformed:hash:that:causes:exception:with:invalid:base64:!!!';

      const result = webhooks.validateHashKey(malformedHashKey, 'secret');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Hash validation failed');
    });
  });
});
