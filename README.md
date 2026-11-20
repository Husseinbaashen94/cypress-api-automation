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

## Getting started

### 1. Prerequisites

| Tool | Version | Check | Install |
|------|---------|-------|---------|
| Node.js | 20.12 or newer (22 LTS recommended) | `node -v` | [nodejs.org](https://nodejs.org/) |
| Git | any recent | `git --version` | [git-scm.com](https://git-scm.com/downloads) |

### 2. Clone and install

```bash
git clone https://github.com/Husseinbaashen94/cypress-api-automation.git
cd cypress-api-automation
npm install          # installs Cypress, Ajv (schema validation) and Faker
```

### 3. Configure (optional)

Everything works out of the box. To change a setting, copy the template and fill in only what you need:

```bash
cp .env.example .env
```

| Variable | Purpose and default |
|----------|---------------------|
| `BASE_URL` | API under test. Default `https://restful-booker.herokuapp.com` |
| `ADMIN_USER` | Login used for `/auth`. Default: Restful-Booker's public demo user |
| `ADMIN_PASSWORD` | Password for that login. Default: the public demo password |

Empty values use the default. `.env` is git-ignored, so nothing you put in it is ever committed.

### 4. Run the tests

```bash
npm test                 # all API specs, headless
npx cypress run --spec cypress/e2e/booking-crud.cy.js   # one spec file
npm run cy:open          # interactive runner: inspect every request and response
```

### 5. View the report

Open `cypress/reports/index.html` in a browser.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cypress binary is missing` | Run `npx cypress install` |
| Many tests fail with `503` / timeouts | The public demo API sleeps when idle; run again after a minute |
| Search tests fail intermittently | Someone else may be loading the shared demo; re-run |

## CI

GitHub Actions runs the suite on every push and pull request, and daily so that changes in the live API get noticed. The HTML report is uploaded as a build artifact.
