/**
 * Sipay API Status Codes
 * Based on official API documentation
 */

// Server HTTP Status Codes
export enum SipayHttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,
}

// Application Status Codes
export enum SipayStatusCode {
  // Validation and Basic Errors
  BASIC_VALIDATION = 1,
  INVOICE_ID_ALREADY_PROCESSED = 3,
  ITEMS_VALIDATION_ERROR = 12,
  PRICE_TOTAL_MISMATCH = 13,
  MERCHANT_NOT_FOUND = 14,

  // Authentication and Authorization
  INVALID_CREDENTIALS = 30,
  TRANSACTION_NOT_FOUND = 31,
  INVALID_INVOICE_ID = 32,
  QUANTITY_MUST_BE_INTEGER = 33,
  PAYMENT_INTEGRATION_NOT_ALLOWED = 34,
  CREDIT_CARD_PAYMENT_NOT_DEFINED = 35,

  // POS and Commission Errors
  POS_NOT_FOUND = 36,
  MERCHANT_POS_COMMISSION_NOT_SET = 37,
  MERCHANT_COMMISSION_NOT_DETERMINED = 38,
  COMMISSION_NOT_FOUND = 39,
  INSTALLMENT_NOT_FOUND = 40,

  // Payment Errors
  ORDER_FAILED = 41,
  PAYMENT_FAILED = 41, // Same code as ORDER_FAILED
  PRODUCT_PRICE_LESS_THAN_COMMISSION = 42,
  PAYMENT_TERM_NOT_SET = 43,
  CREDIT_CARD_BLOCKED = 44,
  MERCHANT_DAILY_TRANSACTION_LIMIT_EXCEEDED = 44, // Same code as CREDIT_CARD_BLOCKED
  MERCHANT_DAILY_AMOUNT_LIMIT_EXCEEDED = 45,
  MERCHANT_MONTHLY_TRANSACTION_LIMIT_EXCEEDED = 46,
  MERCHANT_MONTHLY_AMOUNT_LIMIT_EXCEEDED = 47,
  MINIMUM_TRANSACTION_LIMIT_VIOLATED = 48,
  REFUND_FAILED = 49,
  MAXIMUM_TRANSACTION_LIMIT_VIOLATED = 49, // Same code as REFUND_FAILED

  // Recurring Payment Errors
  RECURRING_PAYMENT_VALIDATION_ERROR = 55,
  INVALID_SALE_WEBHOOK_KEY = 56,

  // Card and Merchant Restrictions
  MERCHANT_CARD_TRANSACTION_NOT_ALLOWED = 60,

  // Hash Key Errors
  HASH_KEY_VALIDATION_ERROR = 68,
  ORDER_NOT_YET_PROCESSED = 69,
  CARD_PROGRAM_MISMATCH = 70,

  // Recurring Plan Errors
  RECURRING_PLAN_UPDATE_FAILED = 71,
  FAILED_TO_DELETE = 72,
  FAILED_TO_ADD_DUPLICATE_PLAN_CARD = 73,

  // Foreign Card Errors
  FOREIGN_CARDS_NOT_ALLOWED = 76,
  NO_FOREIGN_CARD_COMMISSION = 77,

  // Token Payment Errors
  MERCHANT_NOT_ALLOWED_TOKEN_PAYMENT = 79,
  SUB_MERCHANT_NOT_FOUND = 80,
  CURRENCY_CONVERSION_FAILED = 81,

  // Card Token Errors
  INVALID_CHARACTER = 85,
  CARD_TOKEN_SAVE_FAILED = 86,
  INVALID_TOKEN_OR_CLIENT_NUMBER = 87,
  FAILED_TO_DELETE_CARD_TOKEN = 88,
  FAILED_TO_UPDATE_CARD_TOKEN = 89,

  // Hash Key Specific Errors
  INVALID_HASH_KEY = 90,
  HASH_KEY_MERCHANT_KEY_MISMATCH = 91,
  HASH_KEY_CUSTOMER_NUMBER_MISMATCH = 92,
  HASH_KEY_CARD_HOLDER_NAME_MISMATCH = 93,
  HASH_KEY_CARD_NUMBER_MISMATCH = 94,
  HASH_KEY_EXPIRY_MONTH_MISMATCH = 95,
  HASH_KEY_EXPIRY_YEAR_MISMATCH = 96,
  HASH_KEY_CARD_TOKEN_MISMATCH = 97,

  // General Status Codes
  UNKNOWN_ERROR = 99,
  SUCCESSFUL = 100,
  REFUND_REQUEST_CREATED = 101,
  POS_NOT_DEFINED = 102,
  PAYBY_TOKEN_COMMISSION_NOT_ESTABLISHED = 103,
  RETURN_TRANSACTION_ID_MUST_BE_UNIQUE = 104,
  TRANSACTION_NOT_APPROVED = 105,
  INVALID_MERCHANT_TYPE = 106,
  FAILED_TO_VERIFY_API_OPT = 107,
  INVALID_CARD_NUMBER = 108,
  FILE_PROCESSING_ERROR = 109,
  PARTIAL_RETURNS_NOT_ALLOWED = 110,
  PARTIALLY_SUCCESSFUL = 112,
  INVOICE_ID_ALREADY_PROCESSED_ALT = 117,
  CANCELLATION_URL_SHOULD_NOT_BE_BLANK = 404,
}

// Status Code Descriptions
export const SipayStatusDescriptions: Record<SipayStatusCode, string> = {
  [SipayStatusCode.BASIC_VALIDATION]: 'Basic validation',
  [SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED]:
    'Invoice ID already processed. Order with this invoice ID process continues, Please wait or create order with new invoice id',
  [SipayStatusCode.ITEMS_VALIDATION_ERROR]:
    'Items must be an array, Invalid Currency code, Invalid item format',
  [SipayStatusCode.PRICE_TOTAL_MISMATCH]:
    'The sum of your product price does not equal the total of the invoice',
  [SipayStatusCode.MERCHANT_NOT_FOUND]: 'Merchant not found!',
  [SipayStatusCode.INVALID_CREDENTIALS]: 'Invalid Credentials',
  [SipayStatusCode.TRANSACTION_NOT_FOUND]: 'Transaction not found',
  [SipayStatusCode.INVALID_INVOICE_ID]: 'Invalid invoice ID, order not completed',
  [SipayStatusCode.QUANTITY_MUST_BE_INTEGER]: 'Quantity must be integer',
  [SipayStatusCode.PAYMENT_INTEGRATION_NOT_ALLOWED]:
    'Payment integration method not allowed. Please contact support.',
  [SipayStatusCode.CREDIT_CARD_PAYMENT_NOT_DEFINED]: 'Credit Card Payment Option not defined',
  [SipayStatusCode.POS_NOT_FOUND]: 'Pos not found',
  [SipayStatusCode.MERCHANT_POS_COMMISSION_NOT_SET]:
    'Merchant Pos Commission has not been set. Please contact the service provider.',
  [SipayStatusCode.MERCHANT_COMMISSION_NOT_DETERMINED]:
    'Merchant Commission has not been determined for this currency and payment method. Please try another payment method',
  [SipayStatusCode.COMMISSION_NOT_FOUND]: 'Commission not found',
  [SipayStatusCode.INSTALLMENT_NOT_FOUND]: 'Installment not found',
  [SipayStatusCode.ORDER_FAILED]: 'Order failed / Payment failed',
  [SipayStatusCode.PRODUCT_PRICE_LESS_THAN_COMMISSION]:
    'Product price less than commission, Product price less than cost',
  [SipayStatusCode.PAYMENT_TERM_NOT_SET]: 'Payment term not set',
  [SipayStatusCode.CREDIT_CARD_BLOCKED]:
    'This credit card has been blocked. Merchant daily transaction limit exceeded',
  [SipayStatusCode.MERCHANT_DAILY_AMOUNT_LIMIT_EXCEEDED]:
    'Merchant daily transaction amount limit exceeded',
  [SipayStatusCode.MERCHANT_MONTHLY_TRANSACTION_LIMIT_EXCEEDED]:
    'Merchant monthly transaction number limit exceeded',
  [SipayStatusCode.MERCHANT_MONTHLY_AMOUNT_LIMIT_EXCEEDED]:
    'Merchant monthly transaction amount limit exceeded',
  [SipayStatusCode.MINIMUM_TRANSACTION_LIMIT_VIOLATED]:
    'Minimum transaction limit per transaction violated',
  [SipayStatusCode.REFUND_FAILED]:
    'Refund Failed. The total refund amount must not exceed the net amount. No Sales Transaction Found. Insufficient Balance. Non-refundable transaction status. Please wait at least 30 seconds for another refund. Maximum transaction limit per transaction violated',
  [SipayStatusCode.RECURRING_PAYMENT_VALIDATION_ERROR]:
    'There can be no installment sales in recurring payment. Duplicate number cannot be empty. The duplicate number must be an integer. Duplicate number must be greater than 1. The duplicate number must not be greater than 121. The iterative loop cannot be empty. The repeating loop unit is not valid.Must be "D", "M" or "Y". Duplicate range cannot be empty. The repeating range must be an integer. The repeating range must be greater than 0. The repeating range should not be greater than 99. Invalid duplicate webhook key! Please check the key name in Sipay. Duplicate webhook key cannot be empty. Please assign your webhook key to Sipay',
  [SipayStatusCode.INVALID_SALE_WEBHOOK_KEY]:
    'Invalid sale webhook key! Please check the key name in Sipay',
  [SipayStatusCode.MERCHANT_CARD_TRANSACTION_NOT_ALLOWED]:
    'The merchant is not allowed to make transactions using this card.',
  [SipayStatusCode.HASH_KEY_VALIDATION_ERROR]:
    'Total amount mismatch with hash key. Currency mismatch with hash key. Hash key and merchant key mismatch. Installment number mismatch with hash key. Hash key and pos ID mismatch. Invoice ID mismatch with hash key',
  [SipayStatusCode.ORDER_NOT_YET_PROCESSED]: 'Order not yet processed',
  [SipayStatusCode.CARD_PROGRAM_MISMATCH]: 'Card program mismatch',
  [SipayStatusCode.RECURRING_PLAN_UPDATE_FAILED]:
    'Recurring plan update failed, Invalid Response or Unknown Error',
  [SipayStatusCode.FAILED_TO_DELETE]: 'Failed to delete, Failed to process old payment',
  [SipayStatusCode.FAILED_TO_ADD_DUPLICATE_PLAN_CARD]:
    'Failed to add duplicate plan card, Invalid Response or Unknown Error',
  [SipayStatusCode.FOREIGN_CARDS_NOT_ALLOWED]: 'Foreign Cards Are Not Allowed For This Merchant.',
  [SipayStatusCode.NO_FOREIGN_CARD_COMMISSION]:
    'No Foreign Card Commission has been determined for this Merchant.',
  [SipayStatusCode.MERCHANT_NOT_ALLOWED_TOKEN_PAYMENT]:
    'The merchant is not allowed to pay with card tokens.',
  [SipayStatusCode.SUB_MERCHANT_NOT_FOUND]: 'Sub-merchant not found',
  [SipayStatusCode.CURRENCY_CONVERSION_FAILED]: 'Currency conversion from API failed',
  [SipayStatusCode.INVALID_CHARACTER]: 'Invalid character',
  [SipayStatusCode.CARD_TOKEN_SAVE_FAILED]: 'Card token save failed',
  [SipayStatusCode.INVALID_TOKEN_OR_CLIENT_NUMBER]: 'Invalid token or client number',
  [SipayStatusCode.FAILED_TO_DELETE_CARD_TOKEN]: 'Failed to delete card token',
  [SipayStatusCode.FAILED_TO_UPDATE_CARD_TOKEN]: 'Failed to update card token',
  [SipayStatusCode.INVALID_HASH_KEY]: 'Invalid Hash key',
  [SipayStatusCode.HASH_KEY_MERCHANT_KEY_MISMATCH]: 'Hash key that does not match the Merchant key',
  [SipayStatusCode.HASH_KEY_CUSTOMER_NUMBER_MISMATCH]:
    'Hash key that does not match the customer number',
  [SipayStatusCode.HASH_KEY_CARD_HOLDER_NAME_MISMATCH]:
    "Hash key that does not match the Card Holder's Name",
  [SipayStatusCode.HASH_KEY_CARD_NUMBER_MISMATCH]: 'Hash key that does not match the Card Number',
  [SipayStatusCode.HASH_KEY_EXPIRY_MONTH_MISMATCH]: 'Hash key that does not match expiration month',
  [SipayStatusCode.HASH_KEY_EXPIRY_YEAR_MISMATCH]: 'Hash key that does not match expiry year',
  [SipayStatusCode.HASH_KEY_CARD_TOKEN_MISMATCH]: 'Hash key that does not match the card token',
  [SipayStatusCode.UNKNOWN_ERROR]: 'Unknown Error',
  [SipayStatusCode.SUCCESSFUL]: 'Successful',
  [SipayStatusCode.REFUND_REQUEST_CREATED]:
    'Your refund request has been successfully created. Our team will complete the return process',
  [SipayStatusCode.POS_NOT_DEFINED]: 'Pos not defined, no Pos found for this installment',
  [SipayStatusCode.PAYBY_TOKEN_COMMISSION_NOT_ESTABLISHED]:
    'Payby token commission rate not established',
  [SipayStatusCode.RETURN_TRANSACTION_ID_MUST_BE_UNIQUE]: 'Return transaction ID must be unique',
  [SipayStatusCode.TRANSACTION_NOT_APPROVED]: 'The transaction has not been approved',
  [SipayStatusCode.INVALID_MERCHANT_TYPE]: 'Invalid merchant type',
  [SipayStatusCode.FAILED_TO_VERIFY_API_OPT]: 'Failed to verify submitted API opt',
  [SipayStatusCode.INVALID_CARD_NUMBER]: 'Invalid card number',
  [SipayStatusCode.FILE_PROCESSING_ERROR]: 'File processing error',
  [SipayStatusCode.PARTIAL_RETURNS_NOT_ALLOWED]:
    'Partial returns are not allowed for this transaction.',
  [SipayStatusCode.PARTIALLY_SUCCESSFUL]: 'Partially successful',
  [SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED_ALT]: 'The invoice id already processed',
  [SipayStatusCode.CANCELLATION_URL_SHOULD_NOT_BE_BLANK]: 'Cancellation URL should not be blank',
};

// Status Code Categories
export enum SipayStatusCategory {
  SUCCESS = 'success',
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  PAYMENT_ERROR = 'payment_error',
  MERCHANT_ERROR = 'merchant_error',
  CARD_ERROR = 'card_error',
  HASH_ERROR = 'hash_error',
  RECURRING_ERROR = 'recurring_error',
  SYSTEM_ERROR = 'system_error',
}

/**
 * Categorize status codes for better error handling
 */
export function getStatusCategory(statusCode: number): SipayStatusCategory {
  switch (statusCode) {
    case SipayStatusCode.SUCCESSFUL:
    case SipayStatusCode.REFUND_REQUEST_CREATED:
    case SipayStatusCode.PARTIALLY_SUCCESSFUL:
      return SipayStatusCategory.SUCCESS;

    case SipayStatusCode.BASIC_VALIDATION:
    case SipayStatusCode.ITEMS_VALIDATION_ERROR:
    case SipayStatusCode.PRICE_TOTAL_MISMATCH:
    case SipayStatusCode.QUANTITY_MUST_BE_INTEGER:
    case SipayStatusCode.INVALID_INVOICE_ID:
    case SipayStatusCode.INVALID_CHARACTER:
    case SipayStatusCode.INVALID_CARD_NUMBER:
    case SipayStatusCode.CANCELLATION_URL_SHOULD_NOT_BE_BLANK:
      return SipayStatusCategory.VALIDATION_ERROR;

    case SipayStatusCode.INVALID_CREDENTIALS:
    case SipayStatusCode.PAYMENT_INTEGRATION_NOT_ALLOWED:
    case SipayStatusCode.MERCHANT_NOT_ALLOWED_TOKEN_PAYMENT:
    case SipayStatusCode.INVALID_TOKEN_OR_CLIENT_NUMBER:
      return SipayStatusCategory.AUTHENTICATION_ERROR;

    case SipayStatusCode.ORDER_FAILED:
    case SipayStatusCode.PAYMENT_FAILED:
    case SipayStatusCode.PAYMENT_TERM_NOT_SET:
    case SipayStatusCode.REFUND_FAILED:
    case SipayStatusCode.TRANSACTION_NOT_FOUND:
    case SipayStatusCode.ORDER_NOT_YET_PROCESSED:
    case SipayStatusCode.TRANSACTION_NOT_APPROVED:
      return SipayStatusCategory.PAYMENT_ERROR;

    case SipayStatusCode.MERCHANT_NOT_FOUND:
    case SipayStatusCode.MERCHANT_POS_COMMISSION_NOT_SET:
    case SipayStatusCode.MERCHANT_COMMISSION_NOT_DETERMINED:
    case SipayStatusCode.MERCHANT_DAILY_TRANSACTION_LIMIT_EXCEEDED:
    case SipayStatusCode.MERCHANT_DAILY_AMOUNT_LIMIT_EXCEEDED:
    case SipayStatusCode.MERCHANT_MONTHLY_TRANSACTION_LIMIT_EXCEEDED:
    case SipayStatusCode.MERCHANT_MONTHLY_AMOUNT_LIMIT_EXCEEDED:
    case SipayStatusCode.MINIMUM_TRANSACTION_LIMIT_VIOLATED:
    case SipayStatusCode.SUB_MERCHANT_NOT_FOUND:
    case SipayStatusCode.INVALID_MERCHANT_TYPE:
      return SipayStatusCategory.MERCHANT_ERROR;

    case SipayStatusCode.CREDIT_CARD_BLOCKED:
    case SipayStatusCode.MERCHANT_CARD_TRANSACTION_NOT_ALLOWED:
    case SipayStatusCode.CARD_PROGRAM_MISMATCH:
    case SipayStatusCode.FOREIGN_CARDS_NOT_ALLOWED:
    case SipayStatusCode.NO_FOREIGN_CARD_COMMISSION:
    case SipayStatusCode.CARD_TOKEN_SAVE_FAILED:
    case SipayStatusCode.FAILED_TO_DELETE_CARD_TOKEN:
    case SipayStatusCode.FAILED_TO_UPDATE_CARD_TOKEN:
      return SipayStatusCategory.CARD_ERROR;

    case SipayStatusCode.HASH_KEY_VALIDATION_ERROR:
    case SipayStatusCode.INVALID_HASH_KEY:
    case SipayStatusCode.HASH_KEY_MERCHANT_KEY_MISMATCH:
    case SipayStatusCode.HASH_KEY_CUSTOMER_NUMBER_MISMATCH:
    case SipayStatusCode.HASH_KEY_CARD_HOLDER_NAME_MISMATCH:
    case SipayStatusCode.HASH_KEY_CARD_NUMBER_MISMATCH:
    case SipayStatusCode.HASH_KEY_EXPIRY_MONTH_MISMATCH:
    case SipayStatusCode.HASH_KEY_EXPIRY_YEAR_MISMATCH:
    case SipayStatusCode.HASH_KEY_CARD_TOKEN_MISMATCH:
      return SipayStatusCategory.HASH_ERROR;

    case SipayStatusCode.RECURRING_PAYMENT_VALIDATION_ERROR:
    case SipayStatusCode.RECURRING_PLAN_UPDATE_FAILED:
    case SipayStatusCode.FAILED_TO_ADD_DUPLICATE_PLAN_CARD:
      return SipayStatusCategory.RECURRING_ERROR;

    default:
      return SipayStatusCategory.SYSTEM_ERROR;
  }
}

/**
 * Check if a status code indicates success
 */
export function isSuccessStatus(statusCode: number): boolean {
  return getStatusCategory(statusCode) === SipayStatusCategory.SUCCESS;
}

/**
 * Check if a status code indicates an error
 */
export function isErrorStatus(statusCode: number): boolean {
  return !isSuccessStatus(statusCode);
}

/**
 * Get human-readable description for a status code
 */
export function getStatusDescription(statusCode: number): string {
  return SipayStatusDescriptions[statusCode as SipayStatusCode] || 'Unknown status code';
}

/**
 * Check if status code is retryable (temporary errors)
 */
export function isRetryableStatus(statusCode: number): boolean {
  const retryableStatusCodes = [
    SipayStatusCode.ORDER_NOT_YET_PROCESSED,
    SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED,
    SipayStatusCode.INVOICE_ID_ALREADY_PROCESSED_ALT,
    SipayStatusCode.MAXIMUM_TRANSACTION_LIMIT_VIOLATED,
  ];

  return retryableStatusCodes.includes(statusCode as SipayStatusCode);
}
