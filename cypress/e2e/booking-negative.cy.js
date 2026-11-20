import { bookingApi } from '../support/api/bookingApi';
import { buildBooking } from '../support/factories/booking';

describe('Booking negative and security checks', () => {
  let existing;

  before(() => {
    cy.seedBooking(buildBooking()).then((seeded) => {
      existing = seeded;
    });
  });

  it('GET /booking/:id returns 404 for an id that does not exist', () => {
    bookingApi.get(999999999).its('status').should('equal', 404);
  });

  describe('write operations require authentication', () => {
    const cases = [
      { name: 'PUT without a token', call: (id) => bookingApi.update(id, buildBooking()) },
      { name: 'PUT with a forged token', call: (id) => bookingApi.update(id, buildBooking(), 'forged-token') },
      { name: 'PATCH without a token', call: (id) => bookingApi.patch(id, { firstname: 'Hacked' }) },
      { name: 'DELETE without a token', call: (id) => bookingApi.remove(id) },
      { name: 'DELETE with a forged token', call: (id) => bookingApi.remove(id, 'forged-token') },
    ];

    cases.forEach(({ name, call }) => {
      it(`rejects ${name} with 403`, () => {
        call(existing.id).its('status').should('equal', 403);
      });
    });

    it('leaves the booking unchanged after rejected writes', () => {
      bookingApi.get(existing.id).then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body).to.deep.equal(existing.booking);
      });
    });
  });

  it('POST /booking rejects a payload missing required fields', () => {
    const { firstname, ...withoutFirstname } = buildBooking();
    bookingApi.create(withoutFirstname).its('status').should('equal', 500);
  });
});
