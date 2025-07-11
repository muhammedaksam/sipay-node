import {
  validateCreditCard,
  generateHashKey,
  formatAmount,
  generateInvoiceId,
  maskCreditCard,
  validatePaymentData,
  parseSipayError,
} from '../src/utils';

describe('Utility Functions', () => {
  describe('validateCreditCard', () => {
    it('should validate correct credit card numbers', () => {
      expect(validateCreditCard('4111111111111111')).toBe(true);
      expect(validateCreditCard('5555555555554444')).toBe(true);
      expect(validateCreditCard('378282246310005')).toBe(true);
    });

    it('should reject invalid credit card numbers', () => {
      expect(validateCreditCard('1234567890123456')).toBe(false);
      expect(validateCreditCard('4111111111111112')).toBe(false);
      expect(validateCreditCard('')).toBe(false);
    });

    it('should handle credit card numbers with spaces and dashes', () => {
      expect(validateCreditCard('4111 1111 1111 1111')).toBe(true);
      expect(validateCreditCard('4111-1111-1111-1111')).toBe(true);
    });
  });

  describe('generateHashKey', () => {
    it('should generate consistent hash keys', () => {
      const merchantKey = 'test-merchant';
      const invoiceId = 'INV123';
      const amount = 100;
      const secretKey = 'secret';

      const hash1 = generateHashKey(merchantKey, invoiceId, amount, secretKey);
      const hash2 = generateHashKey(merchantKey, invoiceId, amount, secretKey);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hex length
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = generateHashKey('merchant1', 'INV123', 100, 'secret');
      const hash2 = generateHashKey('merchant2', 'INV123', 100, 'secret');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('formatAmount', () => {
    it('should format amounts correctly', () => {
      expect(formatAmount(100)).toBe('100.00');
      expect(formatAmount(99.5)).toBe('99.50');
      expect(formatAmount(0.1)).toBe('0.10');
    });
  });

  describe('generateInvoiceId', () => {
    it('should generate unique invoice IDs', () => {
      const id1 = generateInvoiceId();
      const id2 = generateInvoiceId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^INV\d+/);
    });

    it('should use custom prefix', () => {
      const id = generateInvoiceId('ORDER');
      expect(id).toMatch(/^ORDER\d+/);
    });
  });

  describe('maskCreditCard', () => {
    it('should mask credit card numbers correctly', () => {
      expect(maskCreditCard('4111111111111111')).toBe('4111********1111');
      expect(maskCreditCard('123')).toBe('***');
      expect(maskCreditCard('1234567')).toBe('123***7');
    });
  });

  describe('validatePaymentData', () => {
    const validPaymentData = {
      cc_holder_name: 'John Doe',
      cc_no: '4111111111111111',
      expiry_month: '12',
      expiry_year: '2025',
      currency_code: 'TRY',
      invoice_id: 'INV123',
      total: 100,
      name: 'John',
      surname: 'Doe',
      items: [{ name: 'Product', price: 100, qnantity: 1, description: 'Test' }],
    };

    it('should pass validation for valid data', () => {
      const errors = validatePaymentData(validPaymentData);
      expect(errors).toHaveLength(0);
    });

    it('should catch missing required fields', () => {
      const invalidData = { ...validPaymentData } as any;
      delete invalidData.cc_holder_name;
      delete invalidData.total;

      const errors = validatePaymentData(invalidData);
      expect(errors).toContain('Missing required field: cc_holder_name');
      expect(errors).toContain('Missing required field: total');
    });

    it('should validate credit card number', () => {
      const invalidData = { ...validPaymentData, cc_no: '1234567890123456' };
      const errors = validatePaymentData(invalidData);
      expect(errors).toContain('Invalid credit card number');
    });

    it('should validate currency code', () => {
      const invalidData = { ...validPaymentData, currency_code: 'XXX' };
      const errors = validatePaymentData(invalidData);
      expect(errors).toContain('Invalid currency code');
    });

    it('should validate expiry date', () => {
      const invalidData = { ...validPaymentData, expiry_month: '13', expiry_year: '2020' };
      const errors = validatePaymentData(invalidData);
      expect(errors).toContain('Invalid expiry month');
      expect(errors).toContain('Invalid expiry year');
    });

    it('should validate amount edge cases', () => {
      const validBaseData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        currency_code: 'TRY',
        invoice_id: 'INV123',
        name: 'John',
        surname: 'Doe',
        items: [],
      };

      // Test with negative amount (truthy but invalid)
      let errors = validatePaymentData({
        ...validBaseData,
        total: -10,
      });
      expect(errors).toContain('Invalid amount');

      // Test with NaN amount (falsy, so treated as missing)
      errors = validatePaymentData({
        ...validBaseData,
        total: NaN,
      });
      expect(errors).toContain('Missing required field: total');

      // Test with string that's not a number (truthy but invalid)
      errors = validatePaymentData({
        ...validBaseData,
        total: 'not-a-number' as any,
      });
      expect(errors).toContain('Invalid amount');

      // Test with valid positive amount
      errors = validatePaymentData({
        ...validBaseData,
        total: 100,
      });
      expect(errors).not.toContain('Invalid amount');

      // Note: zero amount (0) is falsy, so validation logic doesn't check it
      // This is current behavior - zero amount will be caught by required field validation
      errors = validatePaymentData({
        ...validBaseData,
        total: 0,
      });
      expect(errors).toContain('Missing required field: total');
    });

    it('should validate currency code edge cases', () => {
      const validBaseData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        total: 100,
        invoice_id: 'INV123',
        name: 'John',
        surname: 'Doe',
        items: [],
      };

      // Test invalid currency
      let errors = validatePaymentData({
        ...validBaseData,
        currency_code: 'GBP',
      });
      expect(errors).toContain('Invalid currency code');

      // Test with valid currencies
      ['TRY', 'USD', 'EUR'].forEach((currency) => {
        errors = validatePaymentData({
          ...validBaseData,
          currency_code: currency,
        });
        expect(errors).not.toContain('Invalid currency code');
      });
    });

    it('should validate expiry month edge cases', () => {
      const validBaseData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_year: '2025',
        currency_code: 'TRY',
        total: 100,
        invoice_id: 'INV123',
        name: 'John',
        surname: 'Doe',
        items: [],
      };

      // Test invalid months
      const invalidMonths = ['0', '13', '99', 'abc', '-1'];
      invalidMonths.forEach((month) => {
        const errors = validatePaymentData({
          ...validBaseData,
          expiry_month: month,
        });
        expect(errors).toContain('Invalid expiry month');
      });

      // Test valid months
      for (let month = 1; month <= 12; month++) {
        const errors = validatePaymentData({
          ...validBaseData,
          expiry_month: month.toString().padStart(2, '0'),
        });
        expect(errors).not.toContain('Invalid expiry month');
      }
    });

    it('should validate expiry year edge cases', () => {
      const currentYear = new Date().getFullYear();
      const validBaseData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        currency_code: 'TRY',
        total: 100,
        invoice_id: 'INV123',
        name: 'John',
        surname: 'Doe',
        items: [],
      };

      // Test past year
      let errors = validatePaymentData({
        ...validBaseData,
        expiry_year: (currentYear - 1).toString(),
      });
      expect(errors).toContain('Invalid expiry year');

      // Test too far future year
      errors = validatePaymentData({
        ...validBaseData,
        expiry_year: (currentYear + 21).toString(),
      });
      expect(errors).toContain('Invalid expiry year');

      // Test non-numeric year
      errors = validatePaymentData({
        ...validBaseData,
        expiry_year: 'abc',
      });
      expect(errors).toContain('Invalid expiry year');

      // Test valid years
      for (let offset = 0; offset <= 20; offset++) {
        errors = validatePaymentData({
          ...validBaseData,
          expiry_year: (currentYear + offset).toString(),
        });
        expect(errors).not.toContain('Invalid expiry year');
      }
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        currency_code: 'TRY',
        invoice_id: 'INV123',
        total: 100,
        name: 'John',
        surname: 'Doe',
        items: [],
        // Missing optional fields like cvv, installments_number, etc.
      };

      const errors = validatePaymentData(minimalData);

      // Should not have validation errors for missing optional fields
      expect(errors).not.toContain('Invalid amount');
      expect(errors).not.toContain('Invalid currency code');
      expect(errors).not.toContain('Invalid expiry month');
      expect(errors).not.toContain('Invalid expiry year');
      expect(errors).not.toContain('Invalid credit card number');
    });

    it('should validate with falsy but valid values', () => {
      const dataWithFalsyValues = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        expiry_month: '01', // Falsy but valid
        expiry_year: '2025',
        currency_code: 'TRY',
        invoice_id: 'INV123',
        total: 100,
        name: 'John',
        surname: 'Doe',
        items: [],
      };

      const errors = validatePaymentData(dataWithFalsyValues);

      // Should not reject valid falsy values
      expect(errors).not.toContain('Invalid expiry month');
    });

    it('should validate expiry edge cases', () => {
      const validBaseData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        total: 100,
        currency_code: 'TRY',
        invoice_id: 'INV123',
        name: 'John',
        surname: 'Doe',
        items: [],
      };

      // Test invalid expiry month (NaN)
      let errors = validatePaymentData({
        ...validBaseData,
        expiry_month: 'invalid',
        expiry_year: '2025',
      });
      expect(errors).toContain('Invalid expiry month');

      // Test invalid expiry month (out of range - too low)
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: '0',
        expiry_year: '2025',
      });
      expect(errors).toContain('Invalid expiry month');

      // Test invalid expiry month (out of range - too high)
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: '13',
        expiry_year: '2025',
      });
      expect(errors).toContain('Invalid expiry month');

      // Test invalid expiry year (NaN)
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: '12',
        expiry_year: 'invalid',
      });
      expect(errors).toContain('Invalid expiry year');

      // Test invalid expiry year (in the past)
      const pastYear = (new Date().getFullYear() - 1).toString();
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: '12',
        expiry_year: pastYear,
      });
      expect(errors).toContain('Invalid expiry year');

      // Test invalid expiry year (too far in future)
      const futureYear = (new Date().getFullYear() + 21).toString();
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: '12',
        expiry_year: futureYear,
      });
      expect(errors).toContain('Invalid expiry year');
    });

    it('should handle missing expiry fields (falsy branches)', () => {
      const validBaseData = {
        cc_holder_name: 'John Doe',
        cc_no: '4111111111111111',
        total: 100,
        currency_code: 'TRY',
        invoice_id: 'INV123',
        name: 'John',
        surname: 'Doe',
        items: [],
      };

      // Test with missing expiry_month (falsy - undefined)
      let errors = validatePaymentData({
        ...validBaseData,
        expiry_year: '2025',
        // expiry_month is undefined - should not trigger validation
      });
      expect(errors).toContain('Missing required field: expiry_month');
      expect(errors).not.toContain('Invalid expiry month');

      // Test with missing expiry_year (falsy - undefined)
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: '12',
        // expiry_year is undefined - should not trigger validation
      });
      expect(errors).toContain('Missing required field: expiry_year');
      expect(errors).not.toContain('Invalid expiry year');

      // Test with null expiry_month (falsy)
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: null,
        expiry_year: '2025',
      });
      expect(errors).toContain('Missing required field: expiry_month');
      expect(errors).not.toContain('Invalid expiry month');

      // Test with empty string expiry_year (falsy)
      errors = validatePaymentData({
        ...validBaseData,
        expiry_month: '12',
        expiry_year: '',
      });
      expect(errors).toContain('Missing required field: expiry_year');
      expect(errors).not.toContain('Invalid expiry year');
    });
  });

  describe('parseSipayError', () => {
    it('should parse error with response data and status_description', () => {
      const error = {
        response: {
          data: {
            status_code: 400,
            status_description: 'Invalid data provided',
          },
        },
      };

      const result = parseSipayError(error);

      expect(result).toEqual({
        code: 400,
        message: 'Invalid data provided',
      });
    });

    it('should parse error with response data and message fallback', () => {
      const error = {
        response: {
          data: {
            status_code: 500,
            message: 'Server error occurred',
            // No status_description
          },
        },
      };

      const result = parseSipayError(error);

      expect(result).toEqual({
        code: 500,
        message: 'Server error occurred',
      });
    });

    it('should parse error with response data and unknown error fallback', () => {
      const error = {
        response: {
          data: {
            status_code: 502,
            // No status_description or message
          },
        },
      };

      const result = parseSipayError(error);

      expect(result).toEqual({
        code: 502,
        message: 'Unknown error',
      });
    });

    it('should parse error with response data but no status_code', () => {
      const error = {
        response: {
          data: {
            status_description: 'Error without code',
          },
        },
      };

      const result = parseSipayError(error);

      expect(result).toEqual({
        code: 0,
        message: 'Error without code',
      });
    });

    it('should parse error without response data but with message', () => {
      const error = {
        message: 'Network connection failed',
      };

      const result = parseSipayError(error);

      expect(result).toEqual({
        code: 0,
        message: 'Network connection failed',
      });
    });

    it('should parse error without response or message', () => {
      const error = {};

      const result = parseSipayError(error);

      expect(result).toEqual({
        code: 0,
        message: 'Network error',
      });
    });
  });
});
