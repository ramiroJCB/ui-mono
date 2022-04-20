import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useTranslation } from 'react-i18next';
import { IProgramStatus } from 'interfaces/programStatus';
import moment from 'moment';
import { Box, Typography } from '@material-ui/core';

type Props = {
  programStatusData: DeepReadonly<IProgramStatus[]> | null;
  total: number | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
};

export const ProgramStatusReport: React.FC<Props> = ({
  programStatusData,
  total,
  isFetching,
  error,
  onChangePage,
  page,
  rowsPerPage
}) => {
  const classes = useSharedTableStyles();
  const { t } = useTranslation();

  const formatPercentage = (value: number) => Math.round(value * 100);

  return (
    <GridContainer justify="space-between" alignItems="center">
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <Box p={2}>
            <Typography variant="subtitle2">*Data below reflects all clients </Typography>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left" className={classes.tableCell}>
                  Created Date
                </TableCell>
                <TableCell align="left" className={classes.tableCell}>
                  SPE Compliance
                </TableCell>
                <TableCell className={classes.tableCell} align="left">
                  VF Responsible
                </TableCell>
                <TableCell className={classes.tableCell} align="left">
                  Contractor Responsible
                </TableCell>
              </TableRow>
            </TableHead>
            {programStatusData && (
              <TableBody>
                {programStatusData.length > 0 ? (
                  programStatusData.map(
                    ({ speCompliance, vfResponsible, contractorResponsible, id, createdDateUtc }) => {
                      return (
                        <TableRow key={id}>
                          <TableCell align="left">
                            {moment(createdDateUtc)
                              .utc()
                              .format('YYYY-MM-DD')}
                          </TableCell>
                          <TableCell align="left">{formatPercentage(speCompliance)}%</TableCell>
                          <TableCell align="left">{formatPercentage(vfResponsible)}%</TableCell>
                          <TableCell align="left">{formatPercentage(contractorResponsible)}%</TableCell>
                        </TableRow>
                      );
                    }
                  )
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
