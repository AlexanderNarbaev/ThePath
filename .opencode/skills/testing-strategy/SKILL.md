---
name: testing-strategy
description: Use when choosing test approach — unit, integration, e2e, property-based, snapshot testing guide
---
# Testing Strategy

## Test Pyramid
1. **Unit tests** — individual functions/classes, fast, isolated
2. **Integration tests** — component interactions, database, APIs
3. **E2E tests** — full user flows, browser automation

## When to use each
- **Unit**: pure logic, parsing, validation, algorithms
- **Integration**: database queries, API handlers, message queues
- **E2E**: critical user journeys, auth flows, payment flows
- **Property-based**: complex data transformations, serialization
- **Snapshot**: UI components, API responses that rarely change

## Coverage targets
- Backend: ≥ 80% line coverage
- Frontend: ≥ 70% line coverage
- Critical paths: 100% branch coverage
