import { bookingApi } from '../support/api/bookingApi';
import { buildBooking } from '../support/factories/booking';

describe('Booking search filters', () => {
  // Unique names so results aren't polluted by other people using the shared demo API.
  const unique = `Qa${Date.now()}`;
  let target;

  before(() => {
    cy.seedBooking(buildBooking({ firstname: unique, lastname: `${unique}Last` })).then((seeded) => {
      target = seeded;
    });
  });

  it('filters by first name', () => {
    bookingApi.list({ firstname: unique }).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.map((b) => b.bookingid)).to.include(target.id);
    });
  });

  it('filters by first and last name together', () => {
    bookingApi.list({ firstname: unique, lastname: `${unique}Last` }).then(({ body }) => {
      expect(body.map((b) => b.bookingid)).to.deep.equal([target.id]);
    });
  });

  it('returns an empty list when nothing matches', () => {
    bookingApi.list({ firstname: `${unique}-nobody` }).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body).to.be.an('array').that.is.empty;
    });
  });

  it('every id returned by a filter resolves to a matching booking', () => {
    bookingApi.list({ firstname: unique }).then(({ body }) => {
      body.forEach(({ bookingid }) => {
        bookingApi.get(bookingid).its('body.firstname').should('equal', unique);
      });
    });
  });
});
