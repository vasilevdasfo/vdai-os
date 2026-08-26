## Outcome

Describe the bounded result and source of truth.

## Safety boundary

- [ ] No client data, credentials, dumps or private configuration
- [ ] Permission changes are explicit and least-privilege
- [ ] External send/deploy/payment/production actions remain gated

## Proof

- [ ] `node scripts/verify-public.mjs`
- [ ] lint, typecheck and unit tests
- [ ] clean-install or integration check when runtime behavior changes
- [ ] rollback described
