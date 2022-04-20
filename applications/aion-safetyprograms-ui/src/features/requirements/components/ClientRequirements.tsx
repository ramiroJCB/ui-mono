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
import { FiltersDrawer } from 'features/filters/components/Drawer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientRequirement } from 'interfaces/requirement';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { RequirementStatusComponent } from 'features/requirement/components/Status';
import { SortableTableCell } from 'components/SortableTableCell';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';
import { getClientOverrideStatusGridDisplayValue } from 'helpers/getStatusDisplayValues';
import TableContainer from '@material-ui/core/TableContainer/TableContainer';

type Props = {
  organizationId: string;
  requirements: DeepReadonly<IClientRequirement[]> | null;
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

export const ClientRequirementsComponent: React.FC<Props> = ({
  organizationId,
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
                  <TableCell className={classes.tableCell} align="left" style={{ whiteSpace: 'nowrap' }}>
                    {t('safetyPrograms.common.companyID', 'Company ID')}
                  </TableCell>
                  <SortableTableCell
                    className={classes.tableCell}
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="safetyProgramRequirementStatus"
                    align="center"
                  >
                    {t('safetyPrograms.common.status', 'Status')}
                  </SortableTableCell>
                  <SortableTableCell
                    className={classes.tableCell}
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="contractorName"
                  >
                    {t('safetyPrograms.common.contractor', 'Contractor')}
                  </SortableTableCell>
                  <SortableTableCell
                    className={classes.tableCell}
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="safetyProgramTitle"
                  >
                    {t('safetyPrograms.common.safetyProgram', 'Program')}
                  </SortableTableCell>
                  <SortableTableCell
                    className={classes.tableCell}
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="numberOfComments"
                    align="center"
                  >
                    {t('safetyPrograms.common.comments', 'Comments')}
                  </SortableTableCell>
                  <SortableTableCell
                    className={classes.tableCell}
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="effectiveGracePeriod"
                  >
                    {t('safetyPrograms.common.gracePeriodEnd', 'Grace Period End')}
                  </SortableTableCell>
                  <SortableTableCell
                    className={classes.tableCell}
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="lastContractorActivityDateUtc"
                  >
                    {t('safetyPrograms.common.lastActivity', 'Last Activity')}
                  </SortableTableCell>
                  <SortableTableCell
                    className={classes.tableCell}
                    handleClick={handleHeaderClick}
                    orderby={orderby}
                    property="overrideStatus"
                    align="left"
                  >
                    {t('safetyPrograms.requirements.exception', 'Exception')}
                  </SortableTableCell>
                  <TableCell className={classes.tableCell} align="center">
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
                        overrideStatus,
                        effectiveGracePeriod,
                        safetyProgramRequirementStatus,
                        safetyProgramRequirementId,
                        lastContractorActivityDateUtc
                      }) => {
                        const date = lastContractorActivityDateUtc && new Date(lastContractorActivityDateUtc);

                        return (
                          <LinkedRow
                            key={id}
                            to={`/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}`}
                          >
                            <TableCell align="left">{contractorCompanyNumber}</TableCell>
                            <TableCell align="center">
                              <RequirementStatusComponent status={safetyProgramRequirementStatus} iconOnly />
                            </TableCell>
                            <TableCell>{contractorName}</TableCell>
                            <TableCell>{safetyProgramTitle}</TableCell>
                            <TableCell align="center">{numberOfComments}</TableCell>
                            <TableCell>{effectiveGracePeriod && localizeDate(effectiveGracePeriod, t)}</TableCell>
                            <TableCell title={date ? localizeDateTime(date, t) : undefined}>
                              {date && localizeDate(date, t)}
                            </TableCell>
                            <TableCell align="left">
                              {overrideStatus && getClientOverrideStatusGridDisplayValue(overrideStatus, t)}
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
