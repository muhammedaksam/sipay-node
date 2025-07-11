import { SipayHttpClient } from '../utils/http-client';
import { SipayApiResponse, RequestOptions } from '../types';

export abstract class SipayResource {
  protected client: SipayHttpClient;

  constructor(client: SipayHttpClient) {
    this.client = client;
  }

  protected async request<T = any>(
    method: 'GET' | 'POST',
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    return this.client.request<T>(method, url, data, options);
  }

  protected async get<T = any>(
    url: string,
    params?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    return this.client.get<T>(url, params, options);
  }

  protected async post<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    return this.client.post<T>(url, data, options);
  }

  protected async postForm<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    return this.client.postForm<T>(url, data, options);
  }

  protected addMerchantKey(data: any): any {
    return {
      ...data,
      merchant_key: this.client['config'].merchantKey,
    };
  }
}
