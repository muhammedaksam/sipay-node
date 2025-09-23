import { SipayResource } from './base';
import { SipayApiResponse, RequestOptions } from '../types';

export interface AddSubMerchantRequest {
  merchant_key: string;
  sub_merchant_name: string;
  sub_merchant_email: string;
  sub_merchant_phone: string;
  identity_number: string;
  sub_merchant_description: string;
  full_company_name: string;
  authorized_person_name: string;
  authorized_person_email: string;
  authorized_person_phone: string;
  contact_person_phone: string;
  business_area: string;
  zip_code: string;
  iban_no: string;
  is_enable_auto_withdrawal: string;
  settlement_id: number;
  auto_approval_days?: number;
  automatic_withdrawal_configuration?: {
    currency_code: string;
    auto_withdrawal_settlement_id: number;
    auto_withdrawal_remain_amount: number;
  };
  currency_code: string;
  auto_withdrawal_settlement_id: number;
  auto_withdrawal_remain_amount: number;
}

export interface EditSubMerchantRequest {
  merchant_key: string;
  sub_merchant_key: string;
  sub_merchant_name?: string;
  sub_merchant_email?: string;
  sub_merchant_phone?: string;
  identity_number?: string;
  sub_merchant_description?: string;
  full_company_name?: string;
  authorized_person_name?: string;
  authorized_person_email?: string;
  authorized_person_phone?: string;
  contact_person_phone?: string;
  business_area?: string;
  zip_code?: string;
  iban_no?: string;
  is_enable_auto_withdrawal?: string;
  settlement_id?: number;
  auto_approval_days?: number;
  automatic_withdrawal_configuration?: {
    currency_code: string;
    auto_withdrawal_settlement_id: number;
    auto_withdrawal_remain_amount: number;
  };
  currency_code?: string;
  auto_withdrawal_settlement_id?: number;
  auto_withdrawal_remain_amount?: number;
}

export interface DeleteSubMerchantRequest {
  merchant_key: string;
  sub_merchant_key: string;
}

export interface ListSubMerchantRequest {
  merchant_key: string;
}

export interface AddSubMerchantPFRequest {
  merchant_key: string;
  sub_merchant_key: string;
  sub_merchant_name: string;
  sub_merchant_email: string;
  sub_merchant_phone: string;
  sub_merchant_address: string;
  sub_merchant_tax_office: string;
  sub_merchant_tax_number: string;
  sub_merchant_identity_number: string;
  sub_merchant_iban: string;
}

export interface DeleteSubMerchantPFRequest {
  merchant_key: string;
  sub_merchant_key: string;
}

export interface ViewSubMerchantPFRequest {
  merchant_key: string;
  sub_merchant_key: string;
}

export interface ListSubMerchantPFRequest {
  merchant_key: string;
}

export class SubMerchant extends SipayResource {
  /**
   * Add a new standard sub merchant
   */
  async add(
    subMerchantData: Omit<AddSubMerchantRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(subMerchantData);
    return this.post('/api/sub-merchant/add', data, options);
  }

  /**
   * Edit a standard sub merchant
   */
  async edit(
    editData: Omit<EditSubMerchantRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(editData);
    return this.post('/api/sub-merchant/edit', data, options);
  }

  /**
   * Delete a standard sub merchant
   */
  async delete(
    deleteData: Omit<DeleteSubMerchantRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(deleteData);
    return this.post('/api/sub-merchant/delete', data, options);
  }

  /**
   * List all standard sub merchants
   */
  async list(
    listData?: Omit<ListSubMerchantRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(listData || {});
    return this.post('/api/sub-merchant/list', data, options);
  }

  /**
   * Add a new sub merchant PF (Physical Person)
   */
  async addPF(
    subMerchantData: Omit<AddSubMerchantPFRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(subMerchantData);
    return this.post('/api/addSubMerchantPF', data, options);
  }

  /**
   * Delete a sub merchant PF
   */
  async deletePF(
    deleteData: Omit<DeleteSubMerchantPFRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(deleteData);
    return this.post('/api/deleteSubMerchantPF', data, options);
  }

  /**
   * View details of a sub merchant PF
   */
  async viewPF(
    viewData: Omit<ViewSubMerchantPFRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(viewData);
    return this.post('/api/subMerchantPF/view', data, options);
  }

  /**
   * List all sub merchants PF
   */
  async listPF(
    listData?: Omit<ListSubMerchantPFRequest, 'merchant_key'>,
    options?: RequestOptions
  ): Promise<SipayApiResponse> {
    const data = this.addMerchantKey(listData || {});
    return this.post('/api/listSubMerchantPF', data, options);
  }
}
