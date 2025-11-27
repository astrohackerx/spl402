# Contributing to SPL-402

Thank you for your interest in contributing to SPL-402! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Code samples

**Security Vulnerabilities**: Report to security@spl402.org instead of creating public issues.

### Suggesting Features

1. Check existing feature requests
2. Use the feature request template
3. Clearly describe:
   - The problem it solves
   - Your proposed solution
   - Use cases
   - Implementation considerations

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/astrohackerx/spl402.git
   cd spl402
   npm install
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation
   - Ensure all tests pass

4. **Test Your Changes**
   ```bash
   npm run build
   npm run test
   npm run lint
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   **Commit Message Format**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `test:` Test additions or changes
   - `refactor:` Code refactoring
   - `perf:` Performance improvements
   - `chore:` Maintenance tasks

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## Development Setup

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Git

### Installation

```bash
npm install
```

### Development Workflow

```bash
# Build the project
npm run build

# Run all tests
npm run test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:security

# Run legacy tests
npm run test:legacy

# Type checking
npm run lint
```

### Project Structure

```
spl402/
├── src/               # Source code
│   ├── client.ts      # Client implementation
│   ├── server.ts      # Server implementation
│   ├── verify.ts      # Payment verification
│   ├── attestation.ts # SAS integration
│   ├── react.ts       # React hooks
│   ├── types.ts       # TypeScript types
│   └── utils.ts       # Utilities
├── tests/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── security/      # Security tests
├── examples/          # Example code
└── docs/              # Documentation
```

## Testing Guidelines

### Unit Tests

- Test individual functions/methods
- Mock external dependencies
- Aim for 80%+ code coverage
- Location: `tests/unit/`

### Integration Tests

- Test complete workflows
- Use Solana devnet for testing
- Test with real RPC connections
- Location: `tests/integration/`

### Security Tests

- Test attack scenarios
- Verify security measures
- Test edge cases
- Location: `tests/security/`

### Writing Tests

```typescript
import { describe, it, expect } from '@jest/globals';

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = yourFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Code Style

- Use TypeScript
- Follow existing formatting
- Use meaningful variable names
- Add comments for complex logic
- Export types and interfaces

### TypeScript Guidelines

```typescript
// Use explicit types
function processPayment(amount: number): boolean {
  return amount > 0;
}

// Export interfaces
export interface PaymentConfig {
  amount: number;
  recipient: string;
}

// Use async/await
async function verifyPayment(): Promise<boolean> {
  const result = await checkOnChain();
  return result.valid;
}
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update examples when adding features
- Keep SECURITY.md current

### JSDoc Example

```typescript
/**
 * Verifies a payment on the Solana blockchain
 *
 * @param payment - The payment payload to verify
 * @param expectedAmount - The expected payment amount
 * @param recipient - The recipient's wallet address
 * @returns Promise resolving to verification result
 *
 * @example
 * ```typescript
 * const result = await verifyPayment(payment, 0.001, recipientAddress);
 * if (result.valid) {
 *   // Payment verified
 * }
 * ```
 */
export async function verifyPayment(
  payment: SPL402PaymentPayload,
  expectedAmount: number,
  recipient: string
): Promise<VerifyPaymentResponse> {
  // Implementation
}
```

## Security Guidelines

1. **Never commit secrets** - No private keys, API keys, or sensitive data
2. **Input validation** - Always validate user inputs
3. **Error handling** - Don't leak sensitive information in errors
4. **Dependencies** - Keep dependencies updated
5. **Code review** - Security-sensitive changes require thorough review

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create git tag: `git tag v2.0.6`
4. Push tag: `git push origin v2.0.6`
5. GitHub Actions automatically publishes to NPM

## Getting Help

- **Documentation**: https://spl402.org
- **Issues**: https://github.com/astrohackerx/spl402/issues
- **Discussions**: https://github.com/astrohackerx/spl402/discussions
- **Discord**: [Coming Soon]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be acknowledged in:
- README.md Contributors section
- GitHub contributors page
- Release notes

Thank you for contributing to SPL-402! 🚀
