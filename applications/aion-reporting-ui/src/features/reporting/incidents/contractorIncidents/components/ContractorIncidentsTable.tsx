import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ContractorIncidentsRowComponent } from './ContractorIncidentsRow';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIncident } from 'interfaces/incident';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      'z-index': 1,
      [theme.breakpoints.up('md')]: {
        top: 64
      }
    }
  });

type OwnProps = {
  incidents: DeepReadonly<IIncident[]>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ContractorIncidentsTable: React.FC<Props> = ({ classes, incidents }) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Paper className={classes.paper} square elevation={1}>
          <GridContainer spacing={3} justify="space-between" style={{ paddingRight: 32, paddingLeft: 0 }}>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.common', 'Occurred')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2">
                {t('reporting.incidents.contractorIncidents.operator', 'Operator')}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.behaviorCategory', 'Behavior Category')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.classification', 'Classification')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.rootCause', 'Root Cause')}</Typography>
            </Grid>
          </GridContainer>
        </Paper>
        {incidents.length ? (
          incidents.map(incident => <ContractorIncidentsRowComponent key={incident.id} incident={incident} />)
        ) : (
          <Paper className={classes.paper} square elevation={1}>
            <GridContainer justify="center">
              <Grid item>
                <Typography variant="subtitle2">
                  {t(
                    'reporting.incidents.contractorIncidents.youHaveNoReportedIncidents',
                    'You have no reported incidents.'
                  )}
                </Typography>
              </Grid>
            </GridContainer>
          </Paper>
        )}
      </Grid>
    </GridContainer>
  );
};

export const ContractorIncidentsTableComponent = withStyles(styles)(ContractorIncidentsTable);
