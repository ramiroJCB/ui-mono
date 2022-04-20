import * as React from 'react';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { getLocalizedPeriodStatus, getStatusColor, getStatusIcon } from 'helpers';
import { Theme, withStyles, WithStyles, withTheme, WithTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(1)
  }
});

type OwnProps = {
  status: DisplayPeriodStatus;
};

type Props = WithTheme & WithStyles<typeof styles> & OwnProps;

const PeriodIcon: React.FC<Props> = ({ status, classes, theme }) => {
  const { t } = useTranslation();
  const color = getStatusColor(theme, status);
  const Icon = getStatusIcon(status);

  return (
    <span title={getLocalizedPeriodStatus(status, t)} aria-hidden="true" style={{ position: 'relative', top: '4px' }}>
      <Icon className={classes.icon} style={{ color }} />
    </span>
  );
};

export const PeriodIconComponent = withTheme(withStyles(styles)(PeriodIcon));
