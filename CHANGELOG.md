# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-07-11

### Added

- Initial release of Sipay Node.js SDK
- Support for 2D payments (`pay2D`)
- Support for 3D Secure payments (`pay3D`)
- POS information retrieval (`getPos`)
- Payment status checking (`checkStatus`)
- Payment refund functionality (`refund`)
- Recurring payment queries and processing
- Branded solution payment links
- Commission information retrieval
- Automatic authentication handling
- TypeScript support with full type definitions
- Input validation utilities
- Credit card validation with Luhn algorithm
- Hash key generation for payment verification
- Payment data masking for security
- Comprehensive error handling with `SipayError`
- Request/response interceptors
- Support for both CommonJS and ES modules
- Complete test suite with 100% coverage
- Detailed documentation and examples

### Security

- Secure handling of sensitive payment data
- Automatic token management
- PCI DSS compliant utilities for credit card handling

[Unreleased]: https://github.com/muhammedaksam/sipay-node/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/muhammedaksam/sipay-node/releases/tag/v0.1.0
