import Ajv from 'ajv';
import { bookingApi } from './api/bookingApi';
import booking from '../schemas/booking.schema.json';
import createBooking from '../schemas/createBooking.schema.json';
import bookingIds from '../schemas/bookingIds.schema.json';

const ajv = new Ajv({ allErrors: true, schemas: [booking, createBooking, bookingIds] });

/**
 * Asserts a response body matches a JSON schema by its $id.
 * Usage: bookingApi.get(id).its('body').shouldMatchSchema('booking')
 */
Cypress.Commands.add('shouldMatchSchema', { prevSubject: true }, (body, schemaId) => {
  const validate = ajv.getSchema(schemaId);
  if (!validate) throw new Error(`Unknown schema "${schemaId}"`);
  const valid = validate(body);
  const details = valid ? '' : ajv.errorsText(validate.errors, { separator: '\n' });
  expect(valid, `body matches "${schemaId}" schema\n${details}`).to.equal(true);
  return body;
});

/** Reads admin credentials from the environment (cy.env keeps them out of the command log). */
Cypress.Commands.add('adminCredentials', () =>
  cy.env(['ADMIN_USER', 'ADMIN_PASSWORD'], { log: false }).then(({ ADMIN_USER, ADMIN_PASSWORD }) => ({
    username: ADMIN_USER,
    password: ADMIN_PASSWORD,
  })),
);

/** Requests an auth token once per spec file and reuses it. */
let cachedToken;
Cypress.Commands.add('adminToken', () => {
  if (cachedToken) return cy.wrap(cachedToken, { log: false });
  return cy
    .adminCredentials()
    .then(({ username, password }) => bookingApi.createToken(username, password))
    .then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body).to.have.property('token');
      cachedToken = body.token;
      return cachedToken;
    });
});

/** Creates a booking and yields { id, booking } for tests that need existing data. */
Cypress.Commands.add('seedBooking', (payload) =>
  bookingApi.create(payload).then(({ status, body }) => {
    expect(status).to.equal(200);
    return { id: body.bookingid, booking: body.booking };
  }),
);
