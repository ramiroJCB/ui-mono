import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Page } from './Page';
import { useTranslation } from 'react-i18next';

const emptyGuid = '00000000-0000-0000-0000-000000000000'; // represents "No Company" in database

const UsingACompany: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('registration.usingACompany.employment', 'Employment')}>
      <GridContainer>
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            {t('registration.usingACompany.areYouEmployed', 'Are you employed?')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Button color="secondary" fullWidth variant="contained" component={Link} to="/companies">
            {t('registration.usingACompany.yes', 'Yes')}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            color="primary"
            fullWidth
            variant="outlined"
            component={Link}
            to={`/companies/${emptyGuid}/enter-your-info`}
          >
            {t('registration.usingACompany.no', 'No')}
          </Button>
        </Grid>
      </GridContainer>
    </Page>
  );
};
export default UsingACompany;
