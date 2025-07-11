import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SipayConfig, SipayApiResponse, SipayError, RequestOptions } from '../types';

export class SipayHttpClient {
  private client: AxiosInstance;
  private config: SipayConfig;
  private token?: string;

  constructor(config: SipayConfig) {
    this.config = {
      baseUrl: 'https://provisioning.sipay.com.tr/ccpayment',
      timeout: 80000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token && config.url !== '/api/token') {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        throw this.createSipayError(error);
      }
    );
  }

  async authenticate(): Promise<void> {
    try {
      const response = await this.client.post<SipayApiResponse<{ token: string; is_3d: number }>>(
        '/api/token',
        {
          app_id: this.config.appId,
          app_secret: this.config.appSecret,
        }
      );

      if (response.data.status_code === 100 && response.data.data?.token) {
        this.token = response.data.data.token;
      } else {
        throw new Error(response.data.status_description || 'Authentication failed');
      }
    } catch (error) {
      throw this.createSipayError(error);
    }
  }

  async request<T = any>(
    method: 'GET' | 'POST',
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    // Ensure we have a valid token before making requests
    if (!this.token && url !== '/api/token') {
      await this.authenticate();
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      ...(data && { data }),
      ...options,
    };

    try {
      const response: AxiosResponse<SipayApiResponse<T>> = await this.client.request(config);
      return response.data;
    } catch (error) {
      throw this.createSipayError(error);
    }
  }

  async get<T = any>(
    url: string,
    params?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    return this.request<T>('GET', url, params, options);
  }

  async post<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    return this.request<T>('POST', url, data, options);
  }

  async postForm<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<SipayApiResponse<T>> {
    const formOptions = {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    // Convert data to FormData for 3D payments
    if (data && typeof data === 'object') {
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
      return this.request<T>('POST', url, formData.toString(), formOptions);
    }

    return this.request<T>('POST', url, data, formOptions);
  }

  private createSipayError(error: any): SipayError {
    const sipayError = new Error() as SipayError;
    sipayError.type = 'SipayError';

    if (error.response?.data) {
      const errorData = error.response.data;
      sipayError.message =
        errorData.status_description || errorData.message || 'Unknown Sipay error';
      sipayError.status_code = errorData.status_code;
      sipayError.status_description = errorData.status_description;
    } else if (error.request) {
      sipayError.message = 'Network error: No response received from Sipay';
    } else {
      sipayError.message = error.message || 'Unknown error occurred';
    }

    return sipayError;
  }

  getToken(): string | undefined {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }
}
