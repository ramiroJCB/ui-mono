import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { CurrentStatus } from 'interfaces/inspection';
import { Error } from '@pec/aion-ui-components/components/Error';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { inspectionsSelectors } from '../../inspections/slice';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Link, useParams } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Table } from '@pec/aion-ui-components/components/Table/Table';
import { Tabs } from './Tabs';
import { usePermission } from 'common/hooks/usePermission';
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
  contractorName: string;
  status: React.ReactNode;
  attachmentCount: string;
  dateOfInspectionUtc: string;
  createdBy: string;
};

export const DesktopInspections: React.FC = () => {
  const { hasContractorReviewsManagePermission } = usePermission();
  const classes = useStyles();
  const { organizationId } = useParams<{ organizationId: string }>();

  const { isFetching, error, total } = useTypedSelector(state => state.inspections);
  const inspections = useTypedSelector(inspectionsSelectors.selectAll);

  const { handlePageChange, handleRowSelect, handleSort, order, orderBy, pageSize, currentPage } = useTable(
    defaultPageSize
  );

  const headers: ITableHeader[] = [
    { id: 'displayId', label: 'ID', columnWidth: '10%' },
    { id: 'formName', label: 'Evaluation Protocol', columnWidth: '20%' },
    { id: 'contractorName', label: 'Contractor', columnWidth: '25%' },
    { id: 'status', label: 'Status', columnWidth: '10%' },
    { id: 'attachmentCount', label: 'Attachments', align: 'right', columnWidth: '10%' },
    { id: 'dateOfInspectionUtc', label: 'Review Date', isSortable: true, columnWidth: '10%' },
    { id: 'createdBy', label: 'Added By', columnWidth: '15%' }
  ];

  const options: AllReviewsTable[] = inspections.map(
    ({
      id,
      displayId,
      formName,
      contractorName,
      status,
      attachmentCount,
      dateOfInspectionUtc,
      createdByUserFirstName,
      createdByUserLastName
    }) => ({
      id,
      displayId,
      formName,
      contractorName,
      status: (
        <Typography variant="body2" color={status === CurrentStatus.InProgress ? 'error' : 'secondary'}>
          {status === CurrentStatus.InProgress ? 'In Progress' : 'Submitted'}
        </Typography>
      ),
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
            {hasContractorReviewsManagePermission && (
              <Grid item className={classes.item}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  component={Link}
                  to={`/${organizationId}/reviews/add`}
                >
                  <AddIcon className={classes.leftIcon} />
                  New Review
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Tabs />
            <Divider />
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
