/**
 * Sipay Status Code Utilities
 * Helper functions for working with Sipay API status codes
 */

import {
  SipayStatusCode,
  SipayStatusCategory,
  getStatusCategory,
  getStatusDescription,
  isSuccessStatus,
  isErrorStatus,
  isRetryableStatus,
} from '../types/status-codes';

/**
 * Enhanced error information for status codes
 */
export interface StatusCodeInfo {
  code: number;
  description: string;
  category: SipayStatusCategory;
  isSuccess: boolean;
  isError: boolean;
  isRetryable: boolean;
  httpEquivalent?: number;
}

/**
 * Get comprehensive information about a status code
 */
export function getStatusCodeInfo(statusCode: number): StatusCodeInfo {
  return {
    code: statusCode,
    description: getStatusDescription(statusCode),
    category: getStatusCategory(statusCode),
    isSuccess: isSuccessStatus(statusCode),
    isError: isErrorStatus(statusCode),
    isRetryable: isRetryableStatus(statusCode),
    httpEquivalent: getHttpEquivalent(statusCode),
  };
}

/**
 * Map Sipay status codes to HTTP status codes where applicable
 */
function getHttpEquivalent(statusCode: number): number | undefined {
  switch (statusCode) {
    case SipayStatusCode.SUCCESSFUL:
    case SipayStatusCode.REFUND_REQUEST_CREATED:
    case SipayStatusCode.PARTIALLY_SUCCESSFUL:
      return 200; // OK

    case SipayStatusCode.BASIC_VALIDATION:
    case SipayStatusCode.ITEMS_VALIDATION_ERROR:
    case SipayStatusCode.PRICE_TOTAL_MISMATCH:
    case SipayStatusCode.QUANTITY_MUST_BE_INTEGER:
    case SipayStatusCode.INVALID_INVOICE_ID:
    case SipayStatusCode.INVALID_CHARACTER:
    case SipayStatusCode.INVALID_CARD_NUMBER:
    case SipayStatusCode.CANCELLATION_URL_SHOULD_NOT_BE_BLANK:
      return 400; // Bad Request

    case SipayStatusCode.INVALID_CREDENTIALS:
    case SipayStatusCode.INVALID_TOKEN_OR_CLIENT_NUMBER:
      return 401; // Unauthorized

    case SipayStatusCode.PAYMENT_INTEGRATION_NOT_ALLOWED:
    case SipayStatusCode.MERCHANT_NOT_ALLOWED_TOKEN_PAYMENT:
    case SipayStatusCode.MERCHANT_CARD_TRANSACTION_NOT_ALLOWED:
    case SipayStatusCode.FOREIGN_CARDS_NOT_ALLOWED:
      return 403; // Forbidden

    case SipayStatusCode.MERCHANT_NOT_FOUND:
    case SipayStatusCode.TRANSACTION_NOT_FOUND:
    case SipayStatusCode.POS_NOT_FOUND:
    case SipayStatusCode.COMMISSION_NOT_FOUND:
    case SipayStatusCode.INSTALLMENT_NOT_FOUND:
    case SipayStatusCode.SUB_MERCHANT_NOT_FOUND:
      return 404; // Not Found

    case SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED:
    case SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED_ALT:
      return 409; // Conflict

    case SipayStatusCode.UNKNOWN_ERROR:
    case SipayStatusCode.CURRENCY_CONVERSION_FAILED:
    case SipayStatusCode.FILE_PROCESSING_ERROR:
      return 500; // Internal Server Error

    default:
      return undefined;
  }
}

/**
 * Common status code groups for easy checking
 */
export const StatusCodeGroups = {
  SUCCESS: [
    SipayStatusCode.SUCCESSFUL,
    SipayStatusCode.REFUND_REQUEST_CREATED,
    SipayStatusCode.PARTIALLY_SUCCESSFUL,
  ],

  VALIDATION_ERRORS: [
    SipayStatusCode.BASIC_VALIDATION,
    SipayStatusCode.ITEMS_VALIDATION_ERROR,
    SipayStatusCode.PRICE_TOTAL_MISMATCH,
    SipayStatusCode.QUANTITY_MUST_BE_INTEGER,
    SipayStatusCode.INVALID_INVOICE_ID,
    SipayStatusCode.INVALID_CHARACTER,
    SipayStatusCode.INVALID_CARD_NUMBER,
    SipayStatusCode.CANCELLATION_URL_SHOULD_NOT_BE_BLANK,
  ],

  PAYMENT_ERRORS: [
    SipayStatusCode.ORDER_FAILED,
    SipayStatusCode.PAYMENT_TERM_NOT_SET,
    SipayStatusCode.REFUND_FAILED,
    SipayStatusCode.TRANSACTION_NOT_FOUND,
    SipayStatusCode.ORDER_NOT_YET_PROCESSED,
    SipayStatusCode.TRANSACTION_NOT_APPROVED,
  ],

  MERCHANT_LIMIT_ERRORS: [
    SipayStatusCode.MERCHANT_DAILY_TRANSACTION_LIMIT_EXCEEDED,
    SipayStatusCode.MERCHANT_DAILY_AMOUNT_LIMIT_EXCEEDED,
    SipayStatusCode.MERCHANT_MONTHLY_TRANSACTION_LIMIT_EXCEEDED,
    SipayStatusCode.MERCHANT_MONTHLY_AMOUNT_LIMIT_EXCEEDED,
    SipayStatusCode.MINIMUM_TRANSACTION_LIMIT_VIOLATED,
  ],

  CARD_ERRORS: [
    SipayStatusCode.CREDIT_CARD_BLOCKED,
    SipayStatusCode.MERCHANT_CARD_TRANSACTION_NOT_ALLOWED,
    SipayStatusCode.CARD_PROGRAM_MISMATCH,
    SipayStatusCode.FOREIGN_CARDS_NOT_ALLOWED,
    SipayStatusCode.NO_FOREIGN_CARD_COMMISSION,
  ],

  HASH_KEY_ERRORS: [
    SipayStatusCode.HASH_KEY_VALIDATION_ERROR,
    SipayStatusCode.INVALID_HASH_KEY,
    SipayStatusCode.HASH_KEY_MERCHANT_KEY_MISMATCH,
    SipayStatusCode.HASH_KEY_CUSTOMER_NUMBER_MISMATCH,
    SipayStatusCode.HASH_KEY_CARD_HOLDER_NAME_MISMATCH,
    SipayStatusCode.HASH_KEY_CARD_NUMBER_MISMATCH,
    SipayStatusCode.HASH_KEY_EXPIRY_MONTH_MISMATCH,
    SipayStatusCode.HASH_KEY_EXPIRY_YEAR_MISMATCH,
    SipayStatusCode.HASH_KEY_CARD_TOKEN_MISMATCH,
  ],

  RETRYABLE_ERRORS: [
    SipayStatusCode.ORDER_NOT_YET_PROCESSED,
    SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED,
    SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED_ALT,
    SipayStatusCode.MAXIMUM_TRANSACTION_LIMIT_VIOLATED,
  ],
} as const;

/**
 * Check if status code is in a specific group
 */
export function isStatusInGroup(statusCode: number, group: readonly number[]): boolean {
  return group.includes(statusCode);
}

/**
 * Get suggested actions based on status code
 */
export function getSuggestedAction(statusCode: number): string {
  const info = getStatusCodeInfo(statusCode);

  switch (info.category) {
    case SipayStatusCategory.SUCCESS:
      return 'Transaction completed successfully';

    case SipayStatusCategory.VALIDATION_ERROR:
      return 'Check request parameters and fix validation errors';

    case SipayStatusCategory.AUTHENTICATION_ERROR:
      return 'Verify API credentials and merchant configuration';

    case SipayStatusCategory.PAYMENT_ERROR:
      if (info.isRetryable) {
        return 'Transaction may be retried after a short delay';
      }
      return 'Check payment details and try with different parameters';

    case SipayStatusCategory.MERCHANT_ERROR:
      return 'Contact your payment provider to resolve merchant configuration issues';

    case SipayStatusCategory.CARD_ERROR:
      return 'Try with a different card or contact the card issuer';

    case SipayStatusCategory.HASH_ERROR:
      return 'Verify hash key generation parameters and algorithm';

    case SipayStatusCategory.RECURRING_ERROR:
      return 'Check recurring payment configuration and parameters';

    default:
      return 'Contact technical support for assistance';
  }
}
