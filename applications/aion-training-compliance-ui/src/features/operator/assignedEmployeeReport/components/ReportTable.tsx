import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { CommonState } from '@pec/aion-ui-core/slices/common';
import { Error } from '@pec/aion-ui-components/components/Error';
import { ExportReportContainer } from '../containers/ExportReport';
import { FiltersDrawer } from '@pec/aion-ui-components/components/FiltersDrawer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IAssignedEmployeeReportFilters } from 'interfaces/assignedEmployeeReportFilters';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ReportFilters } from './ReportFilters';
import { ReportRow } from './ReportRow';
import { TablePagination } from '@pec/aion-ui-components/components/Table/TablePagination';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: '12px 24px',
    position: 'sticky',
    top: 56,
    [theme.breakpoints.up('sm')]: { top: 64 },
    'z-index': 1
  }
}));

type Props = {
  handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  page: number;
  report: IWorkGroupJobTypeEmployeeTraining[];
  initialValues: IAssignedEmployeeReportFilters;
  total: number;
  isFiltered: boolean;
  onSubmit: (values: IAssignedEmployeeReportFilters) => void;
} & CommonState;

export const ReportTable: React.FC<Props> = ({
  initialValues,
  report,
  isFetching,
  error,
  isFiltered,
  onSubmit,
  handlePageChange,
  page,
  total
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return report && !isFetching ? (
    <React.Fragment>
      <GridContainer>
        <Grid container item xs={12} justify="space-between" alignItems="center">
          <Grid item>
            <Header
              title={t(
                'trainingCompliance.operator.assignedEmployeeReport.assignedEmployees',
                'Assigned Employees Training Taken Report'
              )}
            />
          </Grid>
          <Grid item>
            <GridContainer>
              <Grid item>
                <ExportReportContainer hasReportContents={report.length > 0} />
              </Grid>
              <Grid item>
                <FiltersDrawer isFiltered={isFiltered}>
                  <ReportFilters initialValues={initialValues} onSubmit={onSubmit} />
                </FiltersDrawer>
              </Grid>
            </GridContainer>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {report.length > 0 ? (
            <React.Fragment>
              <Paper square className={classes.paper} elevation={1}>
                <GridContainer spacing={0}>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {t('trainingCompliance.operator.assignedEmployeeReport.employeeName', 'Employee Name')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {t('trainingCompliance.operator.assignedEmployeeReport.contractorName', 'Contractor Name')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {t('trainingCompliance.common.workGroup', 'Work Group')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">{t('trainingCompliance.common.jobType', 'Job Type')}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {t(
                        'trainingCompliance.operator.assignedEmployeeReport.trainingRequirement',
                        'Training Requirement'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {t('trainingCompliance.common.requirementStatus', 'Requirement Status')}
                    </Typography>
                  </Grid>
                </GridContainer>
              </Paper>
              {report.map(workGroupJobTypeEmployeeTraining => (
                <ReportRow
                  key={`${workGroupJobTypeEmployeeTraining.workGroupJobTypeEmployeeId}${workGroupJobTypeEmployeeTraining.trainingRequirementId}`}
                  workGroupJobTypeEmployeeTraining={workGroupJobTypeEmployeeTraining}
                />
              ))}
              <TablePagination component="div" handleChangePage={handlePageChange} page={page} totalCount={total} />
            </React.Fragment>
          ) : (
            <Paper className={classes.paper}>
              <Typography variant="subtitle1">
                {t(
                  'trainingCompliance.operator.assignedEmployeeReport.noRecords',
                  'No records match your search criteria.'
                )}
              </Typography>
            </Paper>
          )}
        </Grid>
      </GridContainer>
    </React.Fragment>
  ) : error ? (
    <Error />
  ) : (
    <Loading />
  );
};
