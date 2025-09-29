/**
 * @jest-environment node
 */

import {
  getStatusCodeInfo,
  getSuggestedAction,
  isStatusInGroup,
  StatusCodeGroups,
} from '../src/utils/status-code-helpers';
import { SipayStatusCode, SipayStatusCategory } from '../src/types/status-codes';

describe('Status Code Helpers', () => {
  describe('getStatusCodeInfo', () => {
    it('should return complete info for successful status', () => {
      const info = getStatusCodeInfo(SipayStatusCode.SUCCESSFUL);

      expect(info).toEqual({
        code: SipayStatusCode.SUCCESSFUL,
        description: 'Successful',
        category: SipayStatusCategory.SUCCESS,
        isSuccess: true,
        isError: false,
        isRetryable: false,
        httpEquivalent: 200,
      });
    });

    it('should return complete info for validation error status', () => {
      const info = getStatusCodeInfo(SipayStatusCode.BASIC_VALIDATION);

      expect(info).toEqual({
        code: SipayStatusCode.BASIC_VALIDATION,
        description: 'Basic validation',
        category: SipayStatusCategory.VALIDATION_ERROR,
        isSuccess: false,
        isError: true,
        isRetryable: false,
        httpEquivalent: 400,
      });
    });

    it('should return complete info for authentication error status', () => {
      const info = getStatusCodeInfo(SipayStatusCode.INVALID_CREDENTIALS);

      expect(info).toEqual({
        code: SipayStatusCode.INVALID_CREDENTIALS,
        description: 'Invalid Credentials',
        category: SipayStatusCategory.AUTHENTICATION_ERROR,
        isSuccess: false,
        isError: true,
        isRetryable: false,
        httpEquivalent: 401,
      });
    });

    it('should return complete info for retryable error status', () => {
      const info = getStatusCodeInfo(SipayStatusCode.ORDER_NOT_YET_PROCESSED);

      expect(info).toEqual({
        code: SipayStatusCode.ORDER_NOT_YET_PROCESSED,
        description: 'Order not yet processed',
        category: SipayStatusCategory.PAYMENT_ERROR,
        isSuccess: false,
        isError: true,
        isRetryable: true,
        httpEquivalent: undefined,
      });
    });

    it('should return complete info for status without HTTP equivalent', () => {
      const info = getStatusCodeInfo(SipayStatusCode.ORDER_FAILED);

      expect(info).toMatchObject({
        code: SipayStatusCode.ORDER_FAILED,
        isSuccess: false,
        isError: true,
        httpEquivalent: undefined,
      });
    });
  });

  describe('HTTP status code mapping', () => {
    it('should map success codes to HTTP 200', () => {
      const successCodes = [
        SipayStatusCode.SUCCESSFUL,
        SipayStatusCode.REFUND_REQUEST_CREATED,
        SipayStatusCode.PARTIALLY_SUCCESSFUL,
      ];

      successCodes.forEach((code) => {
        const info = getStatusCodeInfo(code);
        expect(info.httpEquivalent).toBe(200);
      });
    });

    it('should map validation errors to HTTP 400', () => {
      const validationCodes = [
        SipayStatusCode.BASIC_VALIDATION,
        SipayStatusCode.ITEMS_VALIDATION_ERROR,
        SipayStatusCode.PRICE_TOTAL_MISMATCH,
        SipayStatusCode.INVALID_CARD_NUMBER,
      ];

      validationCodes.forEach((code) => {
        const info = getStatusCodeInfo(code);
        expect(info.httpEquivalent).toBe(400);
      });
    });

    it('should map authentication errors to HTTP 401', () => {
      const authCodes = [
        SipayStatusCode.INVALID_CREDENTIALS,
        SipayStatusCode.INVALID_TOKEN_OR_CLIENT_NUMBER,
      ];

      authCodes.forEach((code) => {
        const info = getStatusCodeInfo(code);
        expect(info.httpEquivalent).toBe(401);
      });
    });

    it('should map permission errors to HTTP 403', () => {
      const permissionCodes = [
        SipayStatusCode.PAYMENT_INTEGRATION_NOT_ALLOWED,
        SipayStatusCode.MERCHANT_NOT_ALLOWED_TOKEN_PAYMENT,
        SipayStatusCode.FOREIGN_CARDS_NOT_ALLOWED,
      ];

      permissionCodes.forEach((code) => {
        const info = getStatusCodeInfo(code);
        expect(info.httpEquivalent).toBe(403);
      });
    });

    it('should map not found errors to HTTP 404', () => {
      const notFoundCodes = [
        SipayStatusCode.MERCHANT_NOT_FOUND,
        SipayStatusCode.TRANSACTION_NOT_FOUND,
        SipayStatusCode.POS_NOT_FOUND,
      ];

      notFoundCodes.forEach((code) => {
        const info = getStatusCodeInfo(code);
        expect(info.httpEquivalent).toBe(404);
      });
    });

    it('should map conflict errors to HTTP 409', () => {
      const conflictCodes = [
        SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED,
        SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED_ALT,
      ];

      conflictCodes.forEach((code) => {
        const info = getStatusCodeInfo(code);
        expect(info.httpEquivalent).toBe(409);
      });
    });

    it('should map server errors to HTTP 500', () => {
      const serverErrorCodes = [
        SipayStatusCode.UNKNOWN_ERROR,
        SipayStatusCode.CURRENCY_CONVERSION_FAILED,
        SipayStatusCode.FILE_PROCESSING_ERROR,
      ];

      serverErrorCodes.forEach((code) => {
        const info = getStatusCodeInfo(code);
        expect(info.httpEquivalent).toBe(500);
      });
    });

    it('should return undefined for unmapped status codes', () => {
      const info = getStatusCodeInfo(999); // Non-existent status code
      expect(info.httpEquivalent).toBeUndefined();
    });
  });

  describe('StatusCodeGroups', () => {
    it('should contain success status codes', () => {
      expect(StatusCodeGroups.SUCCESS).toContain(SipayStatusCode.SUCCESSFUL);
      expect(StatusCodeGroups.SUCCESS).toContain(SipayStatusCode.REFUND_REQUEST_CREATED);
      expect(StatusCodeGroups.SUCCESS).toContain(SipayStatusCode.PARTIALLY_SUCCESSFUL);
    });

    it('should contain validation error status codes', () => {
      expect(StatusCodeGroups.VALIDATION_ERRORS).toContain(SipayStatusCode.BASIC_VALIDATION);
      expect(StatusCodeGroups.VALIDATION_ERRORS).toContain(SipayStatusCode.INVALID_CARD_NUMBER);
      expect(StatusCodeGroups.VALIDATION_ERRORS).toContain(SipayStatusCode.PRICE_TOTAL_MISMATCH);
    });

    it('should contain payment error status codes', () => {
      expect(StatusCodeGroups.PAYMENT_ERRORS).toContain(SipayStatusCode.ORDER_FAILED);
      expect(StatusCodeGroups.PAYMENT_ERRORS).toContain(SipayStatusCode.REFUND_FAILED);
      expect(StatusCodeGroups.PAYMENT_ERRORS).toContain(SipayStatusCode.TRANSACTION_NOT_FOUND);
    });

    it('should contain merchant limit error status codes', () => {
      expect(StatusCodeGroups.MERCHANT_LIMIT_ERRORS).toContain(
        SipayStatusCode.MERCHANT_DAILY_TRANSACTION_LIMIT_EXCEEDED
      );
      expect(StatusCodeGroups.MERCHANT_LIMIT_ERRORS).toContain(
        SipayStatusCode.MINIMUM_TRANSACTION_LIMIT_VIOLATED
      );
    });

    it('should contain card error status codes', () => {
      expect(StatusCodeGroups.CARD_ERRORS).toContain(SipayStatusCode.CREDIT_CARD_BLOCKED);
      expect(StatusCodeGroups.CARD_ERRORS).toContain(SipayStatusCode.FOREIGN_CARDS_NOT_ALLOWED);
    });

    it('should contain hash key error status codes', () => {
      expect(StatusCodeGroups.HASH_KEY_ERRORS).toContain(SipayStatusCode.HASH_KEY_VALIDATION_ERROR);
      expect(StatusCodeGroups.HASH_KEY_ERRORS).toContain(SipayStatusCode.INVALID_HASH_KEY);
    });

    it('should contain retryable error status codes', () => {
      expect(StatusCodeGroups.RETRYABLE_ERRORS).toContain(SipayStatusCode.ORDER_NOT_YET_PROCESSED);
      expect(StatusCodeGroups.RETRYABLE_ERRORS).toContain(
        SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED
      );
    });
  });

  describe('isStatusInGroup', () => {
    it('should return true when status code is in the group', () => {
      expect(isStatusInGroup(SipayStatusCode.SUCCESSFUL, StatusCodeGroups.SUCCESS)).toBe(true);
      expect(
        isStatusInGroup(SipayStatusCode.BASIC_VALIDATION, StatusCodeGroups.VALIDATION_ERRORS)
      ).toBe(true);
      expect(isStatusInGroup(SipayStatusCode.ORDER_FAILED, StatusCodeGroups.PAYMENT_ERRORS)).toBe(
        true
      );
    });

    it('should return false when status code is not in the group', () => {
      expect(isStatusInGroup(SipayStatusCode.SUCCESSFUL, StatusCodeGroups.VALIDATION_ERRORS)).toBe(
        false
      );
      expect(isStatusInGroup(SipayStatusCode.ORDER_FAILED, StatusCodeGroups.SUCCESS)).toBe(false);
      expect(isStatusInGroup(999, StatusCodeGroups.SUCCESS)).toBe(false);
    });

    it('should handle empty groups', () => {
      expect(isStatusInGroup(SipayStatusCode.SUCCESSFUL, [])).toBe(false);
    });
  });

  describe('getSuggestedAction', () => {
    it('should suggest action for success status', () => {
      const action = getSuggestedAction(SipayStatusCode.SUCCESSFUL);
      expect(action).toBe('Transaction completed successfully');
    });

    it('should suggest action for validation errors', () => {
      const action = getSuggestedAction(SipayStatusCode.BASIC_VALIDATION);
      expect(action).toBe('Check request parameters and fix validation errors');
    });

    it('should suggest action for authentication errors', () => {
      const action = getSuggestedAction(SipayStatusCode.INVALID_CREDENTIALS);
      expect(action).toBe('Verify API credentials and merchant configuration');
    });

    it('should suggest action for retryable payment errors', () => {
      const action = getSuggestedAction(SipayStatusCode.ORDER_NOT_YET_PROCESSED);
      expect(action).toBe('Transaction may be retried after a short delay');
    });

    it('should suggest action for non-retryable payment errors', () => {
      const action = getSuggestedAction(SipayStatusCode.ORDER_FAILED);
      expect(action).toBe('Check payment details and try with different parameters');
    });

    it('should suggest action for merchant errors', () => {
      const action = getSuggestedAction(SipayStatusCode.MERCHANT_DAILY_TRANSACTION_LIMIT_EXCEEDED);
      expect(action).toBe('Contact your payment provider to resolve merchant configuration issues');
    });

    it('should suggest action for card errors', () => {
      const action = getSuggestedAction(SipayStatusCode.FOREIGN_CARDS_NOT_ALLOWED);
      expect(action).toBe('Try with a different card or contact the card issuer');
    });

    it('should suggest action for hash key errors', () => {
      const action = getSuggestedAction(SipayStatusCode.HASH_KEY_VALIDATION_ERROR);
      expect(action).toBe('Verify hash key generation parameters and algorithm');
    });

    it('should suggest action for recurring errors', () => {
      const action = getSuggestedAction(SipayStatusCode.RECURRING_PAYMENT_VALIDATION_ERROR);
      expect(action).toBe('Check recurring payment configuration and parameters');
    });

    it('should provide default suggestion for unknown errors', () => {
      const action = getSuggestedAction(999); // Unknown status code
      expect(action).toBe('Contact technical support for assistance');
    });
  });

  describe('unknown status codes', () => {
    it('should handle unknown status codes with default category', () => {
      const unknownStatusCode = 99999; // Non-existent status code
      const info = getStatusCodeInfo(unknownStatusCode);

      expect(info.code).toBe(unknownStatusCode);
      expect(info.category).toBe('system_error'); // Should use default case
      expect(info.description).toBe('Unknown status code'); // Should use fallback description
      expect(info.isSuccess).toBe(false);
      expect(info.isError).toBe(true);
      expect(info.isRetryable).toBe(false);
      expect(info.httpEquivalent).toBeUndefined();
    });

    it('should provide default suggestion for unknown status codes', () => {
      const action = getSuggestedAction(99999);
      expect(action).toBe('Contact technical support for assistance');
    });
  });

  describe('StatusCodeInfo interface', () => {
    it('should have all required properties', () => {
      const info = getStatusCodeInfo(SipayStatusCode.SUCCESSFUL);

      expect(info).toHaveProperty('code');
      expect(info).toHaveProperty('description');
      expect(info).toHaveProperty('category');
      expect(info).toHaveProperty('isSuccess');
      expect(info).toHaveProperty('isError');
      expect(info).toHaveProperty('isRetryable');
      expect(info).toHaveProperty('httpEquivalent');

      expect(typeof info.code).toBe('number');
      expect(typeof info.description).toBe('string');
      expect(typeof info.category).toBe('string');
      expect(typeof info.isSuccess).toBe('boolean');
      expect(typeof info.isError).toBe('boolean');
      expect(typeof info.isRetryable).toBe('boolean');
    });
  });
});
