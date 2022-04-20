import { assignComplianceColor, getComplianceLevel } from './assignComplianceColor';
import { ComplianceLevel } from '../interfaces/complianceLevel';
import { createMuiTheme } from '@material-ui/core/styles';

const { Compliant, NonCompliant, SemiCompliant } = ComplianceLevel;

describe('getComplianceLevel', () => {
  it('gets the correct compliance level depending on the number given', () => {
    expect(getComplianceLevel(85)).toBe(Compliant);
    expect(getComplianceLevel(58)).toBe(SemiCompliant);
    expect(getComplianceLevel(22)).toBe(NonCompliant);
  });
});

describe('assignComplianceColor', () => {
  const theme = createMuiTheme({
    palette: {
      primary: { main: '#343B46' },
      secondary: { main: '#5C813B' },
      error: { main: '#BA423A', light: '#E0B500' }
    }
  });

  it('gets the correct compliance color depending on the theme and compliance level given', () => {
    expect(assignComplianceColor(theme, Compliant)).toBe(theme.palette.secondary.main);
    expect(assignComplianceColor(theme, SemiCompliant)).toBe(theme.palette.grey[700]);
    expect(assignComplianceColor(theme, NonCompliant)).toBe(theme.palette.error.main);
    expect(assignComplianceColor(theme, 'FooBar')).toBe(theme.palette.grey[700]);
  });
});
