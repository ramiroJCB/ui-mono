import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { IIncident } from 'interfaces/incident';
import { IncidentCategoryStatus } from 'interfaces/incidentCategory';
import { IncidentTypeStatus } from 'interfaces/incidentType';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const { Active: ActiveType } = IncidentTypeStatus;
const { Active: ActiveCategory } = IncidentCategoryStatus;
const styles = (theme: Theme) => ({
  detailsGrid: {
    paddingRight: 32
  },
  inactive: {
    color: theme.palette.action.disabled
  },
  summary: {
    '&:hover': {
      background: theme.palette.action.hover
    }
  }
});

type OwnProps = {
  incident: IIncident;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ClientIncidentsRow: React.FC<Props> = ({
  classes,
  incident: { createdDateUtc, details, incidentNumber, occurredOnDateUtc, meta }
}) => {
  const { t } = useTranslation();

  if (!meta) {
    return null;
  }
  const {
    contractorName,
    incidentCategoryName,
    incidentCategoryStatus,
    incidentTypeName,
    incidentTypeStatus,
    incidentRegionName,
    incidentWorkGroupName,
    incidentRootCauseName
  } = meta;
  return (
    <Accordion>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
        <Grid container spacing={3} justify="space-between" alignItems="center">
          <Grid item xs={2}>
            <Typography variant="body2">{localizeDate(occurredOnDateUtc, t)}</Typography>
          </Grid>
          <Grid item xs={4} zeroMinWidth>
            <Typography variant="body2" noWrap title={contractorName}>
              {contractorName}
            </Typography>
          </Grid>
          <Grid item xs={2} zeroMinWidth>
            <Typography variant="body2" noWrap title={incidentTypeName}>
              <span className={incidentTypeStatus === ActiveType ? '' : classes.inactive}>{incidentTypeName}</span>
            </Typography>
          </Grid>
          <Grid item xs={2} zeroMinWidth>
            <Typography variant="body2" noWrap title={incidentCategoryName}>
              <span className={incidentCategoryStatus === ActiveCategory ? '' : classes.inactive}>
                {incidentCategoryName}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" noWrap>
              {incidentRootCauseName}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3} alignItems="flex-start" className={classes.detailsGrid}>
          <Grid item xs={2}>
            <Typography variant="subtitle2" gutterBottom>
              {t('reporting.common.reported', 'Reported')}
            </Typography>
            <Typography variant="body2">{localizeDate(createdDateUtc, t)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" gutterBottom>
              {t('reporting.common.activityObserved', 'Activity Observed')}
            </Typography>
            <Typography variant="body2">{details}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" gutterBottom>
              {t('reporting.common.region', 'Region')}
            </Typography>
            <Typography variant="body2">{incidentRegionName}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" gutterBottom>
              {t('reporting.common.workGroup', 'Work Group')}
            </Typography>
            <Typography variant="body2">{incidentWorkGroupName}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" gutterBottom>
              {t('reporting.common.id', 'ID')}
            </Typography>
            <Typography variant="body2">{incidentNumber}</Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export const ClientIncidentsRowComponent = withStyles(styles)(ClientIncidentsRow);
