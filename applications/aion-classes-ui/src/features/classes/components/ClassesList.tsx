import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { FiltersDrawer } from 'features/filters/components/Drawer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { ISearchClassesForm } from 'interfaces/searchClassesForm';
import { IDistance } from 'interfaces/distance';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';
import { Link } from 'react-router-dom';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { SearchClassesForm } from './SearchClassesForm';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { getTotalSeatsAvailable } from 'helpers/reservations';
import { localizeCurrency, localizeDate, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { withTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    iconButton: {
      padding: theme.spacing()
    },
    sortIcon: {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  });

type OwnProps = {
  distances: IDistance[];
  trainingClasses: DeepReadonly<ITrainingClass[]> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  total: number | null;
  search: string;
  handleChangeSortOrder: (order: string) => void;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
  sortOrder: 'asc' | 'desc';
  isFiltered: boolean;
  searchClassesFormValues: ISearchClassesForm;
  submitSearchClassesForm: (values: ISearchClassesForm) => void;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  sortOrder: 'asc' | 'desc';
};

class ClassesList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sortOrder: props.sortOrder
    };
  }

  handleSortOrder = (_event: React.SyntheticEvent) => {
    const { sortOrder: prevSortOrder } = this.state;
    const sortOrder = prevSortOrder === 'asc' ? 'desc' : 'asc';

    this.setState({ sortOrder });
    this.props.handleChangeSortOrder(sortOrder);
  };

  render() {
    const {
      classes,
      distances,
      trainingClasses,
      search,
      error,
      isFetching,
      total,
      onChangePage,
      page,
      rowsPerPage,
      isFiltered,
      searchClassesFormValues,
      submitSearchClassesForm,
      t
    } = this.props;
    const { sortOrder: order } = this.state;

    return (
      <GridContainer justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h5">
            {t('classes.classesList.upcomingTrainingClasses', 'Upcoming Training Classes')}
          </Typography>
        </Grid>
        <Grid item style={{ padding: 0 }}>
          <GridContainer>
            <Grid item>
              <Button variant="outlined" color="secondary" component={Link} to={'/reports/reservations'}>
                {t('classes.common.reservationsReport', 'Reservations Report')}
              </Button>
            </Grid>
            <Grid item>
              <FiltersDrawer isFiltered={isFiltered} />
            </Grid>
          </GridContainer>
        </Grid>
        <Grid item xs={12}>
          <SearchClassesForm
            distances={distances}
            initialValues={searchClassesFormValues}
            isFetching={isFetching}
            onSubmit={submitSearchClassesForm}
            totalCount={Number(total)}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper hasError={!!error} isLoading={isFetching}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">
                    <Tooltip
                      title={t('classes.classesList.tooltipTitle', 'Sort by Latest or Oldest').toString()}
                      enterDelay={300}
                    >
                      <IconButton
                        aria-label={t('classes.classesList.changeSortOrder', 'Change Sort Order')}
                        onClick={this.handleSortOrder}
                        classes={{ root: classes.iconButton }}
                      >
                        <TableSortLabel active direction={order} classes={{ icon: classes.sortIcon }} />
                      </IconButton>
                    </Tooltip>
                    {t('classes.common.startDate', 'Start Date')}
                  </TableCell>
                  <TableCell>{t('classes.classesList.instructorProvider', 'Instructor - Provider')}</TableCell>
                  <TableCell>{t('classes.common.courseName', 'Course Name')}</TableCell>
                  <TableCell>{t('classes.common.trainingLocation', 'Training Location')}</TableCell>
                  <TableCell align="right">{t('classes.classesList.price', 'Price / Student')}</TableCell>
                  <TableCell align="right">{t('classes.classesList.availableSeats', 'Available Seats')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainingClasses && trainingClasses.length > 0 ? (
                  trainingClasses.map(
                    ({
                      id,
                      location,
                      meta,
                      program,
                      primaryInstructor,
                      startDate,
                      studentCapacity,
                      trainingProvider,
                      pricePerStudent
                    }) => (
                      <LinkedRow
                        key={id}
                        to={{
                          pathname: `/${id}`,
                          search
                        }}
                      >
                        <TableCell align="right">{localizeDate(startDate, t)}</TableCell>
                        <TableCell>
                          {primaryInstructor && `${primaryInstructor.firstName} ${primaryInstructor.lastName}`}{' '}
                          {trainingProvider && `- ${trainingProvider.name}`}{' '}
                        </TableCell>
                        <TableCell>{program.name}</TableCell>
                        <TableCell>
                          {location.city} {location.state}, {location.zip}
                        </TableCell>
                        <TableCell align="right">
                          {pricePerStudent && localizeCurrency(parseFloat(pricePerStudent), t)}
                        </TableCell>
                        <TableCell align="right">
                          {studentCapacity !== null &&
                            studentCapacity > 0 &&
                            localizeNumber(getTotalSeatsAvailable(meta.totalActiveSeatsReserved, studentCapacity), t)}
                        </TableCell>
                      </LinkedRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {t('classes.classesList.noClasses', 'There are no classes with seats available.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {total !== null && (
                <TableFooter>
                  <TableRow>
                    <TablePagination
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
  }
}

export const ClassesListComponent = withStyles(styles)(withTranslation()(ClassesList));
