import * as React from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { ErrorButton } from 'components/ErrorButton';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const Component: React.FC<WithTheme> = ({ theme }) => {
  const { t } = useTranslation();

  return (
    <ErrorButton variant="outlined" disabled style={{ color: theme.palette.error.main }}>
      <CloseRoundedIcon />
      {t('safetyPrograms.common.rejected', 'Rejected')}
    </ErrorButton>
  );
};

export const RejectedButton = withTheme(Component);
