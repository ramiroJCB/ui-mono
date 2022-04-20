import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Page } from './Page';
import { useTranslation } from 'react-i18next';

const Registration: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('registration.welcome.welcomeTitle', 'Welcome')}>
      <GridContainer>
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            {t('registration.welcome.havePECID', 'Do you have a PEC ID?')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button color="secondary" fullWidth variant="contained" component={Link} to="/enter-pec-id">
            {t('registration.welcome.yesIHave', 'Yes, I have a PEC ID')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button color="primary" fullWidth variant="outlined" component={Link} to="/using-a-company">
            {t('registration.welcome.noIDont', "No, I don't have one")}
          </Button>
        </Grid>
      </GridContainer>
    </Page>
  );
};

export default Registration;
