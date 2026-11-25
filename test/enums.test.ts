import {
  SipayAppLang,
  SipayCardProgram,
  SipayCashoutType,
  SipayCommissionBy,
  SipayConfirmStatus,
  SipayCurrency,
  SipayIntegrationType,
  SipayMdStatus,
  SipayOrderType,
  SipayPaymentCompletedBy,
  SipayPaymentCompletionStatus,
  SipayPaymentMethod,
  SipayPaymentStatus,
  SipayRecurringCycle,
  SipayRecurringStatus,
  SipayResponseMethod,
  SipayTransactionStatus,
  SipayTransactionType,
  SipayWebhookStatus,
  SipayWebhookTransactionType,
} from '../src/index';

describe('Sipay Enums', () => {
  it('should expose opaque code enums with expected API values', () => {
    expect(SipayPaymentMethod).toEqual({
      CREDIT_CARD: '1',
      MOBILE: '2',
      WALLET: '3',
    });

    expect(SipayPaymentStatus).toEqual({
      FAILED: '0',
      SUCCESSFUL: '1',
    });

    expect(SipayTransactionType).toEqual({
      AUTH: 'Auth',
      PRE_AUTH: 'PreAuth',
    });

    expect(SipayWebhookTransactionType).toEqual({
      AUTH: 'Auth',
      PRE_AUTHORIZATION: 'Pre-Authorization',
    });

    expect(SipayIntegrationType).toEqual({
      NON_SECURE_ONLY: 0,
      NON_SECURE_OR_3D: 1,
      THREE_D_ONLY: 2,
      BRANDED: 4,
    });

    expect(SipayConfirmStatus).toEqual({
      CONFIRMED: 1,
      CANCELED: 2,
    });

    expect(SipayOrderType).toEqual({
      NORMAL: 0,
      RECURRING: 1,
    });

    expect(SipayRecurringCycle).toEqual({
      DAY: 'D',
      MONTH: 'M',
      YEAR: 'Y',
    });

    expect(SipayRecurringStatus).toEqual({
      ACTIVE: 'ACTIVE',
      PASSIVE: 'PASSIVE',
    });

    expect(SipayCashoutType).toEqual({
      TO_BANK: 1,
    });

    expect(SipayMdStatus).toEqual({
      AUTHENTICATION_FAILED: '0',
      FULL_AUTHENTICATION: '1',
    });

    expect(SipayWebhookStatus).toEqual({
      COMPLETED: 'Completed',
      FAIL: 'Fail',
    });
  });

  it('should expose string option enums with expected API values', () => {
    expect(SipayTransactionStatus).toEqual({
      COMPLETED: 'Completed',
      PENDING: 'Pending',
      FAILED: 'Failed',
      UNKNOWN: 'Unknown',
      PRE_AUTHORIZATION: 'Pre-Authorization',
      PRE_AUTH_APPROVED: 'Pre-Auth Approved',
      REFUND: 'refund',
      PARTIALLY_REFUND: 'partially_refund',
    });

    expect(SipayCurrency).toEqual({
      TRY: 'TRY',
      USD: 'USD',
      EUR: 'EUR',
      GBP: 'GBP',
    });

    expect(SipayAppLang).toEqual({
      EN: 'en',
      TR: 'tr',
    });

    expect(SipayCommissionBy).toEqual({
      MERCHANT: 'merchant',
      USER: 'user',
    });

    expect(SipayPaymentCompletedBy).toEqual({
      MERCHANT: 'merchant',
      APP: 'app',
    });

    expect(SipayPaymentCompletionStatus).toEqual({
      COMPLETE: 'complete',
      CANCEL: 'cancel',
    });

    expect(SipayResponseMethod).toEqual({
      GET: 'GET',
      POST: 'POST',
    });

    expect(SipayCardProgram).toEqual({
      WORLD: 'WORLD',
      BONUS: 'BONUS',
      MAXIMUM: 'MAXIMUM',
      BANKKART_COMBO: 'BANKKART_COMBO',
      PARAF: 'PARAF',
      AXESS: 'AXESS',
      ADVANT: 'ADVANT',
      CARD_FNS: 'CARD_FNS',
    });
  });

  it('should support both enum constants and raw literals interchangeably', () => {
    const methodFromEnum: SipayPaymentMethod = SipayPaymentMethod.CREDIT_CARD;
    const methodFromLiteral: SipayPaymentMethod = '1';
    expect(methodFromEnum).toBe(methodFromLiteral);

    const statusFromEnum: SipayPaymentStatus = SipayPaymentStatus.SUCCESSFUL;
    const statusFromLiteral: SipayPaymentStatus = '1';
    expect(statusFromEnum).toBe(statusFromLiteral);

    const confirmFromEnum: SipayConfirmStatus = SipayConfirmStatus.CONFIRMED;
    const confirmFromLiteral: SipayConfirmStatus = 1;
    expect(confirmFromEnum).toBe(confirmFromLiteral);

    const langFromEnum: SipayAppLang = SipayAppLang.TR;
    const langFromLiteral: SipayAppLang = 'tr';
    expect(langFromEnum).toBe(langFromLiteral);
  });
});
