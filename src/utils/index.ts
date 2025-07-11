import * as crypto from 'crypto';

/**
 * Utility functions for Sipay SDK
 */

/**
 * Generate hash key for payment requests
 * Based on Sipay documentation requirements
 */
export function generateHashKey(
  merchantKey: string,
  invoiceId: string,
  amount: number,
  secretKey: string
): string {
  const hashString = `${merchantKey}${invoiceId}${amount}${secretKey}`;
  return crypto.createHash('sha256').update(hashString).digest('hex');
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function validateCreditCard(cardNumber: string): boolean {
  const num = cardNumber.replace(/\D/g, '');

  // Check if empty or less than 13 digits
  if (num.length < 13 || num.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Format currency amount for Sipay API
 */
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Generate a unique invoice ID
 */
export function generateInvoiceId(prefix = 'INV'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}`;
}

/**
 * Validate required payment fields
 */
export function validatePaymentData(data: any): string[] {
  const errors: string[] = [];
  const requiredFields = [
    'cc_holder_name',
    'cc_no',
    'expiry_month',
    'expiry_year',
    'currency_code',
    'invoice_id',
    'total',
    'name',
    'surname',
    'items',
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate credit card
  if (data.cc_no && !validateCreditCard(data.cc_no)) {
    errors.push('Invalid credit card number');
  }

  // Validate amount
  if (data.total && (isNaN(data.total) || data.total <= 0)) {
    errors.push('Invalid amount');
  }

  // Validate currency
  const validCurrencies = ['TRY', 'USD', 'EUR'];
  if (data.currency_code && !validCurrencies.includes(data.currency_code)) {
    errors.push('Invalid currency code');
  }

  // Validate expiry
  if (data.expiry_month) {
    const month = parseInt(data.expiry_month, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      errors.push('Invalid expiry month');
    }
  }

  if (data.expiry_year) {
    const year = parseInt(data.expiry_year, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < currentYear || year > currentYear + 20) {
      errors.push('Invalid expiry year');
    }
  }

  return errors;
}

/**
 * Mask credit card number for logging
 */
export function maskCreditCard(cardNumber: string): string {
  const num = cardNumber.replace(/\D/g, '');

  if (num.length <= 3) {
    return '*'.repeat(num.length);
  }

  if (num.length <= 7) {
    const firstThree = num.substring(0, 3);
    const middle = '*'.repeat(num.length - 4);
    const lastOne = num.substring(num.length - 1);
    return `${firstThree}${middle}${lastOne}`;
  }

  const firstFour = num.substring(0, 4);
  const lastFour = num.substring(num.length - 4);
  const middle = '*'.repeat(Math.max(0, num.length - 8));

  return `${firstFour}${middle}${lastFour}`;
}

/**
 * Parse Sipay error response
 */
export function parseSipayError(error: any): { code: number; message: string } {
  if (error.response?.data) {
    return {
      code: error.response.data.status_code || 0,
      message:
        error.response.data.status_description || error.response.data.message || 'Unknown error',
    };
  }

  return {
    code: 0,
    message: error.message || 'Network error',
  };
}
