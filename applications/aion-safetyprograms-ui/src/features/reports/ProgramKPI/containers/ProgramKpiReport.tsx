import React from 'react';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { DateTime } from 'luxon';
import { ProgramKpiReportFormFilters } from '../components/ProgramKpiReportFilters';

export const ProgramKpiReportContainer = () => {
  const dt = DateTime.local();

  const defaultFilters = {
    beginDateUtc: dt.minus({ years: 1 }).toLocaleString(),
    endDateUtc: DateTime.now().toLocaleString(),
    timezone: dt.zoneName
  };

  return (
    <GridContainer style={{ padding: 0 }}>
      <Grid item xs={12}>
        <ProgramKpiReportFormFilters initialValues={defaultFilters} />
      </Grid>
    </GridContainer>
  );
};
