import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';
import red from '@material-ui/core/colors/red';
import Typography from '@material-ui/core/Typography';
import { ClassHeader } from 'components/ClassHeader';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { getTotalSeatsAvailable } from 'helpers/reservations';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IReservation, ReservationStatus } from '@pec/aion-ui-core/interfaces/reservation';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { ReservationFormFields } from './ReservationFormFields';
import { RouteComponentProps, withRouter } from 'react-router';
import { SwitchField } from './SwitchField';
import { useTranslation } from 'react-i18next';

const { Active } = ReservationStatus;

const styles = () =>
  createStyles({
    gridItem: {
      textAlign: 'center',
      backgroundColor: red[200]
    },
    gridItemActive: {
      backgroundColor: green[200]
    }
  });

type RouteParams = {
  classId: string;
};

type OwnProps = {
  initialValues: IReservation;
  onSubmit: (values: IReservation) => Promise<void>;
  trainingClass: DeepReadonly<ITrainingClass>;
  handleChangeStatus: (
    form: FormApi<IReservation>
  ) => (event: React.ChangeEvent<HTMLButtonElement>, checked: boolean) => void;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const Component: React.FC<Props> = ({
  classes,
  initialValues,
  handleChangeStatus,
  onSubmit,
  trainingClass,
  match: {
    params: { classId }
  }
}) => {
  const {
    studentCapacity,
    meta: { totalActiveSeatsReserved }
  } = trainingClass;
  const totalSeatsAvailable = getTotalSeatsAvailable(totalActiveSeatsReserved, studentCapacity ?? 0);
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography variant="h5">{t('classes.common.editReservation', 'Edit Reservation')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Form initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit, submitting, invalid, pristine, values, form }) => (
            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <Paper>
                <GridContainer spacing={4}>
                  <ClassHeader
                    showAddButton={false}
                    totalSeatsAvailable={totalSeatsAvailable}
                    totalSeatsReserved={totalActiveSeatsReserved}
                    trainingClass={trainingClass}
                  />
                  <Grid item xs={12}>
                    <GridContainer spacing={0}>
                      <Grid item xs={12} sm={6} lg={4} style={{ alignSelf: 'center' }}>
                        <Typography variant="button">
                          {t('classes.common.reservationDetails', 'Reservation Details')}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={4}
                        className={`${classes.gridItem} ${values.status === Active ? classes.gridItemActive : ''}`}
                      >
                        <Field<ReservationStatus>
                          type="checkbox"
                          name="status"
                          checkedValue={values.status === ReservationStatus.Active}
                          component={SwitchField}
                          onChange={handleChangeStatus(form)}
                          variant="filled"
                        />
                      </Grid>
                    </GridContainer>
                  </Grid>
                  <ReservationFormFields maxSeats={totalSeatsAvailable + initialValues.reservedSeatsCount} />
                  <Grid item xs={12} lg={8}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Button variant="text" color="primary" component={Link} to={`/${classId}`} fullWidth>
                          {t('classes.common.cancel', 'Cancel')}
                        </Button>
                      </Grid>
                      <Grid item>
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          color="secondary"
                          isSubmitting={submitting}
                          disabled={submitting || invalid || pristine}
                          fullWidth
                        >
                          {submitting ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            t('classes.common.save', 'Save')
                          )}
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </GridContainer>
              </Paper>
            </form>
          )}
        </Form>
      </Grid>
    </GridContainer>
  );
};

export const EditReservationComponent = withRouter(withStyles(styles)(Component));
