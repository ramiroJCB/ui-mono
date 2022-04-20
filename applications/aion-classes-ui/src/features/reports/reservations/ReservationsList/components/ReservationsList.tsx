import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClassReservationAggregate } from 'interfaces/classReservationAggregate';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TablePagination } from '@pec/aion-ui-components/components/Table/TablePagination';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { localizeCurrency, localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    iconButton: {
      padding: theme.spacing()
    },
    paper: {
      overflow: 'auto'
    },
    sortIcon: {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  });

type OwnProps = {
  classReservationAggregates: DeepReadonly<IClassReservationAggregate[]> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  total: number | null;
  handleChangeSortOrder: (event: React.SyntheticEvent) => void;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
  sortOrder: 'asc' | 'desc';
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  classes,
  classReservationAggregates,
  error,
  handleChangeSortOrder,
  isFetching,
  onChangePage,
  page,
  sortOrder,
  rowsPerPage,
  total
}) => {
  const { t } = useTranslation();

  return (
    <Paper hasError={!!error} isLoading={isFetching} className={classes.paper}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('classes.common.courseName', 'Course Name')}</TableCell>
              <TableCell>{t('classes.reservationsReport.list.provider', 'Provider')}</TableCell>
              <TableCell>{t('classes.common.instructor', 'Instructor')}</TableCell>
              <TableCell>{t('classes.common.trainingLocation', 'Training Location')}</TableCell>
              <TableCell align="right">{t('classes.reservationsReport.list.classDate', 'Class Date')}</TableCell>
              <TableCell>{t('classes.reservationsReport.list.languages', 'Languages')}</TableCell>
              <TableCell>{t('classes.common.organization', 'Organization')}</TableCell>
              <TableCell align="right">{t('classes.reservationsReport.list.maxRes', 'Max Res.')}</TableCell>
              <TableCell align="right">{t('classes.common.seats', 'Seats')}</TableCell>
              <TableCell align="right">{t('classes.reservationsReport.list.priceStudent', 'Price/Student')}</TableCell>
              <TableCell align="right">{t('classes.reservationsReport.list.amount', 'Res. Amount')}</TableCell>
              <TableCell>{t('classes.reservationsReport.list.createdBy', 'Created By')}</TableCell>
              <TableCell align="right">
                <Tooltip
                  title={t('classes.reservationsReport.list.sortBy', 'Sort by Latest or Oldest').toString()}
                  enterDelay={300}
                >
                  <IconButton
                    aria-label={t('classes.reservationsReport.list.changeSortOrder', 'Change Sort Order')}
                    onClick={handleChangeSortOrder}
                    classes={{ root: classes.iconButton }}
                  >
                    <TableSortLabel active direction={sortOrder} classes={{ icon: classes.sortIcon }} />
                  </IconButton>
                </Tooltip>
                {t('classes.reservationsReport.list.dateCreated', 'Date Created')}
              </TableCell>
              <TableCell>{t('classes.reservationsReport.list.updatedBy', 'Updated By')}</TableCell>
              <TableCell align="right">{t('classes.reservationsReport.list.dateUpdated', 'Date Updated')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classReservationAggregates && classReservationAggregates.length > 0 ? (
              classReservationAggregates.map(
                ({
                  id,
                  program,
                  trainingProvider,
                  primaryInstructor,
                  location,
                  trainingClassStartDateUtc,
                  supportedLanguages,
                  organizationName,
                  maxReservations,
                  reservedSeatsCount,
                  pricePerStudent,
                  createdBy,
                  reservationCreatedDateUtc,
                  updatedBy,
                  reservationUpdatedDateUtc
                }) => {
                  const price = Number(pricePerStudent);
                  const reservationAmount = price * reservedSeatsCount;
                  return (
                    <TableRow key={id}>
                      <TableCell>{program.name}</TableCell>
                      <TableCell>{trainingProvider?.name || '--'}</TableCell>
                      <TableCell>
                        {primaryInstructor?.firstName} {primaryInstructor?.lastName}
                      </TableCell>
                      <TableCell align="right">
                        {location.city}, {location.state}
                      </TableCell>
                      <TableCell align="right">{localizeDate(trainingClassStartDateUtc, t)}</TableCell>
                      <TableCell>{supportedLanguages.join(', ')}</TableCell>
                      <TableCell>{organizationName}</TableCell>
                      <TableCell align="right">{maxReservations}</TableCell>
                      <TableCell align="right">{reservedSeatsCount}</TableCell>
                      <TableCell align="right">{localizeCurrency(price, t)}</TableCell>
                      <TableCell align="right">{localizeCurrency(reservationAmount, t)}</TableCell>
                      <TableCell>{createdBy.fullName}</TableCell>
                      <TableCell align="right">{localizeDate(reservationCreatedDateUtc, t)}</TableCell>
                      <TableCell>{updatedBy?.fullName || '--'}</TableCell>
                      <TableCell align="right">
                        {reservationUpdatedDateUtc ? localizeDate(reservationCreatedDateUtc, t) : '--'}
                      </TableCell>
                    </TableRow>
                  );
                }
              )
            ) : (
              <TableRow>
                <TableCell colSpan={15} align="center">
                  {t(
                    'classes.reservationsReport.list.noReservations',
                    'There are no Reservations matching your search criteria.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {total !== null && (
        <TablePagination
          component="div"
          totalCount={total}
          handleChangePage={onChangePage}
          page={page}
          rowsPerPage={rowsPerPage}
        />
      )}
    </Paper>
  );
};

export const ReservationsListComponent = withStyles(styles)(Component);
