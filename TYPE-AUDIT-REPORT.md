# Sipay SDK Type Audit Report

## Overview

After analyzing the OpenAPI specification (`sipayEn.yaml`) and Postman collection (`CCPAYMENT API.postman_collection.json`), I've identified several discrepancies between the expected response types and our current SDK implementation.

## Key Findings

### 1. 2D Payment Response (`/api/paySmart2D`)

**OpenAPI Spec Response Structure:**

```yaml
status_code: 100
status_description: "Payment process successful"
data:
  sipay_status: 1 (integer)
  order_no: "VP17349639333373384"
  order_id: "VP17349639333373384"
  invoice_id: "FAG0VLKTJPWH5NT-1734963933"
  sipay_payment_method: 1 (integer)
  credit_card_no: "540667****5403"
  transaction_type: "Auth"
  payment_status: 1 (integer)
  payment_method: 1 (integer)
  error_code: 100 (integer)
  error: "" (string)
  auth_code: "P06931"
  merchant_commission: 16 (integer)
  user_commission: 0 (integer)
  merchant_commission_percentage: 2 (integer)
  merchant_commission_fixed: 0 (integer)
  installment: 1 (integer)
  amount: 800 (integer)
  payment_reason_code: ""
  payment_reason_code_detail: ""
  hash_key: "760f789805633680:142c:j1SaI6u6t__hcZZmQqzpSpwcjx6zdUch3U__iSkgQOJAmaoRXwWZPOvQAgvh0bCtkQm6f7nqK__iX9mYt3ok4lXmg=="
  original_bank_error_code: ""
  original_bank_error_description: ""
```

**Current SDK Issues:**

- ✅ Our `Payment2DData` interface mostly matches the spec
- ❌ Commission fields should be `number` not `string` - already correct in our SDK
- ❌ Amount should be `number` not `string` - already correct in our SDK
- ✅ Our response wrapper `SipayApiResponse<Payment2DData>` is correct

### 2. 3D Payment Response (`/api/paySmart3D`)

**OpenAPI Spec Response Structure:**
The 3D payment returns an HTML form for redirection, not a JSON response. However, after 3D authentication, the callback contains:

```yaml
sipay_status: string
order_no: string
order_id: string
invoice_id: string
status_code: integer (100)
status_description: 'Payment Successfully Completed'
sipay_payment_method: integer (1)
credit_card_no: '540667****5403'
transaction_type: 'Auth'
payment_status: integer (1)
payment_method: integer (1)
error_code: integer (100)
error: 'Payment Successfully Completed'
auth_code: 'P09424'
installment: integer (1)
amount: integer (800)
payment_reason_code: ''
payment_reason_code_detail: ''
status: 'Completed'
hash_key: '4e431932f5e8b292:e470:...'
original_bank_error_code: ''
original_bank_error_description: ''
```

**Current SDK Issues:**

- ❌ Our `Payment3DResponse` has all string fields, but many should be `number`
- ❌ The spec shows mixed types: some integers, some strings
- ❌ We're missing the `status` field

### 3. Check Status Response (`/api/checkstatus`)

**OpenAPI Spec Response Structure:**

```yaml
status_code: 100
status_description: "An order has been taken place for this invoice id: JB7HHTAGWWINPRT-1734963488"
transaction_status: "Completed"
order_id: "VP17349634893866298"
transaction_id: "IsejQ-qihk-TC10-18309-231224"
message: "An order has been taken place for this invoice id: JB7HHTAGWWINPRT-1734963488"
reason: ""
bank_status_code: ""
bank_status_description: ""
invoice_id: "JB7HHTAGWWINPRT-1734963488"
total_refunded_amount: 0 (integer)
product_price: "800" (string)
transaction_amount: 800 (integer)
ref_number: ""
transaction_type: "Auth"
original_bank_error_code: ""
original_bank_error_description: ""
cc_no: "540667****5403"
payment_reason_code: ""
payment_reason_code_detail: ""
merchant_commission: "16.00" (string)
user_commission: "0.00" (string)
settlement_date: "2024-12-24"
installment: 1 (integer)
card_type: "CREDIT CARD"
recurring_id?: 303 (integer)
recurring_plan_code?: 1601492241FdsraX
next_action_date?: '2021-05-30 03:10:00'
recurring_status?: "Active"
```

**Current SDK Issues:**

- ❌ Our `PaymentStatusResponse` uses mostly strings, but spec shows mixed types
- ❌ We're missing several fields like `transaction_id`, `message`, `reason`, etc.
- ❌ Commission fields should be strings with decimal format like "16.00"

## Recommended Actions

### 1. Update Payment2DData Interface ✅ Already Correct

Our current implementation matches the spec well.

### 2. Update Payment3DResponse Interface

Should align with the post-authentication callback format:

```typescript
export interface Payment3DResponse {
  sipay_status: number; // Changed from string
  order_no: string;
  order_id: string;
  invoice_id: string;
  status_code: number; // Changed from string
  status_description: string;
  sipay_payment_method: number; // Changed from string
  credit_card_no: string;
  transaction_type: string;
  payment_status: number; // Changed from string
  payment_method: number; // Changed from string
  error_code: number; // Changed from string
  error: string;
  auth_code: string;
  merchant_commission?: number; // Changed from string
  user_commission?: number; // Changed from string
  merchant_commission_percentage?: number; // Changed from string
  merchant_commission_fixed?: number; // Changed from string
  installment: number; // Changed from string
  amount: number; // Changed from string
  payment_reason_code?: string;
  payment_reason_code_detail?: string;
  status: string; // Added missing field
  hash_key: string;
  md_status?: string;
  original_bank_error_code?: string;
  original_bank_error_description?: string;
}
```

### 3. Update PaymentStatusResponse Interface

Should include all fields from the spec:

```typescript
export interface PaymentStatusResponse {
  status_code: number;
  status_description: string;
  transaction_status: string;
  order_id: string;
  transaction_id: string;
  message: string;
  reason: string;
  bank_status_code: string;
  bank_status_description: string;
  invoice_id: string;
  total_refunded_amount: number;
  product_price: string;
  transaction_amount: number;
  ref_number: string;
  transaction_type: string;
  original_bank_error_code: string;
  original_bank_error_description: string;
  cc_no: string;
  payment_reason_code: string;
  payment_reason_code_detail: string;
  merchant_commission: string; // Decimal string format
  user_commission: string; // Decimal string format
  settlement_date: string;
  installment: number;
  card_type: string;
  // Recurring payment fields (optional)
  recurring_id?: number;
  recurring_plan_code?: string;
  next_action_date?: string;
  recurring_status?: string;
}
```

## Status

- ✅ **2D Payment Response**: Already matches spec well
- ❌ **3D Payment Response**: Needs type corrections
- ❌ **Payment Status Response**: Missing fields and incorrect types
- ✅ **Basic API Response Wrapper**: Correct structure

## Next Steps

1. Update the Payment3DResponse interface with correct types
2. Expand PaymentStatusResponse to include all spec fields
3. Update method return types accordingly
4. Test with actual API responses to validate changes
