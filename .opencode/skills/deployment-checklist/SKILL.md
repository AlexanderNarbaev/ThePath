---
name: deployment-checklist
description: Use when preparing a deployment — pre-deployment and post-deployment verification checklist
---
# Deployment Checklist

## Pre-Deployment
- [ ] All tests pass (`pytest` / `cargo test` / `go test`)
- [ ] Linter passes with no errors
- [ ] Type checker passes
- [ ] Build succeeds
- [ ] Database migrations tested on staging
- [ ] Environment variables documented
- [ ] Breaking changes documented in CHANGELOG
- [ ] Rollback plan defined

## Post-Deployment
- [ ] Health check endpoint responds
- [ ] Smoke tests pass on production
- [ ] Logs show normal traffic
- [ ] Metrics/alerting active
- [ ] Database migration completed successfully
