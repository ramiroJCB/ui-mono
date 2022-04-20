import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Error } from '@pec/aion-ui-components/components/Error';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { formsSelectors } from './slice';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Link, useParams } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Table } from '@pec/aion-ui-components/components/Table/Table';
import { usePermission } from 'common/hooks/usePermission';
import { useTable } from 'common/hooks/useTable';
import { useTypedSelector } from 'app/reducer';

export const defaultPageSize = 10;
export const defaultPage = 1;

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    margin: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
    alignItems: 'center'
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  }
}));

type AllFormsTable = {
  id: string;
  name: string;
  status: React.ReactNode;
  createdBy: string;
  createdDateUtc: string;
};

export const FormsList: React.FC = () => {
  const classes = useStyles();
  const { hasFormsWritePermission } = usePermission();
  const forms = useTypedSelector(formsSelectors.selectAll);
  const { organizationId } = useParams<{ organizationId: string }>();
  const { isFetching, error } = useTypedSelector(state => state.forms);
  const { handleRowSelect, handleSort, order, orderBy } = useTable(defaultPageSize);

  const headers: ITableHeader[] = [
    { id: 'name', label: 'Title', columnWidth: '45%' },
    { id: 'status', label: 'Status' },
    { id: 'createdBy', label: 'Created By' },
    { id: 'createdDateUtc', label: 'Date Created' }
  ];

  const options: AllFormsTable[] = forms.map(
    ({ id, name, status, createdByUserFirstName, createdByUserLastName, createdDateUtc }) => ({
      id,
      name,
      status,
      createdDateUtc: formatDate(createdDateUtc),
      createdBy: `${createdByUserFirstName} ${createdByUserLastName}`
    })
  );

  return (
    <Grid container>
      <Grid container item justify="space-between" className={classes.header}>
        <Grid item>
          <Typography variant="h6">Forms</Typography>
        </Grid>
        {hasFormsWritePermission && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              component={Link}
              to={`/${organizationId}/forms/add`}
            >
              <AddIcon className={classes.leftIcon} />
              New Form
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
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
          />
        ) : (
          <Error message="There was an error processing your request." />
        )}
      </Grid>
    </Grid>
  );
};
