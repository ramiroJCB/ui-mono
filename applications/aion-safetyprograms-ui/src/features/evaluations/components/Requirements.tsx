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
import { CommentsBadge } from 'components/CommentsBadge';
import { DeepReadonly } from 'utility-types';
import { FiltersDrawer } from 'features/filters/components/Drawer';
import { getClientExceptions } from 'helpers/getClientExceptions';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IExpandedRequirement } from 'interfaces/requirement';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { RequirementStatusComponent } from 'features/requirement/components/Status';
import { sortGracePeriodEffectiveDates } from 'helpers/sortGracePeriodEffectiveDates';
import { SortableTableCell } from 'components/SortableTableCell';
import { TooltipList } from 'components/TooltipList';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useTranslation } from 'react-i18next';
import { TableContainer } from '@material-ui/core';
import { localizeDate, localizeNumber, localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  requirements: DeepReadonly<IExpandedRequirement[]> | null;
  total: number | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
  handleHeaderClick: (orderby: string) => () => void;
  isFiltered: boolean;
  orderby: string;
};

export const EvaluationsRequirementsComponent: React.FC<Props> = ({
  requirements,
  total,
  isFetching,
  error,
  onChangePage,
  page,
  rowsPerPage,
  handleHeaderClick,
  isFiltered,
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ whiteSpace: 'nowrap', fontSize: 16 }}>
                    {t('safetyPrograms.common.companyID', 'Company ID')}
                  </TableCell>
                  <SortableTableCell
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="requirementStatus"
                    align="center"
                  >
                    {t('safetyPrograms.common.status', 'Status')}
                  </SortableTableCell>
                  <SortableTableCell handleClick={handleHeaderClick} orderby={orderby} property="contractorName">
                    {t('safetyPrograms.common.contractor', 'Contractor')}
                  </SortableTableCell>
                  <SortableTableCell handleClick={handleHeaderClick} orderby={orderby} property="safetyProgramTitle">
                    {t('safetyPrograms.common.safetyProgram', 'Program')}
                  </SortableTableCell>
                  <SortableTableCell
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="numberOfComments"
                    align="right"
                  >
                    {t('safetyPrograms.common.comments', 'Comments')}
                  </SortableTableCell>
                  <SortableTableCell
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="numberOfClients"
                    align="right"
                  >
                    {t('safetyPrograms.common.clients', 'Clients')}
                  </SortableTableCell>
                  <SortableTableCell
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="nearestGracePeriodExpirationDate"
                  >
                    {t('safetyPrograms.common.gracePeriodEnd', 'Grace Period End')}
                  </SortableTableCell>
                  <SortableTableCell
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="lastContractorActivityDateUtc"
                  >
                    {t('safetyPrograms.common.lastActivity', 'Last Activity')}
                  </SortableTableCell>
                  <TableCell align="center" className={classes.tableCell}>
                    {t('safetyPrograms.common.exceptionsGranted', 'Exceptions Granted')}
                  </TableCell>
                  <TableCell align="center" className={classes.tableCell}>
                    {t('safetyPrograms.common.view', 'View')}
                  </TableCell>
                </TableRow>
              </TableHead>
              {requirements && (
                <TableBody>
                  {requirements.length > 0 ? (
                    requirements.map(
                      ({
                        id,
                        contractorCompanyNumber,
                        contractorName,
                        safetyProgramTitle,
                        numberOfComments,
                        hasUnreadContractorComments,
                        status,
                        clients,
                        clientScoreOverrides,
                        clientGracePeriods,
                        lastContractorActivityDateUtc
                      }) => {
                        const date = lastContractorActivityDateUtc && new Date(lastContractorActivityDateUtc);
                        const clientExceptions = getClientExceptions(clientScoreOverrides, clients);
                        const clientsWithGracePeriods = sortGracePeriodEffectiveDates(
                          clientGracePeriods.filter(
                            ({ effectiveGracePeriod, gracePeriodExpirationDateForClient }) =>
                              effectiveGracePeriod !== null || gracePeriodExpirationDateForClient !== null
                          ),
                          'desc'
                        );

                        return (
                          <LinkedRow key={id} to={`/safety-program-requirements/${id}`}>
                            <TableCell align="left">{contractorCompanyNumber}</TableCell>
                            <TableCell align="center">
                              <RequirementStatusComponent status={status} iconOnly />
                            </TableCell>
                            <TableCell>{contractorName}</TableCell>
                            <TableCell>{safetyProgramTitle}</TableCell>
                            <TableCell align="center">
                              <CommentsBadge
                                hasUnreadComments={hasUnreadContractorComments}
                                numberOfComments={numberOfComments}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TooltipList
                                placement="right"
                                items={clients.map(({ id, name }) => ({
                                  id,
                                  name
                                }))}
                              >
                                <React.Fragment>{localizeNumber(clients.length, t)}</React.Fragment>
                              </TooltipList>
                            </TableCell>
                            <TableCell>
                              {clientsWithGracePeriods.length > 1
                                ? t('safetyPrograms.common.multiple', 'Multiple')
                                : clientsWithGracePeriods[0] &&
                                  clientsWithGracePeriods[0].effectiveGracePeriod &&
                                  localizeDate(clientsWithGracePeriods[0].effectiveGracePeriod, t)}
                            </TableCell>
                            <TableCell title={date ? localizeDateTime(date, t) : undefined}>
                              {date && localizeDate(date, t)}
                            </TableCell>
                            <TableCell align="center">
                              {clientExceptions.length > 0 ? (
                                <TooltipList placement="right" items={clientExceptions}>
                                  <React.Fragment>{localizeNumber(clientExceptions.length, t)}</React.Fragment>
                                </TooltipList>
                              ) : (
                                0
                              )}
                            </TableCell>
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
          </TableContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
