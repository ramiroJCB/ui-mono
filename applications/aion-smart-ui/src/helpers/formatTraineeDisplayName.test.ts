import { formatTraineeDisplayName } from './formatTraineeDisplayName';

describe('displays trainee name properly', () => {
  it('displays only first name if last name not known', () => {
    expect(formatTraineeDisplayName('John', null)).toBe('John');
  });
  it('displays only last name if first name not known', () => {
    expect(formatTraineeDisplayName(null, 'Doe')).toBe('Doe');
  });
  it('displays first name and last name with a space between', () => {
    expect(formatTraineeDisplayName('John', 'Doe')).toBe('John Doe');
  });
});
