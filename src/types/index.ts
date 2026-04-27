// Sipay API Types
export interface SipayConfig {
  appId: string;
  appSecret: string;
  merchantKey: string;
  baseUrl?: string;
  timeout?: number;
  appLang?: 'en' | 'tr';
}

export interface SipayApiResponse<T = any> {
  status_code: number;
  status_description: string;
  data?: T;
  message?: string;
  status?: boolean;
  link?: string;
  success_message?: string;
}

export interface TokenResponse {
  token: string;
  is_3d: number;
  expires_at: string;
}

export interface PaymentItem {
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export interface BasePaymentRequest {
  merchant_key: string;
  invoice_id: string;
  invoice_description: string;
  total: number;
  currency_code: string;
  installments_number?: number;
  items: PaymentItem[];
  name: string;
  surname: string;
  hash_key?: string;
  // Transaction type and completion
  transaction_type?: 'Auth' | 'PreAuth';
  payment_completed_by?: 'merchant' | 'app';
  // Commission parameters
  commission_by?: string;
  is_commission_from_user?: boolean;
  // Billing address fields
  bill_address1?: string;
  bill_address2?: string;
  bill_city?: string;
  bill_postcode?: string;
  bill_state?: string;
  bill_country?: string;
  bill_email?: string;
  bill_phone?: string;
  // Card and payment options
  card_program?: string;
  ip?: string;
  metadata?: string;
  sale_web_hook_key?: string;
  app_lang?: string;
  // Recurring payment parameters (optional)
  recurring_payment_number?: number;
  recurring_payment_cycle?: string; // D = Day, M = Month, Y = Year
  recurring_payment_interval?: string;
  recurring_web_hook_key?: string;
}

export interface CreditCardInfo {
  cc_holder_name: string;
  cc_no: string;
  expiry_month: string;
  expiry_year: string;
  cvv?: string;
}

export interface Payment2DRequest extends BasePaymentRequest, CreditCardInfo {
  cancel_url: string;
  return_url: string;
  order_type: string;
  ip: string;
}

export interface Payment3DRequest extends BasePaymentRequest, CreditCardInfo {
  cancel_url: string;
  return_url: string;
  order_type: string;
  bill_email: string;
  bill_phone: string;
  response_method: string;
  ip?: string; // Optional for 3D payments
  // Agriculture payment fields
  maturity_period?: number;
  payment_frequency?: number;
}

export interface GetPosRequest {
  credit_card: string;
  amount: number;
  currency_code: string;
  merchant_key: string;
  commission_by?: 'merchant' | 'user';
  is_recurring?: boolean;
  is_2d?: boolean;
  app_lang?: string;
}

export interface PosInfo {
  pos_id: number;
  campaign_id: number;
  allocation_id: number;
  installments_number: number;
  card_type: string;
  card_program: string;
  card_scheme: string;
  is_commercial: string;
  payable_amount: number;
  hash_key: string;
  amount_to_be_paid: string;
  currency_code: string;
  currency_id: number;
  title: string;
  card_bank: string;
  bank_code: string;
}

export interface OrderStatusRequest {
  merchant_key: string;
  invoice_id: string;
  include_pending_status?: boolean;
  show_refund_info?: 'Y';
  hash_key?: string;
  app_lang?: string;
}

export interface RefundRequest {
  invoice_id: string;
  merchant_key: string;
  amount: number;
  app_id: string;
  app_secret: string;
  hash_key: string;
  refund_transaction_id?: string;
  refund_web_hook_key?: string;
  app_lang?: string;
}

export interface ConfirmPaymentRequest {
  invoice_id: string;
  merchant_key: string;
  status: number; // 1 = confirmed, 2 = canceled
  hash_key: string;
  total: number;
  app_lang?: string;
}

export interface InstallmentsResponse {
  status_code: number;
  message: string;
  installments: number[];
}

// Payment response interfaces based on API docs

// 3D Payment response - direct response format (post-authentication callback)
export interface Payment3DResponse {
  sipay_status: number | string;
  order_no: string;
  order_id: string;
  invoice_id: string;
  status_code: number | string;
  status_description: string;
  sipay_payment_method: number | string;
  credit_card_no: string;
  transaction_type: string;
  payment_status: number | string;
  payment_method: number | string;
  error_code: number | string;
  error: string;
  auth_code: string;
  merchant_commission?: number | string;
  user_commission?: number | string;
  merchant_commission_percentage?: number | string;
  merchant_commission_fixed?: number | string;
  installment: number | string;
  amount: number | string;
  payment_reason_code?: string | null;
  payment_reason_code_detail?: string | null;
  status?: string;
  hash_key: string;
  md_status?: string;
  original_bank_error_code?: string | null;
  original_bank_error_description?: string | null;
  host_reference_id?: string;
}

// 2D Payment data nested inside SipayApiResponse
export interface Payment2DData {
  sipay_status: number;
  order_no: string;
  order_id: string;
  invoice_id: string;
  sipay_payment_method: number;
  credit_card_no: string;
  transaction_type: string;
  payment_status: number;
  payment_method: number;
  error_code: number;
  error: string;
  auth_code: string;
  merchant_commission?: number;
  user_commission?: number;
  merchant_commission_percentage?: number;
  merchant_commission_fixed?: number;
  installment: number;
  amount: number;
  payment_reason_code?: string;
  payment_reason_code_detail?: string;
  hash_key: string;
  original_bank_error_code?: string;
  original_bank_error_description?: string;
  host_reference_id?: string;
}

// 2D Payment response follows SipayApiResponse<Payment2DData> format
export type Payment2DResponse = Payment2DData;

export interface BrandedSolutionResponse {
  status: boolean;
  success_message: string;
  status_code: string;
  link: string;
  order_id: string;
}

export interface PaymentStatusResponse {
  status_code: number;
  status_description: string;
  transaction_status: string;
  order_id: string;
  transaction_id: string;
  message: string;
  reason: string;
  bank_status_code: string;
  bank_status_description: string;
  invoice_id: string;
  total_refunded_amount: number;
  product_price: string;
  transaction_amount: number;
  ref_number: string;
  transaction_type: string;
  original_bank_error_code: string;
  original_bank_error_description: string;
  cc_no: string;
  payment_reason_code: string;
  payment_reason_code_detail: string;
  merchant_commission: string;
  user_commission: string;
  settlement_date: string;
  installment: number;
  card_type: string;
  refund_info?: any[];
  // Recurring payment fields (optional)
  recurring_id?: number;
  recurring_plan_code?: string;
  next_action_date?: string;
  recurring_status?: string;
}

export interface RefundResponse {
  status_code: number;
  status_description: string;
  order_no: string;
  invoice_id: string;
  ref_no: string;
  ref_number: string;
}

export interface GetTokenRequest {
  app_id: string;
  app_secret: string;
  app_lang?: string;
}

export interface CommissionRequest {
  currency_code: string;
  commission_by?: 'merchant' | 'user';
  app_lang?: string;
}

export interface BrandedSolutionRequest {
  merchant_key: string;
  invoice_id: string;
  invoice_description: string;
  total: number;
  currency_code: string;
  items: PaymentItem[];
  name: string;
  surname: string;
  return_url?: string;
  cancel_url?: string;
}

export interface BrandedStatusRequest {
  merchant_key: string;
  invoice_id: string;
  is_direct_bank?: number;
}

export interface SipayError extends Error {
  status_code?: number;
  status_description?: string;
  type: 'SipayError';
  category?: string;
  isRetryable?: boolean;
}

export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

// Commission response — keys are installment numbers as strings
export interface CommissionData {
  title: string;
  card_program: string;
  merchant_commission_percentage: string | number;
  merchant_commission_fixed: string | number;
  user_commission_percentage: string | number;
  user_commission_fixed: string | number;
  currency_code: string;
  installment: number;
  pos_id?: number;
  getpos_card_program?: string;
}

/** Commission response: keys are installment numbers ("1", "2", ...) */
export type CommissionResponse = Record<string, CommissionData[]>;

export interface CashoutResponse {
  status: string;
  message: string;
  transaction_id?: string;
  reference_number?: string;
  amount?: number;
  currency?: string;
}

export interface PaymentCompleteResponse {
  sipay_status: number;
  order_no: string;
  order_id: string;
  invoice_id: string;
  status_code: number;
  status_description: string;
  sipay_payment_method: number;
  credit_card_no: string;
  transaction_type: string;
  payment_status: number;
  payment_method: number;
  error_code: number;
  error: string;
  auth_code: string;
  installment: number;
  amount: number;
  payment_reason_code?: string;
  payment_reason_code_detail?: string;
  status: string;
  hash_key: string;
  original_bank_error_code?: string;
  original_bank_error_description?: string;
}

export interface ConfirmPaymentResponse {
  status_code: number;
  status_description: string;
  transaction_status: string;
  order_id: string;
  invoice_id: string;
}

export interface SaveCardResponse {
  status_code: number;
  status_description: string;
  card_token: string;
}

export type CardTokensResponse = SavedCard[];

export interface SavedCard {
  id: number;
  card_token: string;
  card_user_key: string;
  card_number: string;
  merchant_id: number;
  customer_number: string;
  card_issuer_bank: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  bank_id: number;
  created_at: string;
  updated_at: string;
}

export interface EditCardResponse {
  status_code: number;
  status_description: string;
  card_token: string;
}

export interface DeleteCardResponse {
  status_code: number;
  status_description: string;
}

export interface CardPaymentResponse {
  sipay_status: number;
  order_no: string;
  order_id: string;
  invoice_id: string;
  status_code: number;
  status_description: string;
  sipay_payment_method: number;
  credit_card_no: string;
  transaction_type: string;
  payment_status: number;
  payment_method: number;
  error_code: number;
  error: string;
  auth_code: string;
  merchant_commission?: number;
  user_commission?: number;
  merchant_commission_percentage?: number;
  merchant_commission_fixed?: number;
  installment: number;
  amount: number;
  payment_reason_code?: string;
  payment_reason_code_detail?: string;
  hash_key: string;
  original_bank_error_code?: string;
  original_bank_error_description?: string;
  host_reference_id?: string;
}

// Marketplace response interfaces
export interface MarketplacePaymentResponse {
  sipay_status: number;
  order_no: string;
  order_id: string;
  invoice_id: string;
  status_code: number;
  status_description: string;
  sipay_payment_method: number;
  transaction_type: string;
  payment_status: number;
  payment_method: number;
  error_code: number;
  error: string;
  auth_code: string;
  amount: number;
  hash_key: string;
  sub_merchant_payouts?: SubMerchantPayout[];
}

export interface SubMerchantPayout {
  sub_merchant_id: string;
  sub_merchant_key: string;
  amount: number;
  commission: number;
  net_amount: number;
}

export interface MarketplaceRefundResponse {
  status: string;
  message: string;
  refund_id: string;
  original_transaction_id: string;
  refund_amount: number;
  sub_merchant_refunds?: SubMerchantRefund[];
}

export interface SubMerchantRefund {
  sub_merchant_id: string;
  refund_amount: number;
  status: string;
}

export interface SettlementsResponse {
  status: string;
  message: string;
  settlements: Settlement[];
  total_count: number;
  page: number;
  per_page: number;
}

export interface Settlement {
  settlement_id: string;
  settlement_date: string;
  total_amount: number;
  commission_amount: number;
  net_amount: number;
  currency: string;
  status: string;
  transactions: SettlementTransaction[];
}

export interface SettlementTransaction {
  transaction_id: string;
  order_id: string;
  invoice_id: string;
  amount: number;
  commission: number;
  net_amount: number;
  transaction_date: string;
}

export interface TransactionApprovalResponse {
  status: string;
  message: string;
  transaction_id: string;
  approval_status: string;
  approved_amount?: number;
}

export interface SubMerchantPayoutResponse {
  status: string;
  message: string;
  payout_id: string;
  sub_merchant_id: string;
  amount: number;
  payout_status: string;
}

// Sub-merchant response interfaces
export interface SubMerchantAddResponse {
  status: string;
  message: string;
  sub_merchant_id: string;
  sub_merchant_key: string;
}

export interface SubMerchantEditResponse {
  status: string;
  message: string;
  sub_merchant_id: string;
}

export interface SubMerchantDeleteResponse {
  status: string;
  message: string;
}

export interface SubMerchantListResponse {
  status: string;
  message: string;
  sub_merchants: SubMerchantInfo[];
  total_count: number;
  page: number;
  per_page: number;
}

export interface SubMerchantInfo {
  sub_merchant_id: string;
  sub_merchant_key: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tax_number?: string;
  status: string;
  created_at: string;
}

// Sub-merchant PF (Physical Person) response interfaces
export interface SubMerchantPFAddResponse {
  status: string;
  message: string;
  sub_merchant_pf_id: string;
}

export interface SubMerchantPFDeleteResponse {
  status: string;
  message: string;
}

export interface SubMerchantPFViewResponse {
  status: string;
  message: string;
  sub_merchant_pf: SubMerchantPFInfo;
}

export interface SubMerchantPFListResponse {
  status: string;
  message: string;
  sub_merchants_pf: SubMerchantPFInfo[];
  total_count: number;
  page: number;
  per_page: number;
}

export interface SubMerchantPFInfo {
  sub_merchant_pf_id: string;
  name: string;
  email: string;
  phone: string;
  identity_number: string;
  address: string;
  status: string;
  created_at: string;
}

// Recurring types
export interface RecurringQueryRequest {
  merchant_key: string;
  plan_code: string;
  recurring_number: number;
  app_lang?: string;
}

export interface RecurringQueryResponse {
  status_code: number;
  message: string;
  recurring_id: number;
  plan_code: string;
  currency: string;
  currency_symbol: string;
  first_amount: number;
  recurring_amount: number;
  total_amount: number;
  payment_number: number;
  payment_interval: number;
  payment_cycle: string;
  first_order_id: string;
  merchant_id: number;
  card_no: string;
  next_action_date: string;
  recurring_status: string;
  transaction_date: string;
  transactionHistories: RecurringTransactionHistory[];
}

export interface RecurringTransactionHistory {
  id: number;
  sale_recurring_id: number;
  sale_id: number;
  merchant_id: number;
  sale_recurring_payment_schedule_id: number;
  amount: number;
  action_date: string;
  status: string;
  recurring_number: number;
  attempts: number;
  remarks: string | null;
}

export interface RecurringPlanProcessRequest {
  merchant_id: string;
  plan_code: string;
}

export interface RecurringPlanProcessResponse {
  status_code: number;
  message: string;
}

export interface RecurringPlanUpdateRequest {
  merchant_key: string;
  plan_code: string;
  recurring_amount: string;
  recurring_status: string;
  recurring_payment_number: string;
}

export interface RecurringPlanUpdateResponse {
  status_code: number;
  message: string;
}

// Export status codes
export * from './status-codes';
