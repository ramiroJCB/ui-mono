import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Error } from '@pec/aion-ui-components/components/Error';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { inspectionsSelectors } from 'features/inspections/slice';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Table } from '@pec/aion-ui-components/components/Table/Table';
import { useTable } from 'common/hooks/useTable';
import { useTypedSelector } from 'app/reducer';

export const defaultPageSize = 10;
export const defaultPage = 1;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  item: {
    padding: theme.spacing(4)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  noReviews: {
    padding: theme.spacing(4)
  }
}));

type AllReviewsTable = {
  id: string;
  displayId: number;
  formName: string;
  clientName: string;
  attachmentCount: string;
  dateOfInspectionUtc: string;
  createdBy: string;
};

export const DesktopInspections: React.FC = () => {
  const classes = useStyles();

  const { isFetching, error, total } = useTypedSelector(state => state.inspections);
  const inspections = useTypedSelector(inspectionsSelectors.selectAll);

  const { handlePageChange, handleRowSelect, handleSort, order, orderBy, pageSize, currentPage } = useTable(
    defaultPageSize
  );

  const headers: ITableHeader[] = [
    { id: 'displayId', label: 'ID', columnWidth: '10%' },
    { id: 'formName', label: 'Evaluation Protocol', columnWidth: '25%' },
    { id: 'clientName', label: 'Client', columnWidth: '25%' },
    { id: 'attachmentCount', label: 'Attachments', align: 'right', columnWidth: '10%' },
    { id: 'dateOfInspectionUtc', label: 'Review Date', isSortable: true, columnWidth: '10%' },
    { id: 'createdBy', label: 'Added By', columnWidth: '20%' }
  ];

  const options: AllReviewsTable[] = inspections.map(
    ({
      id,
      displayId,
      formName,
      organizationName,
      attachmentCount,
      dateOfInspectionUtc,
      createdByUserFirstName,
      createdByUserLastName
    }) => ({
      id,
      displayId,
      formName,
      clientName: organizationName,
      attachmentCount: attachmentCount?.toLocaleString() || '0',
      dateOfInspectionUtc: formatDate(dateOfInspectionUtc),
      createdBy: `${createdByUserFirstName} ${createdByUserLastName}`
    })
  );

  return (
    <Grid container classes={{ root: classes.root }}>
      <Paper>
        <Grid container item>
          <Grid container justify="space-between">
            <Grid item className={classes.item}>
              <Typography variant="h5">Performance Management</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {!error ? (
              <Table
                size="medium"
                fixed
                headers={headers}
                options={options}
                isFetchingOptions={isFetching}
                handleRowSelect={handleRowSelect}
                handleSort={handleSort}
                order={order}
                orderBy={orderBy}
                pagingProps={{
                  currentPage,
                  pageSize,
                  onPageChange: handlePageChange,
                  totalOptionsCount: total
                }}
              />
            ) : (
              <Error message="There was an error processing your request." />
            )}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
