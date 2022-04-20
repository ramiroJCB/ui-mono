import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { isWidthDown, isWidthUp, withWidth, WithWidth } from '@material-ui/core';
import { IWorkerDetail } from 'interfaces/workerDetail';
import { millisToHMString } from 'helpers/timeCalc';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation, Trans } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  workerDetail: DeepReadonly<IWorkerDetail>;
};

const styles = (theme: Theme) => ({
  details: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  healthy: {
    color: theme.palette.secondary.main
  },
  injured: {
    color: theme.palette.error.light
  },
  row: {
    padding: theme.spacing(1)
  },
  summary: {
    '&:hover': {
      background: theme.palette.action.hover
    }
  }
});

const training = {
  safeLand: 'SafeLandUSA',
  safeGulf: 'SafeGulf',
  h2SClear: 'PEC H2S Clear',
  coreCompliance: 'PEC Core'
};

type Props = WithStyles<typeof styles> & OwnProps & WithWidth;

const ReportRowComponent: React.FC<Props> = ({
  workerDetail: {
    firstName,
    lastName,
    pecIdentifier,
    contractorName,
    dateTimeIn,
    dateTimeOut,
    exposureDuration,
    injuredOnLocation,
    siteName,
    siteTags,
    contractorStatus,
    contractorStatusColor,
    workGroupJobTypes,
    ...workerDetail
  },
  width,
  classes
}) => {
  const { t } = useTranslation();
  return (
    <Accordion>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
        <GridContainer spacing={0}>
          <Grid item xs={3}>
            <Typography variant="body1">{firstName}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1">{lastName}</Typography>
          </Grid>
          <Grid item xs={4} sm={3}>
            <Typography variant="body1">
              <span style={{ color: contractorStatusColor }}>⬤</span> {contractorName}
            </Typography>
          </Grid>
          {isWidthUp('sm', width) && (
            <Grid item xs={2}>
              <Typography variant="body1">{siteName}</Typography>
            </Grid>
          )}
          <Grid item xs={2} sm={1}>
            <Typography variant="body1">
              <span className={injuredOnLocation ? classes.injured : classes.healthy}>⬤</span>{' '}
              {millisToHMString(exposureDuration)}
            </Typography>
          </Grid>
        </GridContainer>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <GridContainer spacing={0}>
          <Grid container item xs={12}>
            <Grid item className={classes.row} xs={6}>
              <Typography>
                {t('smart.reportRow.pecId', {
                  defaultValue: 'PEC ID: {{pecId}}',
                  pecId: pecIdentifier
                })}
              </Typography>
            </Grid>
            {isWidthDown('sm', width) && (
              <Grid className={classes.row} item xs={12}>
                <Typography>
                  {t('smart.reportRow.site', {
                    defaultValue: 'Site: {{siteName}}',
                    siteName
                  })}
                </Typography>
              </Grid>
            )}
            {isWidthUp('sm', width) && (
              <Grid className={classes.row} item xs={12} sm={4}>
                <Typography>
                  <Trans i18nKey="smart.reportRow.companyStatus">
                    Company Status: <strong style={{ color: contractorStatusColor }}>{{ contractorStatus }}</strong>
                  </Trans>
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography>
                {injuredOnLocation && (
                  <strong className={classes.injured}>
                    {t('smart.reportRow.injuredOnLocation', 'Injured on Location')}
                  </strong>
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={6}>
            <Grid className={classes.row} item sm={6} md={12}>
              <Typography>
                {t('smart.reportRow.checkedIn', {
                  defaultValue: 'Checked In: {{date}}',
                  date: localizeDate(dateTimeIn, t)
                })}
              </Typography>
            </Grid>
            <Grid className={classes.row} item xs={12} sm={6}>
              <Typography>
                {t('smart.reportRow.checkedOut', {
                  defaultValue: 'Checked Out: {{date}}',
                  date: localizeDate(dateTimeOut, t)
                })}
              </Typography>
            </Grid>
          </Grid>
          {isWidthDown('sm', width) && (
            <Grid item xs={12} sm={4} className={classes.row}>
              <Typography>
                <Trans i18nKey="smart.reportRow.companyStatus">
                  Company Status: <strong style={{ color: contractorStatusColor }}>{{ contractorStatus }}</strong>
                </Trans>
              </Typography>
            </Grid>
          )}
          <Grid className={classes.row} item xs={12} md={6}>
            <Typography>
              {t('smart.reportRow.compliantTraining', 'Compliant Training: ')}
              {!!workGroupJobTypes.length
                ? workGroupJobTypes
                    .map(({ jobTypeName, workGroupName }) => `${jobTypeName} (${workGroupName})`)
                    .join(', ')
                : Object.keys(training)
                    .filter(k => workerDetail[k])
                    .map(k => training[k])
                    .join(', ') || t('smart.common.none', 'None')}
            </Typography>
          </Grid>
        </GridContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export const ReportRow = withStyles(styles)(withWidth()(ReportRowComponent));
