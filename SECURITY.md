# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x | ✅ Yes |

---

## Reporting a Vulnerability

If you discover a security vulnerability in FuseMeld, **please do not open a public GitHub issue**.

Instead, report it by emailing the maintainer directly or opening a [GitHub Security Advisory](../../security/advisories/new) (private by default).

Include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- A suggested fix if you have one

You will receive a response within 72 hours. If the vulnerability is confirmed, a patch will be released as soon as possible and you will be credited in the changelog.

---

## Scope

The following are in scope for security reports:

- Authentication bypass or JWT mishandling
- Unauthorized access to another user's saved repos or analysis data
- Server-side injection via repo URL or query parameters
- Exposure of environment variables or API keys

The following are out of scope:

- Rate limiting on public endpoints (by design for MVP)
- Issues in third-party dependencies (report upstream)
- Theoretical vulnerabilities with no practical exploit