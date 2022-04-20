import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
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
import { ISafetyProgram, SafetyProgramStatus } from 'interfaces/safetyProgram';
import { Link } from 'react-router-dom';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { Search } from '@pec/aion-ui-components/components/Search';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeDateTime, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  safetyPrograms: DeepReadonly<ISafetyProgram[]> | null;
  total: number | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  searchTerm: string;
  handleSearch: (searchTerm: string) => void;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
};

export const SafetyProgramsComponent: React.FC<Props> = ({
  safetyPrograms,
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
      <Grid item xs={12}>
        <Typography variant="h6">{t('safetyPrograms.common.programEditor', 'Program Editor')}</Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          style={{ marginRight: 20 }}
          color="secondary"
          component={Link}
          to="/safety-programs/add"
        >
          <AddIcon />
          {t('safetyPrograms.common.addProgram', 'Add Program')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/safety-programs/edit-shop-links"
          disabled={isFetching}
        >
          {t('safetyPrograms.common.editShopLinks', 'Edit Shop Links')}
        </Button>
      </Grid>
      <Grid item>
        <Search
          isFetching={isFetching}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          label={t('safetyPrograms.safetyPrograms.searchProgramName', 'Search Program Name')}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  {t('safetyPrograms.common.programName', 'Program Name')}
                </TableCell>
                <TableCell className={classes.tableCell}>{t('safetyPrograms.common.status', 'Status')}</TableCell>
                <TableCell className={classes.tableCell} align="right">
                  {t('safetyPrograms.common.questions', 'Questions')}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {t('safetyPrograms.common.gracePeriodEnd', 'Grace Period End')}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {t('safetyPrograms.common.lastChange', 'Last Change')}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {t('safetyPrograms.common.changedBy', 'Changed By')}
                </TableCell>
                <TableCell align="center">{t('safetyPrograms.common.edit', 'Edit')}</TableCell>
              </TableRow>
            </TableHead>
            {safetyPrograms && (
              <TableBody>
                {safetyPrograms.length > 0 ? (
                  safetyPrograms.map(
                    ({ id, title, questionCount, gracePeriodExpirationDateUtc, status, updatedBy, updatedDateUtc }) => {
                      const date = new Date(updatedDateUtc);
                      return (
                        <LinkedRow key={id} to={`/safety-programs/${id}`}>
                          <TableCell>{title}</TableCell>
                          <TableCell>
                            {status === SafetyProgramStatus.Valid
                              ? t('safetyPrograms.safetyPrograms.valid', 'Valid')
                              : t('safetyPrograms.safetyPrograms.invalid', 'Invalid')}
                          </TableCell>
                          <TableCell align="right">{localizeNumber(questionCount, t)}</TableCell>
                          <TableCell>
                            {gracePeriodExpirationDateUtc
                              ? localizeDate(new Date(gracePeriodExpirationDateUtc), t)
                              : ''}
                          </TableCell>
                          <TableCell title={localizeDateTime(date, t)}>{localizeDate(date, t)}</TableCell>
                          <TableCell>{updatedBy}</TableCell>
                          <TableCell align="center">
                            <EditIcon fontSize="small" color="action" />
                          </TableCell>
                        </LinkedRow>
                      );
                    }
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {total
                        ? t('safetyPrograms.common.noResultsFound', 'No results found. Please refine your search.')
                        : t('safetyPrograms.safetyPrograms.pleaseAddProgram', 'Please add a program to get started.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
            {total !== null && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    style={{ borderBottom: 0 }}
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
