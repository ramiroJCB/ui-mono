import * as React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClient } from 'interfaces/client';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { Search } from '@pec/aion-ui-components/components/Search';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeDateTime, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  clients: DeepReadonly<IClient[]> | null;
  total: number | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  searchTerm: string;
  handleSearch: (searchTerm: string) => void;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
};

export const ClientsComponent: React.FC<Props> = ({
  clients,
  total,
  isFetching,
  error,
  searchTerm,
  handleSearch,
  onChangePage,
  page,
  rowsPerPage
}) => {
  const classes = useSharedTableStyles();
  const { t } = useTranslation();

  return (
    <GridContainer justify="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h6">
          {t('safetyPrograms.common.assignSafetyPrograms', 'Assign Program Reviews')}
        </Typography>
      </Grid>
      <Grid item>
        <Search
          isFetching={isFetching}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          label={t('safetyPrograms.clients.searchClientName', 'Search Client Name')}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  {t('safetyPrograms.clients.hiringClient', 'Hiring Client')}
                </TableCell>
                <TableCell className={classes.tableCell} align="center">
                  {t('safetyPrograms.common.programReviews', 'Program Reviews')}
                </TableCell>
                <TableCell className={classes.tableCell} align="left">
                  {t('safetyPrograms.common.lastChange', 'Last Change')}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {t('safetyPrograms.common.changedBy', 'Changed By')}
                </TableCell>
                <TableCell className={classes.tableCell} align="left">
                  {t('safetyPrograms.common.edit', 'Edit')}
                </TableCell>
              </TableRow>
            </TableHead>
            {clients && (
              <TableBody>
                {clients.length > 0 ? (
                  clients.map(({ id, name, mandateCount, updatedBy, updatedDateUtc }) => {
                    const date = new Date(updatedDateUtc);

                    return (
                      <LinkedRow key={id} to={`/safety-programs/clients/${id}`}>
                        <TableCell>{name}</TableCell>
                        <TableCell align="center">{localizeNumber(mandateCount, t)}</TableCell>
                        <TableCell title={localizeDateTime(date, t)}>{localizeDate(date, t)}</TableCell>
                        <TableCell>{updatedBy}</TableCell>
                        <TableCell align="left">
                          <EditIcon fontSize="small" color="action" />
                        </TableCell>
                      </LinkedRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {t('safetyPrograms.common.noResultsFound', 'No results found. Please refine your search.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
            {total !== null && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    className={classes.pagination}
                    count={total}
                    onChangePage={onChangePage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[]}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
