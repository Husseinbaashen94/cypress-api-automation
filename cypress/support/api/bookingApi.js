/**
 * Thin client over the Restful-Booker API.
 * Every call returns the cy.request chain and never fails on status,
 * so specs assert on status codes themselves.
 */
const json = { Accept: 'application/json', 'Content-Type': 'application/json' };

const request = (options) => cy.request({ failOnStatusCode: false, headers: json, ...options });

const authHeaders = (token) => ({ ...json, Cookie: `token=${token}` });

export const bookingApi = {
  ping: () => request({ method: 'GET', url: '/ping' }),

  createToken: (username, password) =>
    request({ method: 'POST', url: '/auth', body: { username, password } }),

  list: (qs = {}) => request({ method: 'GET', url: '/booking', qs }),

  get: (id) => request({ method: 'GET', url: `/booking/${id}` }),

  create: (booking) => request({ method: 'POST', url: '/booking', body: booking }),

  update: (id, booking, token) =>
    request({ method: 'PUT', url: `/booking/${id}`, body: booking, headers: token ? authHeaders(token) : json }),

  patch: (id, fields, token) =>
    request({ method: 'PATCH', url: `/booking/${id}`, body: fields, headers: token ? authHeaders(token) : json }),

  remove: (id, token) =>
    request({ method: 'DELETE', url: `/booking/${id}`, headers: token ? authHeaders(token) : json }),
};
