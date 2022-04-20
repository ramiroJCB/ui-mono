import * as React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BusinessIcon from '@material-ui/icons/Business';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { ClassHeader } from 'components/ClassHeader';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { getTotalSeatsAvailable } from 'helpers/reservations';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IReservation } from '@pec/aion-ui-core/interfaces/reservation';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Reservations } from 'features/reservations/components/Reservations';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    breadCrumbs: {
      marginTop: theme.spacing(1.5)
    },
    paper: {
      padding: theme.spacing(4)
    },
    card: {
      display: 'flex',
      marginTop: theme.spacing(2)
    },
    details: {
      display: 'flex',
      flexDirection: 'column'
    },
    content: {
      flex: '1 0 auto'
    },
    cardIcon: {
      color: theme.palette.grey[400],
      alignSelf: 'center',
      fontSize: 60
    }
  });

type OwnProps = {
  classId: string;
  trainingClass: DeepReadonly<ITrainingClass>;
  error: DeepReadonly<AxiosError> | null;
  reservations: DeepReadonly<IReservation[]>;
  isFetching: boolean;
  state: { filter?: string };
};

type Props = WithStyles<typeof styles> & OwnProps;

export const ClassDetails: React.FC<Props> = ({
  classes,
  classId,
  error,
  isFetching,
  reservations,
  state: locationState,
  trainingClass
}) => {
  const {
    primaryInstructor,
    studentCapacity,
    trainingProvider,
    translator,
    meta: { totalActiveSeatsReserved }
  } = trainingClass;
  const totalSeatsAvailable = getTotalSeatsAvailable(totalActiveSeatsReserved, studentCapacity ?? 0);
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item className={classes.breadCrumbs}>
        <Breadcrumbs
          links={[
            {
              to: `${locationState && locationState.filter ? `/${locationState.filter}` : '/'}`,
              label: t('classes.classDetails.back', 'Back to Classes')
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching} className={classes.paper}>
          <GridContainer spacing={0}>
            <ClassHeader
              showAddButton={totalSeatsAvailable > 0}
              totalSeatsAvailable={totalSeatsAvailable}
              totalSeatsReserved={totalActiveSeatsReserved}
              trainingClass={trainingClass}
            />
            <Grid item xs={12}>
              <Reservations classId={classId} reservations={reservations} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card} elevation={0}>
                <CardMedia component={AccountCircleIcon} className={classes.cardIcon} />
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography variant="overline" color="textSecondary">
                      {t('classes.common.instructor', 'Instructor')}
                    </Typography>
                    <Typography component="h5" variant="h5">
                      {primaryInstructor?.firstName} {primaryInstructor?.lastName}
                    </Typography>
                    <Typography variant="overline" color="textSecondary">
                      {[
                        t('classes.classDetails.translator', 'Translator: '),
                        translator ?? t('classes.classDetails.na', 'n/a')
                      ]}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card} elevation={0}>
                <CardMedia component={BusinessIcon} className={classes.cardIcon} />
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography variant="overline" color="textSecondary">
                      {t('classes.classDetails.trainingProvider', 'Training Provider')}
                    </Typography>
                    <Typography component="h5" variant="h5">
                      {trainingProvider?.name ?? t('classes.classDetails.na', 'n/a').toLocaleUpperCase()}
                    </Typography>
                    <Typography variant="overline" color="textSecondary">
                      &nbsp;
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};

export const ClassDetailsComponent = withStyles(styles)(ClassDetails);
