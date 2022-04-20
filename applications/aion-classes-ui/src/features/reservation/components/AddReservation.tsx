import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ClassHeader } from 'components/ClassHeader';
import { DeepReadonly } from 'utility-types';
import { Form } from 'react-final-form';
import { getTotalSeatsAvailable } from 'helpers/reservations';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddReservation } from '@pec/aion-ui-core/interfaces/reservation';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { ReservationFormFields } from './ReservationFormFields';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  classId: string;
};

type OwnProps = {
  initialValues: IAddReservation;
  onSubmit: (values: IAddReservation) => Promise<void>;
  trainingClass: DeepReadonly<ITrainingClass>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const Component: React.FC<Props> = ({
  initialValues,
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
        <Typography variant="h5">{t('classes.reservation.newReservation', 'New Reservation')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Form initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit, submitting, invalid, pristine }) => (
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
                    <Typography variant="button">
                      {t('classes.common.reservationDetails', 'Reservation Details')}
                    </Typography>
                  </Grid>
                  <ReservationFormFields maxSeats={totalSeatsAvailable} />
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

export const AddReservationComponent = withRouter(Component);
