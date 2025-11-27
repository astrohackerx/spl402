# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.6] - 2025-11-27

### Added

#### Testing Infrastructure
- Comprehensive test suite with 245+ test cases
- Unit tests for utils, server, and verification logic
- Integration tests with Solana devnet
- Security tests for replay attacks and validation bypasses
- Jest configuration with 80%+ coverage targets
- Separate test commands: `test:unit`, `test:integration`, `test:security`

#### CI/CD Automation
- GitHub Actions CI pipeline with multi-version Node.js testing (18.x, 20.x)
- Automated security scanning with npm audit
- CodeQL static analysis for vulnerability detection
- TypeScript linting automation
- Build verification on every PR
- Automated release workflow with NPM publishing

#### Supply Chain Security
- Dependabot configuration for automated dependency updates
- Weekly security updates with automated testing
- Protection for major version changes on critical dependencies
- Automated vulnerability scanning in CI pipeline

#### Documentation
- SECURITY.md with vulnerability disclosure policy and best practices
- CONTRIBUTING.md with development guidelines
- PRODUCTION_READINESS.md with deployment checklist
- GitHub issue templates for bug reports and feature requests
- Pull request template with security considerations
- Comprehensive security threat model

#### Developer Experience
- New npm scripts for different test suites
- Improved build verification workflow
- Code coverage reporting
- Better error messages and validation

### Changed
- Updated test script to run comprehensive test suite
- Enhanced package.json with Jest and testing dependencies
- Improved TypeScript configuration for testing

### Security
- Implemented automated security scanning in CI/CD
- Added Dependabot for dependency vulnerability tracking
- Documented security best practices for integrators
- Added security policy with 48-hour response time commitment

---

## [2.0.5] - Previous Release

### Features
- Core SPL-402 implementation
- Client and server SDK
- React hooks integration
- SAS attestation support
- Express and Fetch middleware
- Payment verification
- Token transfer support
- Standard routes (/health, /.well-known/spl402.json)

---

## Release Notes for 2.0.6

This release focuses on **production readiness** and **supply chain security**:

### For Users
- Increased confidence with 245+ automated tests
- Better security with automated vulnerability scanning
- Clear security disclosure process
- Professional development workflow

### For Contributors
- Clear contribution guidelines
- Automated testing on PRs
- Security scanning for all changes
- Standardized issue and PR templates

### For Production Deployments
- Comprehensive security documentation
- Production readiness checklist
- Best practices guide
- Threat model documentation

### Breaking Changes
None. This is a backwards-compatible release focused on infrastructure and testing.

### Upgrade Guide
No changes required. Simply update to 2.0.6:

```bash
npm install spl402@2.0.6
```

### What's Next
- Phase 4: Production case studies and enhanced documentation
- Community examples and tutorials
- Interactive playground

---

## Links
- [GitHub Repository](https://github.com/astrohackerx/spl402)
- [NPM Package](https://www.npmjs.com/package/spl402)
- [Documentation](https://spl402.org)
- [Security Policy](https://github.com/astrohackerx/spl402/blob/main/SECURITY.md)
