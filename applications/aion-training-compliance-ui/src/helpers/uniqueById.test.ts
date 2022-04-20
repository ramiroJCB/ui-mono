import { uniqueById } from './uniqueById';

describe('uniqueById', () => {
  it('concats the arrays and returns back only unique values', () => {
    const currentValues = [{ id: '123' }, { id: '456' }];
    const payload = [{ id: '123' }, { id: '456' }, { id: '789' }];

    expect(uniqueById(currentValues, payload)).toHaveLength(3);
  });
});
