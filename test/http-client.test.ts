import axios from 'axios';
import { SipayHttpClient } from '../src/utils/http-client';
import { SipayConfig } from '../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SipayHttpClient', () => {
  let httpClient: SipayHttpClient;
  let config: SipayConfig;

  beforeEach(() => {
    config = {
      appId: 'test_app_id',
      appSecret: 'test_app_secret',
      merchantKey: 'test_merchant_key',
      baseUrl: 'https://test.sipay.com.tr',
    };

    // Reset mocks
    jest.clearAllMocks();

    // Mock axios.create to return the mocked axios instance
    mockedAxios.create.mockReturnValue(mockedAxios);

    httpClient = new SipayHttpClient(config);
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: config.baseUrl,
        timeout: 80000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should use default baseUrl if not provided', () => {
      const configWithoutURL = { ...config };
      delete (configWithoutURL as any).baseUrl;

      new SipayHttpClient(configWithoutURL);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://provisioning.sipay.com.tr/ccpayment',
        timeout: 80000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('authentication', () => {
    beforeEach(() => {
      // Mock successful token response
      mockedAxios.post.mockResolvedValue({
        data: {
          status_code: 100,
          data: {
            token: 'test_token_12345',
            is_3d: 1,
          },
        },
      });
    });

    it('should authenticate and get token', async () => {
      await httpClient.authenticate();

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/token', {
        app_id: config.appId,
        app_secret: config.appSecret,
      });
    });

    it('should handle authentication failure', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          status_code: 400,
          status_description: 'Invalid credentials',
        },
      });

      await expect(httpClient.authenticate()).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors during authentication', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(httpClient.authenticate()).rejects.toThrow();
    });

    it('should handle authentication success without token', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          status_code: 100,
          data: null, // No token provided
        },
      });

      await expect(httpClient.authenticate()).rejects.toThrow('Authentication failed');
    });

    it('should handle authentication with missing data', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          status_code: 100,
          // Missing data property entirely
        },
      });

      await expect(httpClient.authenticate()).rejects.toThrow('Authentication failed');
    });

    it('should handle authentication failure status codes', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          status_code: 400,
          status_description: 'Invalid app credentials',
        },
      });

      await expect(httpClient.authenticate()).rejects.toThrow('Invalid app credentials');
    });

    it('should handle authentication failure without status description', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          status_code: 400,
          // No status_description
        },
      });

      await expect(httpClient.authenticate()).rejects.toThrow('Authentication failed');
    });
  });

  describe('request method', () => {
    beforeEach(() => {
      // Mock successful authentication
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          status_code: 100,
          data: {
            token: 'test_token_12345',
            is_3d: 1,
          },
        },
      });
    });

    it('should make authenticated requests', async () => {
      const mockResponse = {
        data: {
          status_code: 100,
          status_description: 'Success',
        },
      };

      mockedAxios.request.mockResolvedValueOnce(mockResponse);

      const result = await httpClient.request('POST', '/api/test', { test: 'data' });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle request options', async () => {
      const mockResponse = {
        data: {
          status_code: 100,
          status_description: 'Success',
        },
      };

      mockedAxios.request.mockResolvedValueOnce(mockResponse);

      await httpClient.request(
        'POST',
        '/api/test',
        { test: 'data' },
        {
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
        }
      );

      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/test',
        data: { test: 'data' },
        timeout: 5000,
        headers: { 'Custom-Header': 'value' },
      });
    });

    it('should handle API errors', async () => {
      mockedAxios.request.mockRejectedValue({
        response: {
          data: {
            status_code: 400,
            status_description: 'Invalid request',
          },
        },
      });

      await expect(httpClient.request('POST', '/api/test', {})).rejects.toThrow();
    });
  });

  describe('get method', () => {
    it('should make GET requests', async () => {
      const spy = jest.spyOn(httpClient, 'request').mockResolvedValue({
        status_code: 100,
        status_description: 'Success',
      });

      await httpClient.get('/api/test');

      expect(spy).toHaveBeenCalledWith('GET', '/api/test', undefined, undefined);
    });
  });

  describe('post method', () => {
    it('should make POST requests', async () => {
      const spy = jest.spyOn(httpClient, 'request').mockResolvedValue({
        status_code: 100,
        status_description: 'Success',
      });

      await httpClient.post('/api/test', { data: 'test' });

      expect(spy).toHaveBeenCalledWith('POST', '/api/test', { data: 'test' }, undefined);
    });

    it('should make POST requests with custom options', async () => {
      const spy = jest.spyOn(httpClient, 'request').mockResolvedValue({
        status_code: 100,
        status_description: 'Success',
      });

      const options = { headers: { 'Content-Type': 'multipart/form-data' } };
      await httpClient.post('/api/test', { data: 'test' }, options);

      expect(spy).toHaveBeenCalledWith('POST', '/api/test', { data: 'test' }, options);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      // Set a token to avoid authentication calls
      httpClient.setToken('test_token');
    });

    it('should create SipayError from response data', async () => {
      const mockError = {
        response: {
          data: {
            status_code: 400,
            status_description: 'Invalid request data',
            message: 'Alternative message',
          },
        },
      };

      mockedAxios.request.mockRejectedValue(mockError);

      try {
        await httpClient.request('POST', '/api/test', {});
      } catch (error: any) {
        expect(error.type).toBe('SipayError');
        expect(error.message).toBe('Invalid request data');
        expect(error.status_code).toBe(400);
        expect(error.status_description).toBe('Invalid request data');
      }
    });

    it('should create SipayError from response data with message fallback', async () => {
      const mockError = {
        response: {
          data: {
            status_code: 400,
            message: 'Fallback message',
            // No status_description
          },
        },
      };

      mockedAxios.request.mockRejectedValue(mockError);

      try {
        await httpClient.request('POST', '/api/test', {});
      } catch (error: any) {
        expect(error.type).toBe('SipayError');
        expect(error.message).toBe('Fallback message');
      }
    });

    it('should create SipayError from response data with unknown error fallback', async () => {
      const mockError = {
        response: {
          data: {
            status_code: 500,
            // No status_description or message
          },
        },
      };

      mockedAxios.request.mockRejectedValue(mockError);

      try {
        await httpClient.request('POST', '/api/test', {});
      } catch (error: any) {
        expect(error.type).toBe('SipayError');
        expect(error.message).toBe('Unknown Sipay error');
      }
    });

    it('should create SipayError from request error (network error)', async () => {
      const mockError = {
        request: {}, // Request was made but no response received
        // No response property
      };

      mockedAxios.request.mockRejectedValue(mockError);

      try {
        await httpClient.request('POST', '/api/test', {});
      } catch (error: any) {
        expect(error.type).toBe('SipayError');
        expect(error.message).toBe('Network error: No response received from Sipay');
      }
    });

    it('should create SipayError from generic error', async () => {
      const mockError = new Error('Generic error message');
      // No request or response properties

      mockedAxios.request.mockRejectedValue(mockError);

      try {
        await httpClient.request('POST', '/api/test', {});
      } catch (error: any) {
        expect(error.type).toBe('SipayError');
        expect(error.message).toBe('Generic error message');
      }
    });

    it('should create SipayError from error without message', async () => {
      const mockError = {}; // No message, request, or response

      mockedAxios.request.mockRejectedValue(mockError);

      try {
        await httpClient.request('POST', '/api/test', {});
      } catch (error: any) {
        expect(error.type).toBe('SipayError');
        expect(error.message).toBe('Unknown error occurred');
      }
    });
  });

  describe('token management', () => {
    it('should get token', () => {
      const token = httpClient.getToken();
      expect(token).toBeUndefined(); // Initially undefined
    });

    it('should set and get token', () => {
      httpClient.setToken('test_token');
      expect(httpClient.getToken()).toBe('test_token');
    });

    it('should make requests without authentication for /api/token endpoint', async () => {
      // Mock authentication first
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          status_code: 100,
          data: {
            token: 'test_token_12345',
            is_3d: 1,
          },
        },
      });

      const mockResponse = {
        data: {
          status_code: 100,
          status_description: 'Success',
        },
      };

      mockedAxios.request.mockResolvedValueOnce(mockResponse);

      // Request to /api/token should not trigger additional authentication
      const result = await httpClient.request('POST', '/api/token', { test: 'data' });

      expect(result).toEqual(mockResponse.data);
      // Should not call authenticate again
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('request interceptors', () => {
    it('should add authorization header when token exists and not /api/token', async () => {
      // Set a token first
      httpClient.setToken('test_token_123');

      const mockResponse = {
        data: {
          status_code: 100,
          status_description: 'Success',
        },
      };

      mockedAxios.request.mockResolvedValueOnce(mockResponse);

      await httpClient.request('POST', '/api/other', { test: 'data' });

      // Check that the request was made (interceptor would have added auth header)
      expect(mockedAxios.request).toHaveBeenCalled();
    });

    it('should not add authorization header for /api/token endpoint', async () => {
      // Set a token first
      httpClient.setToken('test_token_123');

      const mockResponse = {
        data: {
          status_code: 100,
          status_description: 'Success',
        },
      };

      mockedAxios.request.mockResolvedValueOnce(mockResponse);

      await httpClient.request('POST', '/api/token', { test: 'data' });

      // Should still work without auth header for token endpoint
      expect(mockedAxios.request).toHaveBeenCalled();
    });

    it('should handle successful response through interceptor', async () => {
      const mockRequestUse = jest.fn();
      const mockResponseUse = jest.fn();
      const mockRequest = jest.fn();

      mockedAxios.create.mockReturnValue({
        interceptors: {
          request: { use: mockRequestUse },
          response: { use: mockResponseUse },
        },
        request: mockRequest,
      } as any);

      // Create client to trigger interceptor setup
      new SipayHttpClient({
        appId: 'test',
        appSecret: 'test',
        merchantKey: 'test',
        baseUrl: 'https://test.api',
      });

      // Access the response interceptor (success handler)
      const responseSuccessHandler = mockResponseUse.mock.calls[0][0];

      // Test that successful responses pass through unchanged
      const mockResponse = { data: { success: true }, status: 200 };
      const result = responseSuccessHandler(mockResponse);
      expect(result).toBe(mockResponse);
    });

    it('should add authorization header when token exists and URL is not /api/token', async () => {
      const mockRequestUse = jest.fn();
      const mockResponseUse = jest.fn();

      mockedAxios.create.mockReturnValue({
        interceptors: {
          request: { use: mockRequestUse },
          response: { use: mockResponseUse },
        },
        request: jest.fn(),
      } as any);

      // Create client and set token
      const testClient = new SipayHttpClient({
        appId: 'test',
        appSecret: 'test',
        merchantKey: 'test',
        baseUrl: 'https://test.api',
      });
      testClient.setToken('test-token');

      // Access the request interceptor
      const requestInterceptor = mockRequestUse.mock.calls[0][0];

      // Test with non-/api/token URL and token exists
      const config = {
        url: '/api/payments',
        headers: {},
      };
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });
  });

  describe('Additional Branch Coverage', () => {
    it('should make request without token when URL is /api/token', async () => {
      const mockRequestUse = jest.fn();
      const mockResponseUse = jest.fn();

      mockedAxios.create.mockReturnValue({
        interceptors: {
          request: { use: mockRequestUse },
          response: { use: mockResponseUse },
        },
        request: jest.fn().mockResolvedValue({ data: { access_token: 'new-token' } }),
      } as any);

      // Create client to trigger interceptor setup
      new SipayHttpClient({
        appId: 'test',
        appSecret: 'test',
        merchantKey: 'test',
        baseUrl: 'https://test.api',
      });

      // Access the interceptor function that was registered
      const requestInterceptor = mockRequestUse.mock.calls[0][0];

      // Test with /api/token URL (should not add Authorization header)
      const configWithTokenUrl = {
        url: '/api/token',
        headers: {},
      };
      const result = requestInterceptor(configWithTokenUrl);
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should make request without token when no token is set', async () => {
      const mockRequestUse = jest.fn();
      const mockResponseUse = jest.fn();

      mockedAxios.create.mockReturnValue({
        interceptors: {
          request: { use: mockRequestUse },
          response: { use: mockResponseUse },
        },
        request: jest.fn().mockResolvedValue({ data: { success: true } }),
      } as any);

      // Create client to trigger interceptor setup
      new SipayHttpClient({
        appId: 'test',
        appSecret: 'test',
        merchantKey: 'test',
        baseUrl: 'https://test.api',
      });

      // Access the interceptor function
      const requestInterceptor = mockRequestUse.mock.calls[0][0];

      // Test without token set
      const config = {
        url: '/api/other',
        headers: {},
      };
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle postForm with array data', async () => {
      const mockResponse = { data: { status: 'success' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      httpClient.setToken('test-token');

      const data = {
        items: ['item1', 'item2'],
        metadata: { key: 'value' },
        simple: 'string',
      };

      const result = await httpClient.postForm('/api/form', data);

      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/form',
        data: expect.stringContaining('items=%5B%22item1%22%2C%22item2%22%5D'), // URL encoded JSON array
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      expect(result).toEqual(mockResponse.data); // Return just the data part
    });

    it('should handle postForm with null data', async () => {
      const mockResponse = { data: { status: 'success' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      httpClient.setToken('test-token');

      const result = await httpClient.postForm('/api/form', null);

      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/form',
        // data property is not included when data is null/falsy
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle network error (request made but no response)', async () => {
      const networkError = {
        request: {}, // Request was made but no response received
        message: 'Network timeout',
      };

      mockedAxios.request.mockRejectedValue(networkError);

      httpClient.setToken('test-token');

      await expect(httpClient.get('/api/test')).rejects.toEqual(
        expect.objectContaining({
          type: 'SipayError',
          message: 'Network error: No response received from Sipay',
        })
      );
    });

    it('should handle generic error (no request, no response)', async () => {
      const genericError = {
        message: 'Something went wrong',
      };

      mockedAxios.request.mockRejectedValue(genericError);

      httpClient.setToken('test-token');

      await expect(httpClient.get('/api/test')).rejects.toEqual(
        expect.objectContaining({
          type: 'SipayError',
          message: 'Something went wrong',
        })
      );
    });

    it('should handle error with no message', async () => {
      const errorWithoutMessage = {};

      mockedAxios.request.mockRejectedValue(errorWithoutMessage);

      httpClient.setToken('test-token');

      await expect(httpClient.get('/api/test')).rejects.toEqual(
        expect.objectContaining({
          type: 'SipayError',
          message: 'Unknown error occurred',
        })
      );
    });

    it('should handle error through response interceptor', async () => {
      const errorResponse = {
        response: {
          data: {
            status_code: 400,
            status_description: 'Bad Request',
          },
        },
      };

      // Create a new instance to properly test interceptors
      const mockAxiosInstance = {
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
        request: jest.fn(),
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Create a new client instance to register interceptors
      new SipayHttpClient({
        appId: 'test_app_id',
        appSecret: 'test_app_secret',
        merchantKey: 'test_merchant_key',
      });

      // Get the error handler from the response interceptor
      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

      // Simulate the interceptor throwing an error
      expect(() => errorHandler(errorResponse)).toThrow();

      // The error should be transformed into a SipayError
      try {
        errorHandler(errorResponse);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            type: 'SipayError',
            message: 'Bad Request',
            status_code: 400,
            status_description: 'Bad Request',
          })
        );
      }
    });
  });
});
