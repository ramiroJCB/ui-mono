import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ProgramStatusFormFilters } from '../components/ProgramStatusReportFilters';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'combineReducers';
import { $top, fetchProgramStatusData } from '../actions/fetchProgramStatusData';
import { ProgramStatusReport } from '../components/ProgramStatusReport';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';

export const ProgramStatusReportContainer = () => {
  const dt = DateTime.local();

  const { programStatusData, isFetching, total, error } = useSelector((state: RootState) => state.programStatusData);
  const { clients } = useSelector((state: RootState) => state.safetyProgramClients);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    history.push({
      search: merge(location.search, {
        page: page.toString()
      })
    });
  };

  useEffect(() => {
    const { page, startDate, endDate } = parse(location.search);
    if (page && startDate && endDate) {
      dispatch(fetchProgramStatusData(page.toString(), startDate.toString(), endDate.toString()));
    }
  }, [location.search, dispatch]);

  const { page = '0', startDate, endDate, allClients = 'true', clientIds } = parse(location.search);
  const defaultFilters = {
    beginDateUtc: startDate?.toString() ?? '',
    endDateUtc: endDate?.toString() ?? '',
    isForAllClients: allClients === 'true',
    clients: clientIds ? clients?.filter(x => clientIds.includes(x.id) === true) : [],
    timezone: dt.zoneName
  };

  return (
    <GridContainer style={{ padding: 0 }}>
      <Grid item xs={12}>
        <ProgramStatusFormFilters initialValues={defaultFilters} />
      </Grid>
      <ProgramStatusReport
        total={total}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        error={error}
        onChangePage={handlePageChange}
        programStatusData={programStatusData}
        isFetching={isFetching}
      />
    </GridContainer>
  );
};
