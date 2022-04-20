import * as React from 'react';
import Button from '@material-ui/core/Button';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const Component: React.FC<WithTheme> = ({ theme }) => {
  const { t } = useTranslation();

  return (
    <Button variant="outlined" disabled style={{ color: theme.palette.secondary.main }}>
      <CheckRoundedIcon />
      {t('safetyPrograms.common.accepted', 'Accepted')}
    </Button>
  );
};

export const AcceptedButton = withTheme(Component);
