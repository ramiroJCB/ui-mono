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
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClient } from 'interfaces/client';
import { IExpandedMandate } from 'interfaces/mandate';
import { Link } from 'react-router-dom';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { TooltipList } from 'components/TooltipList';
import { useTranslation } from 'react-i18next';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { localizeDate, localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  clientId: string;
  client: DeepReadonly<IClient> | null;
  mandates: DeepReadonly<IExpandedMandate[]> | null;
  total: number | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
};

export const MandatesComponent: React.FC<Props> = ({
  clientId,
  client,
  mandates,
  total,
  isFetching,
  error,
  onChangePage,
  page,
  rowsPerPage
}) => {
  const { t } = useTranslation();
  const title = !isFetching && client ? client.name : '⋯';

  const classes = useSharedTableStyles();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Breadcrumbs
          links={[
            {
              to: '/safety-programs/clients',
              children: t('safetyPrograms.common.assignSafetyPrograms', 'Assign Program Reviews')
            },
            {
              to: `/safety-programs/clients/${clientId}`,
              children: title
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <GridContainer justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to={`/safety-programs/clients/${clientId}/mandates/add`}
              >
                <AddIcon />
                {t('safetyPrograms.common.assignProgram', 'Assign Program')}
              </Button>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>
                    {t('safetyPrograms.common.safetyProgram', 'Program')}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {t('safetyPrograms.mandates.assignees', 'Assignees')}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {t('safetyPrograms.common.lastChange', 'Last Change')}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {t('safetyPrograms.common.gracePeriodEnd', 'Grace Period End')}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {t('safetyPrograms.common.changedBy', 'Changed By')}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    {t('safetyPrograms.common.edit', 'Edit')}
                  </TableCell>
                </TableRow>
              </TableHead>
              {mandates && (
                <TableBody>
                  {mandates.length > 0 ? (
                    mandates.map(
                      ({
                        id,
                        safetyProgram,
                        businessUnits,
                        regionalServices,
                        updatedBy,
                        updatedDateUtc,
                        gracePeriodExpirationDateUtc
                      }) => {
                        const date = new Date(updatedDateUtc);
                        const gracePeriodEndDate = gracePeriodExpirationDateUtc
                          ? localizeDate(gracePeriodExpirationDateUtc, t)
                          : '';

                        return (
                          <LinkedRow key={id} to={`/safety-programs/clients/${clientId}/mandates/${id}`}>
                            <TableCell>{safetyProgram.title}</TableCell>
                            <TableCell>
                              {businessUnits.length > 0 ? (
                                <TooltipList
                                  placement="right"
                                  items={businessUnits.map(({ id, description: name }) => ({
                                    id,
                                    name
                                  }))}
                                >
                                  {t('safetyPrograms.mandates.businessUnitsCount', {
                                    count: businessUnits.length,
                                    defaultValue_plural: 'Business Units',
                                    defaultValue: 'Business Unit'
                                  })}
                                </TooltipList>
                              ) : regionalServices.length > 0 ? (
                                <TooltipList
                                  placement="right"
                                  items={regionalServices.map(({ id, serviceRegionName, serviceName }) => ({
                                    id,
                                    name: `${serviceRegionName}: ${serviceName}`
                                  }))}
                                >
                                  {t('safetyPrograms.mandates.regionalServicesCount', {
                                    count: regionalServices.length,
                                    defaultValue_plural: 'Services',
                                    defaultValue: 'Service'
                                  })}
                                </TooltipList>
                              ) : (
                                t('safetyPrograms.common.allContractors', 'All Contractors')
                              )}
                            </TableCell>
                            <TableCell title={localizeDateTime(date, t)}>{localizeDate(date, t)}</TableCell>
                            <TableCell title={gracePeriodEndDate}>{gracePeriodEndDate}</TableCell>
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
                          : t('safetyPrograms.mandates.pleaseAssignProgram', 'Please assign a program to get started.')}
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
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
