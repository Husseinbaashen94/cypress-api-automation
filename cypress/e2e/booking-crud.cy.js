import { bookingApi } from '../support/api/bookingApi';
import { buildBooking } from '../support/factories/booking';

describe('Booking lifecycle (CRUD)', () => {
  const payload = buildBooking();
  let bookingId;
  let token;

  before(() => {
    cy.adminToken().then((t) => {
      token = t;
    });
  });

  it('POST /booking creates a booking and echoes it back', () => {
    bookingApi.create(payload).then(({ status, body, headers }) => {
      expect(status).to.equal(200);
      expect(headers['content-type']).to.include('application/json');
      cy.wrap(body).shouldMatchSchema('createBooking');
      expect(body.booking).to.deep.equal(payload);
      bookingId = body.bookingid;
    });
  });

  it('GET /booking/:id returns the stored booking', () => {
    bookingApi.get(bookingId).then(({ status, body }) => {
      expect(status).to.equal(200);
      cy.wrap(body).shouldMatchSchema('booking');
      expect(body).to.deep.equal(payload);
    });
  });

  it('GET /booking includes the new id', () => {
    bookingApi.list().then(({ status, body }) => {
      expect(status).to.equal(200);
      cy.wrap(body).shouldMatchSchema('bookingIds');
      expect(body.map((b) => b.bookingid)).to.include(bookingId);
    });
  });

  it('PUT /booking/:id replaces the whole booking', () => {
    const replacement = buildBooking({ firstname: 'Replaced' });
    bookingApi.update(bookingId, replacement, token).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body).to.deep.equal(replacement);
    });
    bookingApi.get(bookingId).its('body').should('deep.equal', replacement);
  });

  it('PATCH /booking/:id changes only the given fields', () => {
    bookingApi.get(bookingId).then(({ body: before }) => {
      bookingApi.patch(bookingId, { totalprice: 999, additionalneeds: 'Late checkout' }, token).then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body).to.deep.equal({ ...before, totalprice: 999, additionalneeds: 'Late checkout' });
      });
    });
  });

  it('DELETE /booking/:id removes the booking', () => {
    // Restful-Booker answers DELETE with 201 Created; documented quirk of the API.
    bookingApi.remove(bookingId, token).its('status').should('equal', 201);
    bookingApi.get(bookingId).its('status').should('equal', 404);
  });
});
