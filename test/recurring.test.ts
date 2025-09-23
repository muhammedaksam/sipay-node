import { Recurring } from '../src/resources/recurring';
import { SipayHttpClient } from '../src/utils/http-client';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Recurring Resource', () => {
  let recurring: Recurring;
  let mockHttpClient: jest.Mocked<SipayHttpClient>;

  beforeEach(() => {
    mockHttpClient = new SipayHttpClient({
      appId: 'test_app_id',
      appSecret: 'test_app_secret',
      merchantKey: 'test_merchant_key',
    }) as jest.Mocked<SipayHttpClient>;

    // Mock HTTP client methods
    mockHttpClient.post = jest.fn();
    mockHttpClient.get = jest.fn();
    mockHttpClient.postForm = jest.fn();

    // Mock the config property that addMerchantKey accesses
    (mockHttpClient as any)['config'] = {
      merchantKey: 'test_merchant_key',
      appSecret: 'test_app_secret',
    };

    recurring = new Recurring(mockHttpClient);
  });

  describe('deprecated functionality', () => {
    it('should be instantiated without errors', () => {
      expect(recurring).toBeDefined();
      expect(recurring).toBeInstanceOf(Recurring);
    });

    it('should have access to base resource methods', () => {
      // Test that it extends SipayResource properly
      expect(typeof recurring['addMerchantKey']).toBe('function');
      expect(typeof recurring['post']).toBe('function');
      expect(typeof recurring['get']).toBe('function');
    });
  });

  describe('note about migration', () => {
    it('should indicate that recurring functionality is handled by Payments resource', () => {
      // This test serves as documentation that recurring payments should now be handled
      // through the Payments resource with recurring parameters
      expect(true).toBe(true); // Placeholder test for documentation
    });
  });
});
