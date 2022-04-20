import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { useTranslation } from 'react-i18next';

export const RegisterPrompt: React.FC = () => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Paper>
          <GridContainer>
            <Grid item xs={12}>
              <Typography variant="h4" align="center">
                {t('user.profile.almostDone', 'Almost done!')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" align="center">
                {t('user.profile.moreInfo', 'We need a little more info before your PEC account is ready to use.')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                <Button variant="contained" color="secondary" href="/registration">
                  {t('user.profile.finishRegistration', 'Finish registration')}
                </Button>
              </Typography>
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
