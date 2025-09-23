import { Sipay } from '../src/index';
import { SipayConfig } from '../src/types';

// Mock the HTTP client
jest.mock('../src/utils/http-client');

describe('Sipay SDK', () => {
  let sipay: Sipay;
  let config: SipayConfig;

  beforeEach(() => {
    config = {
      appId: 'test_app_id',
      appSecret: 'test_app_secret',
      merchantKey: 'test_merchant_key',
    };

    sipay = new Sipay(config);
  });

  describe('constructor', () => {
    it('should create SDK instance with config', () => {
      expect(sipay).toBeInstanceOf(Sipay);
      expect(sipay.payments).toBeDefined();
      expect(sipay.recurring).toBeDefined();
      expect(sipay.brandedSolution).toBeDefined();
      expect(sipay.commissions).toBeDefined();
    });

    it('should use default config values', () => {
      const minimalConfig = {
        appId: 'test_app_id',
        appSecret: 'test_app_secret',
        merchantKey: 'test_merchant_key',
      };

      const sipayWithDefaults = new Sipay(minimalConfig);
      expect(sipayWithDefaults).toBeInstanceOf(Sipay);
    });
  });

  describe('resource initialization', () => {
    it('should initialize all resource classes', () => {
      expect(sipay.payments).toBeDefined();
      expect(sipay.recurring).toBeDefined();
      expect(sipay.brandedSolution).toBeDefined();
      expect(sipay.commissions).toBeDefined();

      // Verify resources have the expected methods
      expect(typeof sipay.payments.pay2D).toBe('function');
      expect(typeof sipay.payments.pay3D).toBe('function');
      expect(typeof sipay.payments.getPos).toBe('function');
      expect(typeof sipay.payments.checkStatus).toBe('function');
      expect(typeof sipay.payments.refund).toBe('function');

      // Note: recurring functionality is now handled through payments resource
      // with recurring parameters, not separate methods
      expect(sipay.recurring).toBeDefined();

      expect(typeof sipay.brandedSolution.createPaymentLink).toBe('function');
      // Note: branded solution status is checked via payments.checkStatus()

      expect(typeof sipay.commissions.getCommissions).toBe('function');
    });
  });

  describe('configuration', () => {
    it('should handle custom timeout', () => {
      const configWithTimeout = {
        ...config,
        timeout: 60000,
      };

      const sipayWithTimeout = new Sipay(configWithTimeout);
      expect(sipayWithTimeout).toBeInstanceOf(Sipay);
    });

    it('should handle custom base URL', () => {
      const configWithBaseUrl = {
        ...config,
        baseUrl: 'https://custom.sipay.com',
      };

      const sipayWithCustomUrl = new Sipay(configWithBaseUrl);
      expect(sipayWithCustomUrl).toBeInstanceOf(Sipay);
    });
  });
});
