import { arrayIsEqual, arrayMapIsEqual } from './form';

describe('arrayIsEqual', () => {
  it('is true for identical arrays', () => {
    expect(arrayIsEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
  });

  it('is true for arrays with the same values, in different order', () => {
    expect(arrayIsEqual(['a', 'b', 'c'], ['b', 'c', 'a'])).toBe(true);
  });

  it('is false for arrays with different values', () => {
    expect(arrayIsEqual(['a', 'b', 'c'], ['a', 'b'])).toBe(false);
  });
});

describe('arrayMapIsEqual', () => {
  it('is true for identical maps', () => {
    expect(
      arrayMapIsEqual(
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2', 'c3']
        },
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2', 'c3']
        }
      )
    ).toBe(true);
  });

  it('is true for maps with the same values, in different order', () => {
    expect(
      arrayMapIsEqual(
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2', 'c3']
        },
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b2', 'b1', 'b3'],
          c: ['c3', 'c2', 'c1']
        }
      )
    ).toBe(true);
  });

  it('is true for maps with the same values, but keys in different order', () => {
    expect(
      arrayMapIsEqual(
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2', 'c3']
        },
        {
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2', 'c3'],
          a: ['a1', 'a2', 'a3']
        }
      )
    ).toBe(true);
  });

  it('is true for maps with the same values, but keys and values in different order', () => {
    expect(
      arrayMapIsEqual(
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2', 'c3']
        },
        {
          b: ['b1', 'b2', 'b3'],
          c: ['c2', 'c1', 'c3'],
          a: ['a3', 'a2', 'a1']
        }
      )
    ).toBe(true);
  });

  it('is false for maps with different values', () => {
    expect(
      arrayMapIsEqual(
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2', 'c3']
        },
        {
          a: ['a1', 'a2', 'a3'],
          b: ['b1', 'b2', 'b3'],
          c: ['c1', 'c2']
        }
      )
    ).toBe(false);
  });
});
