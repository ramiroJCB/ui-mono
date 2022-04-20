import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { ExternalLink } from './ExternalLink';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  subTitle: {
    fontWeight: 600
  },
  root: {
    minHeight: '100%'
  }
}));

export const OshaResources: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Paper className={classes.root}>
      <GridContainer spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6">{t('oshaViolations.oshaResources.oshaResources', 'OSHA Resources')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary" className={classes.subTitle}>
            {t('oshaViolations.oshaViolations', 'OSHA Violations')}
          </Typography>
          <Typography color="textSecondary" gutterBottom paragraph>
            {t(
              'oshaViolations.oshaResources.findMoreDetails',
              'Find more details including OSHA Enforcement Inspections and Violations on your organization by visiting'
            )}{' '}
            <ExternalLink label="OSHA.gov" url="https://www.osha.gov" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary" className={classes.subTitle}>
            {t('oshaViolations.oshaResources.oshaFaQs', 'OSHA FAQs')}
          </Typography>
          <Typography color="textSecondary">
            {t('oshaViolations.oshaResources.learnMore', 'Learn more about OSHA Enforcement Inspections by visiting')}{' '}
            <ExternalLink label="OSHA.gov/faq" url="https://www.osha.gov/faq" />
          </Typography>
        </Grid>
      </GridContainer>
    </Paper>
  );
};
