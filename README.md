# Cypress API Automation

![Cypress API Tests](https://github.com/Husseinbaashen94/cypress-api-automation/actions/workflows/ci.yml/badge.svg)
![Cypress](https://img.shields.io/badge/Cypress-API%20testing-17202C?logo=cypress)

REST API test suite for [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html), a public hotel-booking API built for test practice, using **Cypress `cy.request()`**, **JSON Schema validation (Ajv)** and **Faker** test data.

> Part of a series that tests the same API with different stacks:
> [Cypress](https://github.com/Husseinbaashen94/cypress-api-automation) ·
> [Playwright](https://github.com/Husseinbaashen94/playwright-api-automation) ·
> [Java + Cucumber](https://github.com/Husseinbaashen94/java-cucumber-api-automation)

## What's covered

| Area | Scenarios |
|------|-----------|
| **Health & auth** | `/ping` is up and responds within a time budget · token issued for valid credentials · no token for wrong password, unknown user, or empty body |
| **CRUD lifecycle** | create → read → list → full update (PUT) → partial update (PATCH) → delete → confirm 404 |
| **Search filters** | filter by first name · first + last name · no-match returns `[]` · every filtered id resolves to a matching record |
| **Negative & security** | unknown id → 404 · PUT/PATCH/DELETE without a token or with a forged token → 403 · data unchanged after rejected writes · missing required field rejected |

## Design decisions

- **API client layer.** `support/api/bookingApi.js` wraps every endpoint. Specs read like `bookingApi.update(id, booking, token)`, never raw URLs and headers.
- **Contract testing.** Response bodies are validated against JSON Schemas in `cypress/schemas` with `cy.wrap(body).shouldMatchSchema('booking')`, so a renamed or retyped field fails loudly.
- **Random but valid data.** A Faker-based factory builds fresh bookings each run, and overrides pin only the fields a test cares about.
- **Shared-environment safety.** The demo API is public, so search tests seed records with unique names instead of trusting existing data.
- **Secrets out of the log.** Credentials are read with `cy.env()` and can be overridden by `CYPRESS_ADMIN_USER` / `CYPRESS_ADMIN_PASSWORD` in CI.
- **API quirks are documented in tests.** For example, `DELETE` returns `201` and a missing field returns `500`. The tests pin the current behaviour and say why.

## Project structure

```
cypress/
├── e2e/                      # health-and-auth, booking-crud, booking-filters, booking-negative
├── schemas/                  # JSON Schemas for contract checks
└── support/
    ├── api/bookingApi.js     # endpoint client
    ├── factories/booking.js  # Faker test-data builder
    └── commands.js           # shouldMatchSchema, adminToken, seedBooking
```

## Run it

Requires Node.js 18+.

```bash
npm install
npm test           # headless run
npm run cy:open    # interactive runner
```

The HTML report is written to `cypress/reports/index.html`.

## CI

GitHub Actions runs the suite on every push and pull request, and daily so that changes in the live API get noticed. The HTML report is uploaded as a build artifact.
