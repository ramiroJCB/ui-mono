import { ComplianceLevel } from 'interfaces/complianceLevel';
import { Theme } from '@material-ui/core';

const { Compliant, NonCompliant, SemiCompliant } = ComplianceLevel;

export const getComplianceLevel = (employeeCompliance: number) => {
  if (employeeCompliance > 80) {
    return Compliant;
  } else if (employeeCompliance >= 50 && employeeCompliance < 80) {
    return SemiCompliant;
  } else {
    return NonCompliant;
  }
};

export const assignComplianceColor = (theme: Theme, compliance: ComplianceLevel): string =>
  ({
    [Compliant]: theme.palette.secondary.main,
    [SemiCompliant]: theme.palette.grey[700],
    [NonCompliant]: theme.palette.error.main
  }[compliance] || theme.palette.grey[700]);
