# Sipay Node.js SDK

An unofficial Node.js TypeScript SDK for the Sipay payment gateway.

## Features

- 🔐 Automatic authentication handling
- 💳 Support for 2D and 3D Secure payments
- 🔄 Recurring payments
- 🏷️ Branded payment solutions
- 📊 Commission information
- 🛡️ Type-safe with TypeScript
- ✅ Input validation
- 🔒 Secure payment processing
- 📚 Comprehensive documentation

## Installation

```bash
pnpm add @muhammedaksam/sipay-node
```

Or with npm:

```bash
npm install @muhammedaksam/sipay-node
```

Or with yarn:

```bash
yarn add @muhammedaksam/sipay-node
```

## Quick Start

```typescript
import Sipay from '@muhammedaksam/sipay-node';

const sipay = new Sipay({
  appId: 'your-app-id',
  appSecret: 'your-app-secret',
  merchantKey: 'your-merchant-key',
  // baseUrl: 'https://provisioning.sipay.com.tr/ccpayment', // Optional, defaults to production
});

// Example: Process a 2D payment
try {
  const result = await sipay.payments.pay2D({
    cc_holder_name: 'John Doe',
    cc_no: '4111111111111111',
    expiry_month: '12',
    expiry_year: '2025',
    cvv: '123',
    currency_code: 'TRY',
    installments_number: 1,
    invoice_id: 'INV123456',
    invoice_description: 'Test payment',
    total: 100.0,
    items: [
      {
        name: 'Product 1',
        price: 100.0,
        qnantity: 1,
        description: 'Test product',
      },
    ],
    name: 'John',
    surname: 'Doe',
  });

  if (result.status_code === 100) {
    console.log('Payment successful!');
  } else {
    console.log('Payment failed:', result.status_description);
  }
} catch (error) {
  console.error('Payment error:', error.message);
}
```

## API Reference

### Configuration

```typescript
interface SipayConfig {
  appId: string; // Your Sipay App ID
  appSecret: string; // Your Sipay App Secret
  merchantKey: string; // Your Merchant Key
  baseUrl?: string; // API base URL (optional)
  timeout?: number; // Request timeout in ms (optional, default: 80000)
}
```

### Payments

#### 2D Payment (Direct)

```typescript
const result = await sipay.payments.pay2D({
  cc_holder_name: 'John Doe',
  cc_no: '4111111111111111',
  expiry_month: '12',
  expiry_year: '2025',
  cvv: '123',
  currency_code: 'TRY',
  installments_number: 1,
  invoice_id: 'unique-invoice-id',
  invoice_description: 'Payment description',
  total: 100.0,
  items: [
    {
      name: 'Product Name',
      price: 100.0,
      qnantity: 1,
      description: 'Product description',
    },
  ],
  name: 'Customer Name',
  surname: 'Customer Surname',
  hash_key: 'optional-hash-key',
});
```

#### 3D Secure Payment

```typescript
const result = await sipay.payments.pay3D({
  // Same parameters as pay2D
  cc_holder_name: 'John Doe',
  cc_no: '4111111111111111',
  // ... other fields
});

// The result contains HTML form for 3D Secure authentication
// You need to render this form in the browser
```

#### Get POS Information

```typescript
const posInfo = await sipay.payments.getPos({
  credit_card: '411111', // First 6 digits
  amount: '100.00',
  currency_code: 'TRY',
  is_2d: 0, // 0 for 3D, 1 for 2D
});
```

#### Check Payment Status

```typescript
const status = await sipay.payments.checkStatus({
  invoice_id: 'your-invoice-id',
  include_pending_status: 'true',
});
```

#### Refund Payment

```typescript
const refund = await sipay.payments.refund({
  invoice_id: 'your-invoice-id',
  amount: '50.00', // Partial or full refund
});
```

### Recurring Payments

#### Query Recurring Plans

```typescript
const plans = await sipay.recurring.query({
  plan_code: 'your-plan-code',
  app_id: 'your-app-id',
  app_secret: 'your-app-secret',
});
```

#### Process Recurring Plan

```typescript
const result = await sipay.recurring.processPlan({
  merchant_id: 'your-merchant-id',
  plan_code: 'your-plan-code',
});
```

### Branded Solution

#### Create Payment Link

```typescript
const link = await sipay.brandedSolution.createPaymentLink({
  invoice_id: 'unique-invoice-id',
  invoice_description: 'Payment description',
  total: 100.0,
  currency_code: 'TRY',
  items: [
    {
      name: 'Product Name',
      price: 100.0,
      qnantity: 1,
      description: 'Product description',
    },
  ],
  name: 'Customer Name',
  surname: 'Customer Surname',
  return_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});

// Redirect customer to link.data.link
```

#### Check Branded Payment Status

```typescript
const status = await sipay.brandedSolution.checkStatus({
  invoice_id: 'your-invoice-id',
  is_direct_bank: 1,
});
```

### Commissions

#### Get Commission Rates

```typescript
const commissions = await sipay.commissions.getCommissions({
  currency_code: 'TRY',
});
```

## Utilities

The SDK includes utility functions for common tasks:

```typescript
import {
  generateHashKey,
  validateCreditCard,
  formatAmount,
  generateInvoiceId,
  validatePaymentData,
  maskCreditCard,
} from '@muhammedaksam/sipay-node';

// Generate hash key for payment verification
const hashKey = generateHashKey(merchantKey, invoiceId, amount, secretKey);

// Validate credit card number
const isValid = validateCreditCard('4111111111111111');

// Generate unique invoice ID
const invoiceId = generateInvoiceId('ORDER');

// Validate payment data
const errors = validatePaymentData(paymentData);

// Mask credit card for logging
const masked = maskCreditCard('4111111111111111'); // "4111****1111"
```

## Error Handling

The SDK throws `SipayError` objects with detailed information:

```typescript
try {
  const result = await sipay.payments.pay2D(paymentData);
} catch (error) {
  if (error.type === 'SipayError') {
    console.log('Status Code:', error.status_code);
    console.log('Description:', error.status_description);
  } else {
    console.log('Network Error:', error.message);
  }
}
```

## Response Format

All API methods return a standardized response:

```typescript
interface SipayApiResponse<T = any> {
  status_code: number; // 100 for success
  status_description: string;
  data?: T; // Response data (if any)
  message?: string; // Additional message
  status?: boolean; // Alternative status flag
  link?: string; // Payment link (for branded solutions)
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/muhammedaksam/sipay-node.git

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm run build

# Run linting
pnpm run lint

# Format code
pnpm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is an unofficial SDK for Sipay. Please refer to the [official Sipay API documentation](https://apidocs.sipay.com.tr/indexEn.html) for the most up-to-date API information.

## Credits

This SDK is built based on the official Sipay API documentation available at [https://apidocs.sipay.com.tr/indexEn.html](https://apidocs.sipay.com.tr/indexEn.html).

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/muhammedaksam/sipay-node/issues) on GitHub.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
