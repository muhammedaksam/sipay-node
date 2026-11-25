/**
 * Sipay API Enums & Constants
 *
 * Defined as `as const` objects with matching union types so callers can use
 * either the named constant (e.g. `SipayPaymentMethod.CREDIT_CARD`) or the
 * underlying literal value (e.g. `'1'`) with full type safety and autocomplete.
 */

/**
 * Payment method codes returned in webhooks and payment responses
 */
export const SipayPaymentMethod = {
  CREDIT_CARD: '1',
  MOBILE: '2',
  WALLET: '3',
} as const;
export type SipayPaymentMethod = (typeof SipayPaymentMethod)[keyof typeof SipayPaymentMethod];

/**
 * Payment status flag returned in sales webhooks
 */
export const SipayPaymentStatus = {
  FAILED: '0',
  SUCCESSFUL: '1',
} as const;
export type SipayPaymentStatus = (typeof SipayPaymentStatus)[keyof typeof SipayPaymentStatus];

/**
 * Transaction type values accepted in payment requests
 */
export const SipayTransactionType = {
  AUTH: 'Auth',
  PRE_AUTH: 'PreAuth',
} as const;
export type SipayTransactionType = (typeof SipayTransactionType)[keyof typeof SipayTransactionType];

/**
 * Transaction type values returned in sales webhooks and payment responses
 */
export const SipayWebhookTransactionType = {
  AUTH: 'Auth',
  PRE_AUTHORIZATION: 'Pre-Authorization',
} as const;
export type SipayWebhookTransactionType =
  (typeof SipayWebhookTransactionType)[keyof typeof SipayWebhookTransactionType];

/**
 * Merchant payment integration mode (`is_3d`) returned by `/api/token`
 * - `0`: Whitelabel Non-3DS only
 * - `1`: Whitelabel Non-3DS or 3D
 * - `2`: Whitelabel 3D only
 * - `4`: Branded payment solution
 */
export const SipayIntegrationType = {
  NON_SECURE_ONLY: 0,
  NON_SECURE_OR_3D: 1,
  THREE_D_ONLY: 2,
  BRANDED: 4,
} as const;
export type SipayIntegrationType = (typeof SipayIntegrationType)[keyof typeof SipayIntegrationType];

/**
 * Status values for pre-authorization confirmation (`/api/confirmPayment`)
 */
export const SipayConfirmStatus = {
  CONFIRMED: 1,
  CANCELED: 2,
} as const;
export type SipayConfirmStatus = (typeof SipayConfirmStatus)[keyof typeof SipayConfirmStatus];

/**
 * Order type flag for standard vs recurring payments
 */
export const SipayOrderType = {
  NORMAL: 0,
  RECURRING: 1,
} as const;
export type SipayOrderType = (typeof SipayOrderType)[keyof typeof SipayOrderType];

/**
 * Recurring payment cycle units
 */
export const SipayRecurringCycle = {
  DAY: 'D',
  MONTH: 'M',
  YEAR: 'Y',
} as const;
export type SipayRecurringCycle = (typeof SipayRecurringCycle)[keyof typeof SipayRecurringCycle];

/**
 * Recurring plan status values for `/api/recurringPlan/update`
 */
export const SipayRecurringStatus = {
  ACTIVE: 'ACTIVE',
  PASSIVE: 'PASSIVE',
} as const;
export type SipayRecurringStatus = (typeof SipayRecurringStatus)[keyof typeof SipayRecurringStatus];

/**
 * Cashout type codes (`/api/cashout/tobank`)
 */
export const SipayCashoutType = {
  TO_BANK: 1,
} as const;
export type SipayCashoutType = (typeof SipayCashoutType)[keyof typeof SipayCashoutType];

/**
 * 3D Secure authentication result (`md_status`)
 */
export const SipayMdStatus = {
  AUTHENTICATION_FAILED: '0',
  FULL_AUTHENTICATION: '1',
} as const;
export type SipayMdStatus = (typeof SipayMdStatus)[keyof typeof SipayMdStatus];

/**
 * Common webhook status values (Sales, Recurring, Refund)
 */
export const SipayWebhookStatus = {
  COMPLETED: 'Completed',
  FAIL: 'Fail',
} as const;
export type SipayWebhookStatus = (typeof SipayWebhookStatus)[keyof typeof SipayWebhookStatus];

/**
 * Transaction status strings returned by status check and confirmation endpoints
 */
export const SipayTransactionStatus = {
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  FAILED: 'Failed',
  UNKNOWN: 'Unknown',
  PRE_AUTHORIZATION: 'Pre-Authorization',
  PRE_AUTH_APPROVED: 'Pre-Auth Approved',
  REFUND: 'refund',
  PARTIALLY_REFUND: 'partially_refund',
} as const;
export type SipayTransactionStatus =
  (typeof SipayTransactionStatus)[keyof typeof SipayTransactionStatus];

/**
 * Supported currency codes
 */
export const SipayCurrency = {
  TRY: 'TRY',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
} as const;
export type SipayCurrency = (typeof SipayCurrency)[keyof typeof SipayCurrency];

/**
 * Supported API response languages (`app_lang`)
 */
export const SipayAppLang = {
  EN: 'en',
  TR: 'tr',
} as const;
export type SipayAppLang = (typeof SipayAppLang)[keyof typeof SipayAppLang];

/**
 * Party paying the transaction commission (`commission_by`)
 */
export const SipayCommissionBy = {
  MERCHANT: 'merchant',
  USER: 'user',
} as const;
export type SipayCommissionBy = (typeof SipayCommissionBy)[keyof typeof SipayCommissionBy];

/**
 * Party responsible for completing a 3D payment (`payment_completed_by`)
 */
export const SipayPaymentCompletedBy = {
  MERCHANT: 'merchant',
  APP: 'app',
} as const;
export type SipayPaymentCompletedBy =
  (typeof SipayPaymentCompletedBy)[keyof typeof SipayPaymentCompletedBy];

/**
 * Status action for merchant-completed 3D payments (`/payment/complete`)
 */
export const SipayPaymentCompletionStatus = {
  COMPLETE: 'complete',
  CANCEL: 'cancel',
} as const;
export type SipayPaymentCompletionStatus =
  (typeof SipayPaymentCompletionStatus)[keyof typeof SipayPaymentCompletionStatus];

/**
 * HTTP method used when Sipay redirects back to `return_url` / `cancel_url`
 */
export const SipayResponseMethod = {
  GET: 'GET',
  POST: 'POST',
} as const;
export type SipayResponseMethod = (typeof SipayResponseMethod)[keyof typeof SipayResponseMethod];

/**
 * Supported Turkish bank card loyalty programs (`card_program`)
 */
export const SipayCardProgram = {
  WORLD: 'WORLD',
  BONUS: 'BONUS',
  MAXIMUM: 'MAXIMUM',
  BANKKART_COMBO: 'BANKKART_COMBO',
  PARAF: 'PARAF',
  AXESS: 'AXESS',
  ADVANT: 'ADVANT',
  CARD_FNS: 'CARD_FNS',
} as const;
export type SipayCardProgram = (typeof SipayCardProgram)[keyof typeof SipayCardProgram];
