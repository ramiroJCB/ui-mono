import { deselectRegionalServices, selectRegionalServices } from './mutators';

const regionalServiceIdsByRegion = {
  a: ['a1', 'a2', 'a3'],
  b: ['b1', 'b2', 'b3'],
  c: ['c1', 'c2', 'c3']
};

describe('selectRegionalServices', () => {
  it('selects regional services, mapped by region', () => {
    expect(selectRegionalServices('b', ['b4', 'b5', 'b6'])(regionalServiceIdsByRegion)).toEqual({
      a: ['a1', 'a2', 'a3'],
      b: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'],
      c: ['c1', 'c2', 'c3']
    });
  });

  it('creates new keys if necessary', () => {
    expect(selectRegionalServices('d', ['d1', 'd2', 'd3'])(regionalServiceIdsByRegion)).toEqual({
      a: ['a1', 'a2', 'a3'],
      b: ['b1', 'b2', 'b3'],
      c: ['c1', 'c2', 'c3'],
      d: ['d1', 'd2', 'd3']
    });
  });

  it('prevents duplicate selections', () => {
    expect(selectRegionalServices('b', ['b2', 'b3', 'b4'])(regionalServiceIdsByRegion)).toEqual({
      a: ['a1', 'a2', 'a3'],
      b: ['b1', 'b2', 'b3', 'b4'],
      c: ['c1', 'c2', 'c3']
    });
  });
});

describe('deselectRegionalServices', () => {
  it('deselects regional services', () => {
    expect(deselectRegionalServices('b', ['b1', 'b3'])(regionalServiceIdsByRegion)).toEqual({
      a: ['a1', 'a2', 'a3'],
      b: ['b2'],
      c: ['c1', 'c2', 'c3']
    });
  });

  it("ignores services that aren't selected", () => {
    expect(deselectRegionalServices('b', ['b4', 'b5'])(regionalServiceIdsByRegion)).toEqual({
      a: ['a1', 'a2', 'a3'],
      b: ['b1', 'b2', 'b3'],
      c: ['c1', 'c2', 'c3']
    });
  });

  it("ignores regions that aren't selected", () => {
    expect(deselectRegionalServices('d', ['d4', 'd5'])(regionalServiceIdsByRegion)).toEqual({
      a: ['a1', 'a2', 'a3'],
      b: ['b1', 'b2', 'b3'],
      c: ['c1', 'c2', 'c3'],
      d: []
    });
  });
});
