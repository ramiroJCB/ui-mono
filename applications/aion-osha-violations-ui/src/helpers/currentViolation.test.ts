import { currentViolation } from './currentViolation';

describe('Current Violations helper', () => {
  const unMatchedViolations = {
    error: false,
    isFetching: false,
    total: 12,
    violations: [1, 2, 3, 4, 57, 8, 9, 10, 11, 12]
  };
  const associatedViolations = { error: false, isFetching: false, total: 2, violations: [1, 2] };
  const pendingViolations = {
    error: false,
    isFetching: false,
    total: 10,
    violations: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  };
  const unassociatedViolations = { error: false, isFetching: false, total: 0, violations: [] };

  it('return the unmachted Violations', async () => {
    const status = 'other';
    expect(
      currentViolation({ unMatchedViolations, associatedViolations, pendingViolations, unassociatedViolations, status })
    ).toEqual(unMatchedViolations);
  });
  it('return the associated violations', async () => {
    const status = 'associated';
    expect(
      currentViolation({ unMatchedViolations, associatedViolations, pendingViolations, unassociatedViolations, status })
    ).toEqual(associatedViolations);
  });
  it('return the pending violations', async () => {
    const status = 'pending';
    expect(
      currentViolation({ unMatchedViolations, associatedViolations, pendingViolations, unassociatedViolations, status })
    ).toEqual(pendingViolations);
  });
  it('return the unassociated violations', async () => {
    const status = 'unassociated';
    expect(
      currentViolation({ unMatchedViolations, associatedViolations, pendingViolations, unassociatedViolations, status })
    ).toEqual(unassociatedViolations);
  });
  it('when there is no status returns the pending violations', async () => {
    const status = '';
    expect(
      currentViolation({ unMatchedViolations, associatedViolations, pendingViolations, unassociatedViolations, status })
    ).toEqual(pendingViolations);
  });
});
