import * as React from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { IClientRequirementOverride } from 'interfaces/requirementOverride';
import { useTranslation } from 'react-i18next';
import { FiltersDrawer } from 'features/filters/components/Drawer';
import { SortableTableCell } from 'components/SortableTableCell';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  organizationId: string;
  requirementOverrides: DeepReadonly<IClientRequirementOverride[]> | null;
  total: number | null;
  isFetching: boolean;
  isFiltered: boolean;
  error: DeepReadonly<AxiosError> | null;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
  handleHeaderClick: (orderby: string) => () => void;
  orderby: string;
};

export const ExceptionRequestsComponent: React.FC<Props> = ({
  organizationId,
  requirementOverrides,
  total,
  isFetching,
  isFiltered,
  error,
  onChangePage,
  page,
  rowsPerPage,
  handleHeaderClick,
  orderby
}) => {
  const classes = useSharedTableStyles();
  const { t } = useTranslation();

  return (
    <GridContainer alignItems="center" spacing={0}>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <GridContainer justify="space-between" alignItems="center">
            <Grid item>
              <Typography color="textPrimary" align="right">
                {t('safetyPrograms.common.tip', 'Tip: Bookmark this page to save your sorting and filtering options.')}
              </Typography>
            </Grid>
            <Grid item>
              <FiltersDrawer isFiltered={isFiltered} />
            </Grid>
          </GridContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell} align="left" style={{ whiteSpace: 'nowrap' }}>
                  {t('safetyPrograms.common.companyID', 'Company ID')}
                </TableCell>
                <TableCell className={classes.tableCell} align="left" style={{ whiteSpace: 'nowrap' }}>
                  {t('safetyPrograms.common.contractor', 'Contractor')}
                </TableCell>
                <TableCell className={classes.tableCell} align="left" style={{ whiteSpace: 'nowrap' }}>
                  {t('safetyPrograms.common.safetyProgram', 'Program')}
                </TableCell>
                <SortableTableCell handleClick={handleHeaderClick} orderby={orderby} property="requestUpdatedDateUtc">
                  {t('safetyPrograms.exceptionRequests.submitted', 'Submitted')}
                </SortableTableCell>
                <TableCell className={classes.tableCell} align="left" style={{ whiteSpace: 'nowrap' }}>
                  {t('safetyPrograms.exceptionRequests.requestedBy', 'Requested By')}
                </TableCell>
                <TableCell className={classes.tableCell} align="center">
                  {t('safetyPrograms.common.view', 'View')}
                </TableCell>
              </TableRow>
            </TableHead>
            {requirementOverrides && (
              <TableBody>
                {requirementOverrides.length > 0 ? (
                  requirementOverrides.map(
                    ({
                      id,
                      contractorCompanyNumber,
                      contractorName,
                      safetyProgramName,
                      requestUpdatedBy,
                      requestUpdatedDateUtc,
                      requirementClient
                    }) => {
                      const date = new Date(requestUpdatedDateUtc);
                      return (
                        <LinkedRow
                          key={id}
                          to={`/organizations/${organizationId}/safety-program-requirements/requests/${requirementClient.safetyProgramRequirementId}/exceptions`}
                        >
                          <TableCell align="left">{contractorCompanyNumber}</TableCell>
                          <TableCell>{contractorName}</TableCell>
                          <TableCell>{safetyProgramName}</TableCell>
                          <TableCell>{localizeDate(date, t)}</TableCell>
                          <TableCell>{requestUpdatedBy}</TableCell>
                          <TableCell align="center">
                            <ChevronRightIcon color="action" />
                          </TableCell>
                        </LinkedRow>
                      );
                    }
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      {t(
                        'safetyPrograms.common.pleaseRefineYourFilters',
                        'No results found. Please refine your filters.'
                      )}
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
