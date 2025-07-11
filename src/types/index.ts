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
}

export interface CreditCardInfo {
  cc_holder_name: string;
  cc_no: string;
  expiry_month: string;
  expiry_year: string;
  cvv?: string;
}

export interface Payment2DRequest extends BasePaymentRequest, CreditCardInfo {}

export interface Payment3DRequest extends BasePaymentRequest, CreditCardInfo {}

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
