import { faker } from '@faker-js/faker';

const isoDate = (date) => date.toISOString().slice(0, 10);

/**
 * Builds a valid booking payload with random data.
 * Pass overrides to pin any field for a specific test.
 */
export function buildBooking(overrides = {}) {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 10, refDate: checkin });

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 2000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: isoDate(checkin),
      checkout: isoDate(checkout),
    },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Late checkout', 'Airport transfer']),
    ...overrides,
  };
}
