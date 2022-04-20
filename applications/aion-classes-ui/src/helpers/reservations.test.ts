import { getTotalSeatsAvailable } from './reservations';

describe('getTotalSeatsAvailable', () => {
  it('returns correct number when total seats reserved < student capacity', () => {
    expect(getTotalSeatsAvailable(5, 25)).toBe(20);
  });
  it('returns 0 if total seats reserved = student capacity', () => {
    expect(getTotalSeatsAvailable(7, 7)).toBe(0);
  });
  it('returns 0 if total seats reserved > student capacity', () => {
    expect(getTotalSeatsAvailable(10, 6)).toBe(0);
  });
});
