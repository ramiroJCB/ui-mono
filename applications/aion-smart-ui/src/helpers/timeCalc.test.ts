import { millisToHMString, millisToHoursString } from './timeCalc';

describe('millisToHMString', () => {
  it('converts millis to a string with hours and minutes', () => {
    expect(millisToHMString(32400000)).toBe('9 hr 0 min');
    expect(millisToHMString(32400000 + 30 * 60 * 1000)).toBe('9 hr 30 min');
  });

  it('rounds down to the minute', () => {
    expect(millisToHMString(32400000 - 1)).toBe('8 hr 59 min');
    expect(millisToHMString(32400000)).toBe('9 hr 0 min');
  });
});

describe('millisToHoursString', () => {
  it('converts millis to hours with one decimal place', () => {
    expect(millisToHoursString(32400000)).toBe('9.0');
    expect(millisToHoursString(32400000 + 30 * 60 * 1000)).toBe('9.5');
  });
});
