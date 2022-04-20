import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { CurrentStatus } from 'interfaces/oshaViolations';
import { Details } from './details/Details';
import { fetchOrganizationViolations, clearOrganizations } from './organizationViolations/slice';
import { fetchViolationRecords, clearViolationMatchRecords } from './violationMatchRecords/slice';
import { clearSearch, fetchOrganizationViolation } from './organizationViolation/slice';
import { fetchOshaViolation } from './oshaViolation/slice';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { useAppDispatch } from 'app/reducer';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { ViolationsBreadcrumbs } from './breadCrumbs/BreadCrumbs';
import { ManualOperations } from './manualOperations/ManualOperations';
import { MatchHistory } from './matchHistory/MatchHistory';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';

const useStyles = makeStyles(() => ({
  paper: {
    minHeight: '65vh',
    padding: 20
  }
}));

export const ViolationDetails = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { status } = useParams<{ status: CurrentStatus }>();

  const {
    location: { search }
  } = useHistory();

  const { name, id, ssqid } = parse(search) as { name: string; id: string; ssqid: string };

  React.useEffect(() => {
    dispatch(fetchViolationRecords(id));
    dispatch(fetchOshaViolation(id));
    dispatch(fetchOrganizationViolations(id));

    if (ssqid) dispatch(fetchOrganizationViolation(ssqid));

    return () => {
      dispatch(clearSearch());
      dispatch(clearOrganizations());
      dispatch(clearViolationMatchRecords());
    };
  }, [name, id, status, dispatch, ssqid]);

  return (
    <GridContainer>
      <Grid item xs={12}>
        <ViolationsBreadcrumbs companyName={name} status={status as CurrentStatus} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper className={classes.paper}>
          <Details status={status as CurrentStatus} />
          <ManualOperations />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper className={classes.paper}>
          <MatchHistory />
        </Paper>
      </Grid>
    </GridContainer>
  );
};
