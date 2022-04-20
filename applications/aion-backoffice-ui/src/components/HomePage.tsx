import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography variant="h5">{t('backoffice.homepage.backOffice', 'Back Office')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          {t('backoffice.homepage.welcome', 'Welcome to the Back Office application!')}
        </Typography>
      </Grid>
    </GridContainer>
  );
};

export default HomePage;
