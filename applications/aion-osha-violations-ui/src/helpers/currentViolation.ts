export const currentViolation = ({
  unMatchedViolations,
  associatedViolations,
  pendingViolations,
  unassociatedViolations,
  status
}: any) => {
  const allViolations = {
    other: {
      error: unMatchedViolations.error,
      isFetching: unMatchedViolations.isFetching,
      total: unMatchedViolations.total,
      violations: unMatchedViolations.violations
    },
    pending: {
      error: pendingViolations.error,
      isFetching: pendingViolations.isFetching,
      total: pendingViolations.total,
      violations: pendingViolations.violations
    },
    associated: {
      error: associatedViolations.error,
      isFetching: associatedViolations.isFetching,
      total: associatedViolations.total,
      violations: associatedViolations.violations
    },
    unassociated: {
      error: unassociatedViolations.error,
      isFetching: unassociatedViolations.isFetching,
      total: unassociatedViolations.total,
      violations: unassociatedViolations.violations
    }
  };

  return status ? allViolations[status.toLowerCase()] : allViolations['pending'];
};
