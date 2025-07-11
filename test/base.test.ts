import { SipayResource } from '../src/resources/base';
import { SipayHttpClient } from '../src/utils/http-client';
import { RequestOptions } from '../src/types';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

// Create a test resource to test the protected methods
class TestResource extends SipayResource {
  async testRequest<T = any>(
    method: 'GET' | 'POST',
    url: string,
    data?: any,
    options?: RequestOptions
  ) {
    return this.request<T>(method, url, data, options);
  }

  async testGet<T = any>(url: string, params?: any, options?: RequestOptions) {
    return this.get<T>(url, params, options);
  }

  async testPost<T = any>(url: string, data?: any, options?: RequestOptions) {
    return this.post<T>(url, data, options);
  }

  async testPostForm<T = any>(url: string, data?: any, options?: RequestOptions) {
    return this.postForm<T>(url, data, options);
  }
}

describe('SipayResource (Base)', () => {
  let testResource: TestResource;
  let mockHttpClient: jest.Mocked<SipayHttpClient>;

  beforeEach(() => {
    mockHttpClient = new SipayHttpClient({
      appId: 'test_app_id',
      appSecret: 'test_app_secret',
      merchantKey: 'test_merchant_key',
    }) as jest.Mocked<SipayHttpClient>;

    // Mock HTTP client methods
    mockHttpClient.request = jest.fn();
    mockHttpClient.get = jest.fn();
    mockHttpClient.post = jest.fn();
    mockHttpClient.postForm = jest.fn();

    testResource = new TestResource(mockHttpClient);
  });

  describe('protected request method', () => {
    it('should call client.request with correct parameters', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { success: true },
      };
      mockHttpClient.request.mockResolvedValue(mockResponse);

      const result = await testResource.testRequest(
        'POST',
        '/api/test',
        { key: 'value' },
        { timeout: 5000 }
      );

      expect(mockHttpClient.request).toHaveBeenCalledWith(
        'POST',
        '/api/test',
        { key: 'value' },
        { timeout: 5000 }
      );
      expect(result).toBe(mockResponse);
    });

    it('should call client.request without data and options', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { success: true },
      };
      mockHttpClient.request.mockResolvedValue(mockResponse);

      const result = await testResource.testRequest('GET', '/api/test');

      expect(mockHttpClient.request).toHaveBeenCalledWith('GET', '/api/test', undefined, undefined);
      expect(result).toBe(mockResponse);
    });
  });

  describe('protected get method', () => {
    it('should call client.get with correct parameters', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { success: true },
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await testResource.testGet('/api/test', { param: 'value' }, { timeout: 5000 });

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/api/test',
        { param: 'value' },
        { timeout: 5000 }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('protected post method', () => {
    it('should call client.post with correct parameters', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { success: true },
      };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await testResource.testPost('/api/test', { key: 'value' }, { timeout: 5000 });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/test',
        { key: 'value' },
        { timeout: 5000 }
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('protected postForm method', () => {
    it('should call client.postForm with correct parameters', async () => {
      const mockResponse = {
        status_code: 100,
        status_description: 'Success',
        data: { success: true },
      };
      mockHttpClient.postForm.mockResolvedValue(mockResponse);

      const result = await testResource.testPostForm(
        '/api/test',
        { key: 'value' },
        { timeout: 5000 }
      );

      expect(mockHttpClient.postForm).toHaveBeenCalledWith(
        '/api/test',
        { key: 'value' },
        { timeout: 5000 }
      );
      expect(result).toBe(mockResponse);
    });
  });
});
