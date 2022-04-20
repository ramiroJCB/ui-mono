import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { clearAssociatedSearch, fetchAssociatedViolations } from './associatedViolations/slice';
import { clearPendingSearch, fetchPendingViolations } from './pendingViolations/slice';
import { clearUnassociatedSearch, fetchUnassociatedViolations } from './unassociatedViolations/slice';
import { clearUnMatchedSearch, fetchUnMatchedViolations } from './unMatchedViolations/slice';
import { fetchOshaImport } from './oshaImports/slice';
import { FiltersDrawer } from './drawer/Drawer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { TabFilter } from './tabFilter/TabFilter';
import { USAStates } from '@pec/aion-ui-core/constants/USAStates';
import { useAppDispatch } from 'app/reducer';
import { useHistory } from 'react-router';
import { VerificationHeader } from './verificationHeader/VerificationHeader';
import { ViolationsTable } from './violationsTable/ViolationsTable';

const useStyles = makeStyles(() => ({
  root: {
    margin: '22px 18px'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

export const Specialist: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const {
    location: { search }
  } = useHistory();

  const currentSearch = parse(search);

  const {
    page = '1',
    order = 'desc',
    orderBy = 'importedDateUtc',
    state,
    keyword,
    pageSize,
    activity,
    matchType
  } = parse(search) as {
    page: string;
    state: string;
    keyword: string;
    activity: string;
    matchType: string;
    pageSize: string;
    orderBy: string;
    order: string;
  };

  React.useEffect(() => {
    dispatch(fetchOshaImport({ orderBy: 'runDateTimeUtc', order: 'desc' }));
    dispatch(fetchUnMatchedViolations({ status: 'NoAutomaticMatch', orderBy, order, ...currentSearch }));
    dispatch(fetchAssociatedViolations({ status: 'Associated', orderBy, order, ...currentSearch }));
    dispatch(fetchPendingViolations({ status: 'Pending', orderBy, order, ...currentSearch }));
    dispatch(fetchUnassociatedViolations({ status: 'Unassociated', orderBy, order, ...currentSearch }));
    return () => {
      dispatch(clearAssociatedSearch());
      dispatch(clearPendingSearch());
      dispatch(clearUnassociatedSearch());
      dispatch(clearUnMatchedSearch());
    };
  }, [dispatch, page, state, keyword, activity, orderBy, order, pageSize, matchType, currentSearch]);

  const getState = () => USAStates.find(({ value }) => value === state);

  const gridFilters = ['page', 'pageSize', 'orderBy', 'order'];
  const isFiltered = Object.keys(currentSearch).filter(search => !gridFilters.some(filter => filter === search)).length;

  return (
    <Paper className={classes.root}>
      <GridContainer style={{ padding: 0 }}>
        <Grid style={{ width: '100%', padding: 12 }}>
          <VerificationHeader />
          <Grid className={classes.buttons}>
            <FiltersDrawer
              isFiltered={isFiltered}
              initialValues={{ state: getState(), keyword, activity, automaticMatches: matchType }}
            />
          </Grid>
        </Grid>
        <TabFilter />
        <ViolationsTable />
      </GridContainer>
    </Paper>
  );
};
