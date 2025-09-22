# Testing Sipay SDK with Real Test Credentials

This document explains how to test the Sipay Node.js SDK using the official test credentials and test cards provided by Sipay.

## Test Environments

Sipay provides two test environments:

### 1. Mock Test Environment (Default - No Real Charges)

- **Merchant Key**: `$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO`
- **APP Key**: `6d4a7e9374a76c15260fcc75e315b0b9`
- **APP Secret**: `b46a67571aa1e7ef5641dc3fa6f1712a`
- **Merchant ID**: `18309`
- **Description**: Mock transactions, no real charges occur

### 2. Real Test Environment (⚠️ Real Charges Will Occur)

- **Merchant Key**: `$2y$10$0X.RKmBNjKHg7vfJ8N46j.Zq.AU6vBVASro7AGGkaffB4mrdaV4mO`
- **APP Key**: `077faac7dba364b3f058193de9fea2e6`
- **APP Secret**: `bb18138fbd6fe9a2512e8933e6f37a01`
- **Merchant ID**: `78640`
- **⚠️ WARNING**: Real charges will be made to your test cards

## Test Credit Cards

### Standard Test Cards

| Card Type  | Number             | Expiry  | CVV   | 3D Secure Password |
| ---------- | ------------------ | ------- | ----- | ------------------ |
| Visa       | `4508034508034509` | `12/26` | `000` | `a`                |
| MasterCard | `5406675406675403` | `12/26` | `000` | `a`                |
| Troy       | `6501700139082826` | `12/26` | `000` | `123456`           |

### Currency Test Card

| Card Number        | Expiry  | CVV   | 3D Secure Password |
| ------------------ | ------- | ----- | ------------------ |
| `5440931443094530` | `12/23` | `000` | `a`                |

## Running Tests

### 1. Build the SDK First

```bash
pnpm run build
```

### 2. Run Example Tests (Mock Environment - Safe)

```bash
pnpm run test:examples
```

### 3. Run Integration Tests (Mock Environment - Safe)

```bash
pnpm run test:integration
```

### 4. Run Tests with Real Charges (⚠️ Use with Caution)

```bash
pnpm run test:real
```

## Test Examples

### Basic 2D Payment

```typescript
import Sipay from '@muhammedaksam/sipay-node';

const sipay = new Sipay({
  appId: '6d4a7e9374a76c15260fcc75e315b0b9',
  appSecret: 'b46a67571aa1e7ef5641dc3fa6f1712a',
  merchantKey: '$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO',
  baseUrl: 'https://provisioning.sipay.com.tr/ccpayment',
});

const payment = await sipay.payments.pay2D({
  invoice_id: `TEST_${Date.now()}`,
  invoice_description: 'Test Payment',
  total: 100.5,
  currency_code: 'TRY',
  installments_number: 1,
  items: [
    {
      name: 'Test Product',
      price: 100.5,
      qnantity: 1,
      description: 'Test product',
    },
  ],
  name: 'John',
  surname: 'Doe',
  cc_holder_name: 'John Doe',
  cc_no: '4508034508034509',
  expiry_month: '12',
  expiry_year: '26',
  cvv: '000',
});
```

### 3D Secure Payment

```typescript
const payment3D = await sipay.payments.pay3D({
  invoice_id: `TEST_3D_${Date.now()}`,
  invoice_description: 'Test 3D Payment',
  total: 250.0,
  currency_code: 'TRY',
  installments_number: 1,
  items: [
    {
      name: 'Premium Product',
      price: 250.0,
      qnantity: 1,
      description: 'Premium product with 3D Secure',
    },
  ],
  name: 'Jane',
  surname: 'Smith',
  cc_holder_name: 'Jane Smith',
  cc_no: '5406675406675403',
  expiry_month: '12',
  expiry_year: '26',
  cvv: '000',
});

// If successful, payment3D.data contains the 3D Secure form HTML
// Use password 'a' for 3D Secure authentication
```

### POS Information Query

```typescript
const posInfo = await sipay.payments.getPos({
  credit_card: '450803', // First 6 digits of card
  amount: '100.00',
  currency_code: 'TRY',
});
```

### Payment Status Check

```typescript
const status = await sipay.payments.checkStatus({
  invoice_id: 'your-invoice-id',
});
```

## Test Features

The test suite covers:

1. **Authentication** - Token generation and management
2. **2D Payments** - Direct payment processing
3. **3D Secure Payments** - Secure payment with authentication
4. **POS Information** - Card type and installment queries
5. **Payment Status** - Transaction status checking
6. **Installment Payments** - Multi-installment transactions
7. **Multiple Card Types** - Visa, MasterCard, and Troy cards
8. **Error Handling** - Invalid card and edge cases

## Environment Variables

Set `SIPAY_USE_REAL_TEST=true` to use the real test environment:

```bash
export SIPAY_USE_REAL_TEST=true
pnpm run test:integration
```

## ⚠️ Important Notes

1. **Mock Environment**: Safe for development, no real charges
2. **Real Test Environment**: Actual charges will occur on your test cards
3. **3D Secure Passwords**: Use the provided passwords for authentication
4. **Invoice IDs**: Must be unique for each transaction
5. **Currency**: All examples use Turkish Lira (TRY)

## Files Structure

```
test/integration/
├── test-credentials.ts     # Test credentials and card data
├── test-runner.ts         # Integration test runner
└── payment-integration.test.ts # Jest integration tests

examples/
└── test-with-real-credentials.ts # Runnable examples
```

## Troubleshooting

### Common Issues

1. **Authentication Failure**: Check APP_KEY and APP_SECRET
2. **Invalid Card**: Ensure card number matches test cards exactly
3. **Invalid Amount**: Some minimum amounts may be required
4. **3D Secure Issues**: Use correct passwords for each card type

### Getting Help

- Check the official Sipay documentation
- Review error messages in `status_description`
- Use mock environment for debugging
- Test with minimal amounts first

## Next Steps

After successful testing:

1. Integrate the SDK into your application
2. Replace test credentials with live credentials
3. Update the base URL to production: `https://app.sipay.com.tr/ccpayment`
4. Implement proper error handling and logging
5. Add transaction monitoring and reporting
