# Sipay Node.js SDK Development Guidelines

This is a Node.js TypeScript SDK for the Sipay payment gateway. When working on this project, please follow these guidelines:

## Code Style and Patterns

- Follow the established pattern similar to Stripe's Node.js SDK
- Use TypeScript with strict type checking
- Implement proper error handling with SipayError types
- Follow the resource-based architecture with base classes
- Use async/await for all asynchronous operations

## API Integration

- All API endpoints should be properly typed with interfaces
- Base URL: `https://provisioning.sipay.com.tr/ccpayment`
- Authentication is handled automatically via token endpoint
- All requests require merchant_key except authentication
- Support both JSON and form-data content types where needed

## Resource Structure

- Each API category should have its own resource class extending SipayResource
- Resources: Payments, Recurring, BrandedSolution, Commissions
- Include proper JSDoc comments for all public methods
- Validate input parameters where possible

## Testing

- Write comprehensive tests for all public methods
- Mock HTTP requests using Jest
- Test both success and error scenarios
- Include integration tests for complete workflows

## Security

- Never log sensitive payment information (use masking utilities)
- Validate credit card numbers using Luhn algorithm
- Support hash key generation for payment verification
- Handle PCI DSS requirements appropriately

## Key Endpoints

- `/api/token` - Authentication
- `/api/paySmart2D` - 2D payments
- `/api/paySmart3D` - 3D Secure payments
- `/api/getpos` - POS information
- `/api/checkstatus` - Payment status
- `/api/refund` - Refunds
- `/api/QueryRecurring` - Recurring queries
- `/purchase/link` - Branded solutions

## Error Handling

- Use SipayError for API-related errors
- Status code 100 indicates success
- Provide meaningful error messages
- Support retry logic for network errors

## Documentation

- Maintain comprehensive README.md
- Include practical examples for all features
- Document all TypeScript interfaces
- Provide migration guides when needed
