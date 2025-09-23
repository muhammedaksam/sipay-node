// Sipay API Types
export interface SipayConfig {
  appId: string;
  appSecret: string;
  merchantKey: string;
  baseUrl?: string;
  timeout?: number;
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
  qnantity: number; // Note: keeping original typo from API
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
}

export interface GetPosRequest {
  credit_card: string;
  amount: string;
  currency_code: string;
  merchant_key: string;
  is_2d?: number;
}

export interface PosInfo {
  pos_id: string;
  pos_name: string;
  installments: InstallmentOption[];
}

export interface InstallmentOption {
  installment: number;
  rate: number;
  amount: number;
}

export interface OrderStatusRequest {
  merchant_key: string;
  invoice_id: string;
  include_pending_status?: string;
}

export interface RefundRequest {
  invoice_id: string;
  merchant_key: string;
  amount: string;
}

export interface ConfirmPaymentRequest {
  invoice_id: string;
  merchant_key: string;
  status: number; // 1 = approved, 2 = abort
  hash_key: string;
  total?: number; // If not provided or 0, entire amount is confirmed
}

export interface InstallmentsResponse {
  status_code: number;
  message: string;
  installments: number[];
}

// Payment response interfaces based on OpenAPI spec

// 3D Payment response - direct response format (post-authentication callback)
export interface Payment3DResponse {
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
  status: string;
  hash_key: string;
  md_status?: string;
  original_bank_error_code?: string;
  original_bank_error_description?: string;
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
  // Recurring payment fields (optional)
  recurring_id?: number;
  recurring_plan_code?: string;
  next_action_date?: string;
  recurring_status?: string;
}

export interface RefundResponse {
  sipay_status: string;
  order_no: string;
  order_id: string;
  invoice_id: string;
  status_code: string;
  status_description: string;
  sipay_payment_method: string;
  transaction_type: string;
  payment_status: string;
  error_code: string;
  error: string;
  installment: string;
  amount: string;
  hash_key: string;
}

export interface GetTokenRequest {
  app_id: string;
  app_secret: string;
}

export interface RecurringQueryRequest {
  merchant_key: string;
  plan_code: string;
  app_id: string;
  app_secret: string;
}

export interface RecurringPlanProcessRequest {
  merchant_id: string;
  plan_code: string;
}

export interface CommissionRequest {
  currency_code: string;
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
}

export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

// Additional response interfaces based on OpenAPI spec and endpoint analysis

export interface CommissionResponse {
  commission_rate: number;
  commission_amount: number;
  currency_code: string;
  installments?: InstallmentCommission[];
}

export interface InstallmentCommission {
  installment_number: number;
  commission_rate: number;
  commission_amount: number;
}

export interface CashoutResponse {
  status: string;
  message: string;
  transaction_id?: string;
  reference_number?: string;
  amount?: number;
  currency?: string;
}

export interface PaymentCompleteResponse {
  status: string;
  message: string;
  order_id: string;
  invoice_id: string;
  transaction_status: string;
}

export interface ConfirmPaymentResponse {
  status: string;
  message: string;
  order_id: string;
  invoice_id: string;
  transaction_amount?: number;
}

export interface SaveCardResponse {
  status: string;
  message: string;
  card_token: string;
  masked_card: string;
  card_type: string;
}

export interface CardTokensResponse {
  status: string;
  message: string;
  cards: SavedCard[];
}

export interface SavedCard {
  card_token: string;
  masked_card: string;
  card_type: string;
  expiry_month: string;
  expiry_year: string;
  cc_holder_name: string;
}

export interface EditCardResponse {
  status: string;
  message: string;
  card_token: string;
}

export interface DeleteCardResponse {
  status: string;
  message: string;
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
  installment: number;
  amount: number;
  hash_key: string;
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
