import { SipayResource } from './base';

// Note: Recurring payment functionality is handled through the regular payment endpoints
// by including recurring parameters (recurring_payment_number, recurring_payment_cycle,
// recurring_payment_interval, recurring_web_hook_key) in the payment request.
// See the Payment2DRequest and Payment3DRequest interfaces for these parameters.

export class Recurring extends SipayResource {
  // This class is maintained for backward compatibility but recurring functionality
  // is now handled through the Payments resource with recurring parameters.
  // Consider this class deprecated - use Payments.pay2D() or Payments.pay3D()
  // with recurring parameters instead.
}
