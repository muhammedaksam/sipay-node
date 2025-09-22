import { createHash, createCipheriv, createDecipheriv } from 'crypto';

/**
 * Utility functions for Sipay SDK
 */

/**
 * Validate credit card number using Luhn algorithm
 */
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '').split('').map(Number);

  // Check minimum length
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

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
 * Validate credit card number (alias for luhnCheck)
 */
export function validateCreditCard(cardNumber: string): boolean {
  return luhnCheck(cardNumber);
}

/**
 * Mask credit card number for display
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 8) return cleaned;

  const first4 = cleaned.slice(0, 4);
  const last4 = cleaned.slice(-4);
  const middle = '*'.repeat(cleaned.length - 8);

  return `${first4}${middle}${last4}`;
}

/**
 * Format amount for Sipay API - amounts should be sent as numbers, not cents
 */
export function formatAmount(amount: number): string {
  // Amount should be formatted as a float with proper decimal places
  // For amounts like 100.00, it should be "100.00", not "1.00"
  return amount.toFixed(2);
}

/**
 * Format amount specifically for hash key generation
 * This should match PHP's format exactly: just the number as-is, no forced decimals
 */
export function formatAmountForHash(amount: number): string {
  // PHP uses: $total.'|' - which converts number to string without forcing decimal places
  // For integer amounts like 10, PHP outputs "10", not "10.00"
  // For decimal amounts like 10.5, PHP outputs "10.5", not "10.50"
  return amount.toString();
}

/**
 * Generate hash key for payment requests
 * Order matches PHP SDK CreateNonSecurePaymentRequest::generateHashKeyParts():
 * 1. total, 2. installments_number, 3. currency_code, 4. merchant_key, 5. invoice_id
 */
export function generatePaymentHashKey(
  total: number,
  installment: number,
  currencyCode: string,
  merchantKey: string,
  invoiceId: string,
  apiSecret: string
): string {
  const parts = [
    formatAmountForHash(total),
    installment.toString(),
    currencyCode,
    merchantKey,
    invoiceId,
  ];

  return generateHashKey(parts, apiSecret);
}

/**
 * Generate hash key for status check requests
 * Order matches PHP SDK CheckTransactionStatusRequest::generateHashKeyParts():
 * 1. invoice_id, 2. merchant_key
 */
export function generateStatusHashKey(
  invoiceId: string,
  merchantKey: string,
  apiSecret: string
): string {
  const parts = [invoiceId, merchantKey];

  return generateHashKey(parts, apiSecret);
}

/**
 * Generate hash key for payment requests based on official Sipay documentation
 * This matches exactly the official JavaScript implementation in sipayEn.yaml
 */
export function generateHashKey(parts: (string | number)[], appSecret: string): string {
  try {
    // Join parts with pipe separator - exactly like official: data = total + '|' + ...
    const data = parts.join('|');

    // Generate random IV - exactly like official: crypto.createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 16)
    const iv = createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 16);

    // Create password hash from app secret - exactly like official: crypto.createHash('sha1').update(app_secret).digest('hex')
    const password = createHash('sha1').update(appSecret).digest('hex');

    // Generate random salt - exactly like official: crypto.createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 4)
    const salt = createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 4);

    // Create salt with password - get full 32-byte key
    const saltWithPasswordHash = createHash('sha256')
      .update(password + salt)
      .digest(); // Get Buffer directly, not hex string

    // Encrypt data using AES-256-CBC - exactly like official implementation
    const cipher = createCipheriv(
      'aes-256-cbc',
      saltWithPasswordHash, // Use Buffer directly
      Buffer.from(iv, 'ascii')
    );

    // Official uses: cipher.update(padded_data, 'binary', 'base64'); cipher.final('base64');
    let encrypted = cipher.update(data, 'binary', 'base64');
    encrypted += cipher.final('base64');

    // Format the final hash key - exactly like official: iv + ':' + salt + ':' + encrypted
    const msgBundle = `${iv}:${salt}:${encrypted}`;

    // Replace / with __ - exactly like official: msg_encrypted_bundle.replace('/', '__')
    return msgBundle.replace(/\//g, '__');
  } catch (error) {
    throw new Error(`Hash key generation failed: ${error}`);
  }
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

/**
 * Validate hash key using server-side validation logic
 * This matches exactly what the PHP SDK does for server-side validation
 * Expected decrypted format: status|total|invoiceId|orderId|currencyCode
 */
export function validateHashKey(
  hashKey: string,
  secretKey: string
): [string, number, string, number, string] {
  let status = '';
  let currencyCode = '';
  let total = 0;
  let invoiceId = '';
  let orderId = 0;

  if (!hashKey) {
    return [status, total, invoiceId, orderId, currencyCode];
  }

  try {
    // Replace underscores with forward slashes (PHP compatibility)
    const normalizedHashKey = hashKey.replace(/_/g, '/');
    const password = createHash('sha1').update(secretKey).digest('hex');

    const components = normalizedHashKey.split(':');
    if (components.length > 2) {
      const iv = components[0] || '';
      const saltHex = components[1] || '';
      const encryptedMsg = components[2] || '';

      // Generate salt exactly like PHP: hash('sha256', $password . $salt)
      const saltWithPassword = createHash('sha256')
        .update(password + saltHex)
        .digest('hex');

      // Create decipher with proper parameters
      // PHP's openssl_decrypt expects:
      // - IV as raw ASCII bytes (16-char hex string treated as ASCII)
      // - Key as binary from hex string (32 bytes for AES-256)
      const decipher = createDecipheriv(
        'aes-256-cbc',
        Buffer.from(saltWithPassword, 'hex').slice(0, 32), // 32-byte key from hex
        Buffer.from(iv, 'ascii') // IV: 16-char hex string as ASCII bytes
      );

      let decrypted = decipher.update(encryptedMsg, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      if (decrypted.includes('|')) {
        const array = decrypted.split('|');
        status = array[0] || '0';
        total = parseFloat(array[1] || '0');
        invoiceId = array[2] || '0';
        orderId = parseInt(array[3] || '0');
        currencyCode = array[4] || '';
      }
    }
  } catch {
    // Silently handle decryption errors
  }

  return [status, total, invoiceId, orderId, currencyCode];
}

/**
 * Generate hash key in server validation format
 * Server expects: status|total|invoiceId|orderId|currencyCode
 */
export function generateServerFormatHashKey(
  status: string,
  total: number,
  invoiceId: string,
  orderId: number,
  currencyCode: string,
  appSecret: string
): string {
  const parts = [status, formatAmountForHash(total), invoiceId, orderId.toString(), currencyCode];

  return generateHashKey(parts, appSecret);
}
