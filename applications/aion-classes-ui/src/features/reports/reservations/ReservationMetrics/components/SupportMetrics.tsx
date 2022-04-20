import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { localizeCurrency } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  value: number;
  shouldMonetize: boolean;
};

export const SupportMetrics: React.FC<Props> = ({ title, value, shouldMonetize }) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={6} lg={3}>
      <Typography variant="overline" color="textSecondary">
        {title}
      </Typography>
      <Typography style={{ fontWeight: 'bold' }} variant="h6">
        {shouldMonetize ? localizeCurrency(value, t) : value}
      </Typography>
    </Grid>
  );
};
