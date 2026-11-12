# Security policy

Core Breach is a static browser game. It has no server, no accounts and no network calls after loading, and it stores one number (your best score) in your browser.

## Reporting a vulnerability

Please don't open a public issue for a security problem. Use GitHub's private reporting instead:

**[Report a vulnerability](https://github.com/Zubair-hussain/Core-Breach/security/advisories/new)**

You can expect an answer within a few days. Include what you found, how to reproduce it, and which browser you used.

## What's already in place

- A strict Content Security Policy on every response (`netlify.toml`): scripts, styles and images load only from the game's own origin
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, a restrictive `Permissions-Policy`, and a strict referrer policy
- No inline scripts, no `innerHTML` with dynamic data, no third-party requests
- Dependabot keeps the dev tools and GitHub Actions up to date
