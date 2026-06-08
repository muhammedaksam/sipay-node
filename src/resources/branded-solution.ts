import { SipayResource } from './base';
import { BrandedSolutionRequest, PaymentLinkResponse, RequestOptions } from '../types';
import { formatAmount } from '../utils';

export interface InvoicePayload {
  invoice_id: string;
  invoice_description: string;
  total: string;
  items: Array<{ name: string; price: number; quantity: number; description: string }>;
  discount?: number;
  coupon?: string | null;
  return_url?: string;
  cancel_url?: string;
  response_method?: string;
  is_comission_from_user?: number;
  commission_for_installment?: string;
  bill_address1?: string;
  bill_address2?: string;
  bill_city?: string;
  bill_postcode?: string;
  bill_state?: string;
  bill_country?: string;
  bill_email?: string;
  bill_phone?: string;
}

export interface PaymentLinkRequestBody {
  merchant_key: string;
  invoice: string;
  currency_code: string;
  name: string;
  surname: string;
  max_installment?: number;
  sale_web_hook_key?: string;
  order_type?: number;
  recurring_payment_number?: number;
  recurring_payment_cycle?: string;
  recurring_payment_interval?: string;
  recurring_web_hook_key?: string;
  app_lang?: string;
  is_comission_from_user?: number;
  commission_for_installment?: string;
  show_installment_table?: boolean;
}

export class BrandedSolution extends SipayResource {
  /**
   * Create a branded payment link
   * The API expects an `invoice` JSON string containing most payment details,
   * plus top-level parameters for configuration.
   */
  async createPaymentLink(
    linkData: Omit<BrandedSolutionRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<PaymentLinkResponse> {
    const data = this.addMerchantKey(linkData) as BrandedSolutionRequest;

    // Build the invoice JSON string as the API expects
    const invoiceObj: InvoicePayload = {
      invoice_id: data.invoice_id,
      invoice_description: data.invoice_description,
      total: formatAmount(data.total),
      items: data.items,
    };

    if (data.discount !== undefined) invoiceObj.discount = data.discount;
    if (data.coupon !== undefined) invoiceObj.coupon = data.coupon;
    if (data.return_url) invoiceObj.return_url = data.return_url;
    if (data.cancel_url) invoiceObj.cancel_url = data.cancel_url;
    if (data.response_method) invoiceObj.response_method = data.response_method;
    if (data.is_comission_from_user !== undefined)
      invoiceObj.is_comission_from_user = data.is_comission_from_user;
    if (data.commission_for_installment)
      invoiceObj.commission_for_installment = data.commission_for_installment;
    if (data.bill_address1) invoiceObj.bill_address1 = data.bill_address1;
    if (data.bill_address2) invoiceObj.bill_address2 = data.bill_address2;
    if (data.bill_city) invoiceObj.bill_city = data.bill_city;
    if (data.bill_postcode) invoiceObj.bill_postcode = data.bill_postcode;
    if (data.bill_state) invoiceObj.bill_state = data.bill_state;
    if (data.bill_country) invoiceObj.bill_country = data.bill_country;
    if (data.bill_email) invoiceObj.bill_email = data.bill_email;
    if (data.bill_phone) invoiceObj.bill_phone = data.bill_phone;

    // Build the request body with the invoice JSON string
    const requestBody: PaymentLinkRequestBody = {
      merchant_key: data.merchant_key,
      invoice: JSON.stringify(invoiceObj),
      currency_code: data.currency_code,
      name: data.name,
      surname: data.surname,
    };

    // Add optional top-level parameters
    if (data.max_installment !== undefined) requestBody.max_installment = data.max_installment;
    if (data.sale_web_hook_key) requestBody.sale_web_hook_key = data.sale_web_hook_key;
    if (data.order_type !== undefined) requestBody.order_type = data.order_type;
    if (data.recurring_payment_number !== undefined)
      requestBody.recurring_payment_number = data.recurring_payment_number;
    if (data.recurring_payment_cycle)
      requestBody.recurring_payment_cycle = data.recurring_payment_cycle;
    if (data.recurring_payment_interval)
      requestBody.recurring_payment_interval = data.recurring_payment_interval;
    if (data.recurring_web_hook_key)
      requestBody.recurring_web_hook_key = data.recurring_web_hook_key;
    if (data.app_lang) requestBody.app_lang = data.app_lang;
    if (data.is_comission_from_user !== undefined)
      requestBody.is_comission_from_user = data.is_comission_from_user;
    if (data.commission_for_installment)
      requestBody.commission_for_installment = data.commission_for_installment;
    if (data.show_installment_table !== undefined)
      requestBody.show_installment_table = data.show_installment_table;

    return this.post('/purchase/link', requestBody, options) as unknown as PaymentLinkResponse;
  }

  // Note: For checking branded payment status, use the standard Payments.checkStatus() method
  // with the invoice_id from the branded payment link
}
