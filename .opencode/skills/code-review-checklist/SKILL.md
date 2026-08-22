---
name: code-review-checklist
description: Use when reviewing pull requests or code changes — covers security, performance, maintainability, and correctness
---
# Code Review Checklist

## Security
- [ ] No secrets or API keys in code
- [ ] Input validation on all user-facing endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection on state-changing operations
- [ ] Authentication/authorization on sensitive endpoints

## Performance
- [ ] No N+1 queries
- [ ] Database indexes for common queries
- [ ] Caching strategy for expensive operations
- [ ] Pagination on list endpoints
- [ ] No unnecessary data fetching

## Maintainability
- [ ] Clear function/variable names
- [ ] No magic numbers — use constants
- [ ] Error handling with meaningful messages
- [ ] No commented-out code
- [ ] Test coverage for new code

## Correctness
- [ ] Edge cases handled (null, empty, boundary)
- [ ] Idempotent operations where needed
- [ ] Rollback on failure for multi-step operations
- [ ] Type safety (no `any` in TypeScript)
