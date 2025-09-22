/**
 * Test credentials provided by Sipay for testing purposes
 * DO NOT USE IN PRODUCTION
 */

export interface TestCredentials {
  merchantKey: string;
  appKey: string;
  appSecret: string;
  merchantId: string;
  description: string;
}

export interface TestCardInfo {
  number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  secure_password: string;
  type: string;
}

// Test environment credentials (mock transactions)
export const TEST_CREDENTIALS: TestCredentials = {
  merchantKey: '$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO',
  appKey: '6d4a7e9374a76c15260fcc75e315b0b9',
  appSecret: 'b46a67571aa1e7ef5641dc3fa6f1712a',
  merchantId: '18309',
  description: 'Mock test environment - no real charges',
};

// Real test environment credentials (actual charges will occur)
export const REAL_TEST_CREDENTIALS: TestCredentials = {
  merchantKey: '$2y$10$0X.RKmBNjKHg7vfJ8N46j.Zq.AU6vBVASro7AGGkaffB4mrdaV4mO',
  appKey: '077faac7dba364b3f058193de9fea2e6',
  appSecret: 'bb18138fbd6fe9a2512e8933e6f37a01',
  merchantId: '78640',
  description: 'Real test environment - ACTUAL CHARGES WILL OCCUR',
};

// Test credit cards
export const TEST_CARDS: TestCardInfo[] = [
  {
    number: '4508034508034509',
    expiry_month: '12',
    expiry_year: '26',
    cvv: '000',
    secure_password: 'a',
    type: 'Visa',
  },
  {
    number: '5406675406675403',
    expiry_month: '12',
    expiry_year: '26',
    cvv: '000',
    secure_password: 'a',
    type: 'MasterCard',
  },
  {
    number: '6501700139082826',
    expiry_month: '12',
    expiry_year: '26',
    cvv: '000',
    secure_password: '123456',
    type: 'Troy',
  },
];

// Currency test card
export const CURRENCY_TEST_CARD: TestCardInfo = {
  number: '5440931443094530',
  expiry_month: '12',
  expiry_year: '23',
  cvv: '000',
  secure_password: 'a',
  type: 'Currency Test Card',
};

// Test environment URLs
export const TEST_URLS = {
  test: 'https://provisioning.sipay.com.tr/ccpayment',
  live: 'https://app.sipay.com.tr/ccpayment',
};

// Helper function to generate unique invoice IDs
export function generateInvoiceId(prefix = 'TEST'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${random}`;
}

// Helper function to create test items
export function createTestItems(count = 1, unitPrice = 50.0) {
  const items: { name: string; price: number; qnantity: number; description: string }[] = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      name: `Test Product ${i}`,
      price: unitPrice,
      qnantity: 1, // Note: keeping original typo from API
      description: `Test product ${i} description`,
    });
  }
  return items;
}
