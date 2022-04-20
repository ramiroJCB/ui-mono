import * as React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    },
    container: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column-reverse'
      }
    },
    noneFound: {
      textAlign: 'center'
    }
  });

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  incidentRootCauses: DeepReadonly<IIncidentRootCause[]> | null;
  clientId: string;
  showInactive: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddClick: () => void;
  incidentRootCauseId?: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ClientRootCauses: React.FC<Props> = ({
  clientId,
  incidentRootCauses,
  classes,
  showInactive,
  handleChange,
  handleAddClick,
  isFetching,
  error,
  children,
  incidentRootCauseId
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <GridContainer alignItems="flex-start" justify="space-between" style={{ flex: 0 }}>
        <Grid item>
          <BackTitleHeader
            to={`/${clientId}/reporting/incidents`}
            linkTitle={t('reporting.common.backToLeadingIndicatorReports', 'Back to Leading Indicator Reports')}
          >
            {t('reporting.incidents.clientRootCauses.indicatorRootCauses', 'Indicator Root Causes')}
          </BackTitleHeader>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={showInactive} onChange={handleChange} />}
            label={t('reporting.incidents.clientRootCauses.showInactiveRootCauses', 'Show Inactive Root Causes')}
          />
        </Grid>
      </GridContainer>
      <GridContainer className={classes.container}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.root} elevation={1}>
            <GridContainer alignItems="flex-start" justify="space-between">
              <Grid item>
                <Typography variant="h6" component="h2">
                  {t('reporting.common.rootCauses', 'Root Causes')}
                </Typography>
              </Grid>
              {incidentRootCauseId && (
                <Grid item>
                  <Button fullWidth variant="contained" color="secondary" onClick={handleAddClick}>
                    {t('reporting.common.addRootCause', 'Add a Root Cause')}
                  </Button>
                </Grid>
              )}
            </GridContainer>
            <GridContainer>
              {!isFetching && incidentRootCauses ? (
                incidentRootCauses.length > 0 ? (
                  incidentRootCauses.map(({ id, name, description }) => (
                    <Grid item xs={12} key={id}>
                      <Typography variant="body1">
                        <Link to={`/${clientId}/reporting/incidents/rootCauses/edit/${id}`}>{name}</Link>
                      </Typography>
                      <Typography variant="caption" component="small" gutterBottom>
                        {description}
                      </Typography>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className={classes.noneFound}>
                      {t('reporting.incidents.clientRootCauses.noRootCausesAdded', 'No root causes have been added.')}
                    </Typography>
                  </Grid>
                )
              ) : error ? (
                <Error />
              ) : (
                <Loading />
              )}
            </GridContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.root} elevation={1}>
            {children}
          </Paper>
        </Grid>
      </GridContainer>
    </React.Fragment>
  );
};

export const ClientRootCausesComponent = withStyles(styles)(ClientRootCauses);
