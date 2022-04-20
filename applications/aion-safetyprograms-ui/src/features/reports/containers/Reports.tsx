import React from 'react';
import { Select, Grid, Typography, InputLabel, MenuItem, Box } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useTranslation } from 'react-i18next';
import { ProgramStatusReportContainer } from '../programStatus/containers/ProgramStatusReport';
import { Paper } from 'components/Paper';
import { ProgramKpiReportContainer } from '../ProgramKPI/containers/ProgramKpiReport';

export const ReportsContainer = () => {
  const { t } = useTranslation();

  const [state, setState] = React.useState<{ reportName: string }>({
    reportName: 'programStatus'
  });

  const handleChange = (event: React.ChangeEvent<{ reportName?: string; value: string }>) => {
    setState({
      ...state,
      reportName: event.target.value
    });
  };
  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography variant="h6">{t('safetyPrograms.common.reports', 'Reports')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Box p={1}>
            <InputLabel id="label">Select a report</InputLabel>
            <Select labelId="label" id="select" value={state.reportName} onChange={handleChange}>
              <MenuItem value="programStatus">Program Status</MenuItem>
              <MenuItem value="programKpi">Program KPI</MenuItem>
            </Select>
          </Box>
          {state.reportName === 'programStatus' ? <ProgramStatusReportContainer /> : <ProgramKpiReportContainer />}
        </Paper>
      </Grid>
    </GridContainer>
  );
};
