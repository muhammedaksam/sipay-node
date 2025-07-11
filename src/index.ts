import { SipayHttpClient } from './utils/http-client';
import { SipayConfig } from './types';
import { Payments } from './resources/payments';
import { Recurring } from './resources/recurring';
import { BrandedSolution } from './resources/branded-solution';
import { Commissions } from './resources/commissions';

export class Sipay {
  private client: SipayHttpClient;

  public payments: Payments;
  public recurring: Recurring;
  public brandedSolution: BrandedSolution;
  public commissions: Commissions;

  constructor(config: SipayConfig) {
    this.client = new SipayHttpClient(config);

    // Initialize resources
    this.payments = new Payments(this.client);
    this.recurring = new Recurring(this.client);
    this.brandedSolution = new BrandedSolution(this.client);
    this.commissions = new Commissions(this.client);
  }

  /**
   * Manually authenticate with Sipay API
   * Note: This is automatically called when needed, but can be called manually
   */
  async authenticate(): Promise<void> {
    return this.client.authenticate();
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | undefined {
    return this.client.getToken();
  }

  /**
   * Set a custom authentication token
   */
  setToken(token: string): void {
    this.client.setToken(token);
  }
}

// Default export
export default Sipay;

// Named exports
export * from './types';
export { SipayHttpClient } from './utils/http-client';
export { SipayResource } from './resources/base';
export { Payments } from './resources/payments';
export { Recurring } from './resources/recurring';
export { BrandedSolution } from './resources/branded-solution';
export { Commissions } from './resources/commissions';
