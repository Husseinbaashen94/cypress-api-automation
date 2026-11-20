import { bookingApi } from '../support/api/bookingApi';

describe('Health check and authentication', () => {
  it('GET /ping reports the service is up', () => {
    bookingApi.ping().then(({ status, duration }) => {
      expect(status).to.equal(201);
      expect(duration, 'response time (ms)').to.be.lessThan(5000);
    });
  });

  it('POST /auth returns a token for valid credentials', () => {
    cy.adminCredentials()
      .then(({ username, password }) => bookingApi.createToken(username, password))
      .then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body.token).to.be.a('string').and.match(/^[a-z0-9]{10,}$/i);
      });
  });

  const badCredentials = [
    { case: 'wrong password', username: 'admin', password: 'nope' },
    { case: 'unknown user', username: 'not-a-user', password: 'password123' },
    { case: 'empty body', username: undefined, password: undefined },
  ];

  badCredentials.forEach(({ case: name, username, password }) => {
    it(`POST /auth does not issue a token for ${name}`, () => {
      bookingApi.createToken(username, password).then(({ body }) => {
        expect(body).not.to.have.property('token');
        expect(body.reason).to.equal('Bad credentials');
      });
    });
  });
});
