import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { getLocalizedPeriodStatus, getStatusColor } from 'helpers';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  status: DisplayPeriodStatus;
};

type Props = WithTheme & OwnProps;

const PeriodText: React.FC<Props> = ({ status, theme }) => {
  const { t } = useTranslation();

  return (
    <Typography variant="body1" style={{ color: getStatusColor(theme, status) }}>
      <strong>{getLocalizedPeriodStatus(status, t)}</strong>
    </Typography>
  );
};

export const PeriodTextComponent = withTheme(PeriodText);
