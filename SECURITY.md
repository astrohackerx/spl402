# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@spl402.org**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of vulnerability (e.g., replay attack, signature forgery, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

## Security Update Process

1. **Report Received**: We acknowledge your report within 48 hours
2. **Triage**: We assess the vulnerability within 5 business days
3. **Fix Development**: We work on a patch (timeline depends on severity)
4. **Testing**: Security fix is tested thoroughly
5. **Release**: Patch is released with security advisory
6. **Disclosure**: After 90 days or once fix is widely deployed, we publicly disclose

## Security Best Practices for Integrators

### Server-Side Security

1. **Always Verify Server-Side**: Never trust client-provided payment proofs without verification
2. **Use HTTPS Only**: Always use HTTPS in production to prevent MITM attacks
3. **Custom RPC Endpoints**: Use private RPC endpoints to avoid rate limits and ensure reliability
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Database-Backed Signatures**: For production, use persistent signature storage (not in-memory cache)

### Payment Verification

1. **Amount Validation**: Always verify exact payment amounts on-chain
2. **Recipient Validation**: Verify payments went to the correct wallet
3. **Network Validation**: Ensure transactions are on the expected network
4. **Timestamp Checks**: Validate payment timestamps are within acceptable range
5. **Replay Prevention**: Never accept the same signature twice

### Wallet Security

1. **Private Key Safety**: Never expose private keys in client code
2. **Wallet Validation**: Validate wallet addresses before processing
3. **User Confirmation**: Always require user confirmation for transactions
4. **Error Handling**: Implement proper error handling without leaking sensitive data

### Infrastructure Security

1. **Environment Variables**: Store sensitive config in environment variables
2. **Secret Management**: Use proper secret management (not hardcoded)
3. **Logging**: Never log sensitive data (private keys, full signatures)
4. **Monitoring**: Monitor for unusual patterns and failed verifications
5. **Updates**: Keep dependencies up-to-date

## Known Security Considerations

### In-Memory Signature Cache

The default in-memory signature cache is suitable for testing and small deployments but has limitations:

- **Not persistent**: Signatures are lost on server restart
- **Not distributed**: Won't work across multiple server instances
- **Limited size**: Cache has 10,000 entry limit

**Recommendation**: For production, implement database-backed signature storage using the provided persistence layer.

### RPC Endpoint Trust

The SDK relies on Solana RPC endpoints for verification. Compromised or malicious RPC endpoints could:

- Return false transaction data
- Cause verification failures
- Expose transaction patterns

**Recommendation**: Use trusted RPC providers (Helius, QuickNode, Alchemy) and consider running your own validator.

### Payment Timing Window

The 5-minute payment timeout window is a security vs. usability trade-off:

- **Too short**: Users might not complete payments in time
- **Too long**: Increased replay attack window (if cache fails)

**Recommendation**: Monitor payment completion times and adjust if needed, but keep under 10 minutes.

## Security Audit Status

- **Internal Security Review**: Completed (v2.0)
- **External Security Audit**: Pending
- **Penetration Testing**: Pending
- **Bug Bounty Program**: Coming Soon

## Threat Model

### In Scope

- Payment verification bypass
- Replay attacks
- Amount manipulation
- Recipient spoofing
- Timestamp manipulation
- Network confusion attacks
- Signature forgery

### Out of Scope

- Solana blockchain vulnerabilities
- RPC endpoint vulnerabilities
- Wallet software vulnerabilities
- DDoS attacks
- Social engineering

## Security Contact

- **Email**: security@spl402.org
- **Response Time**: 48 hours for acknowledgment, 5 days for triage

## Acknowledgments

We appreciate security researchers who help keep SPL-402 safe. Public acknowledgment (with permission) will be provided for valid security reports.

## License

This security policy is licensed under CC BY 4.0.

