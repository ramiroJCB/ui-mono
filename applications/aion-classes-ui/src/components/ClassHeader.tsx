import * as React from 'react';
import Button from '@material-ui/core/Button';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Trans, useTranslation } from 'react-i18next';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { formats } from '@pec/aion-ui-i18next/constants';
import { localizeDate, localizeTime } from '@pec/aion-ui-i18next/helpers/localize';

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      color: theme.palette.grey[500],
      alignSelf: 'center',
      marginRight: theme.spacing(2)
    },
    reservationSection: {
      display: 'flex',
      alignItems: 'center',
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      marginTop: theme.spacing(4),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    },
    supportText: {
      '& strong': {
        color: theme.palette.grey[700],
        fontSize: 'smaller'
      }
    }
  });

type OwnProps = {
  showAddButton: boolean;
  totalSeatsAvailable: number;
  totalSeatsReserved: number;
  trainingClass: DeepReadonly<ITrainingClass>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  classes,
  totalSeatsAvailable,
  showAddButton,
  totalSeatsReserved,
  trainingClass: {
    id,
    hours,
    program,
    supportedLanguages,
    location: { streetAddress, city, state, zip, description },
    primaryInstructor,
    startDate,
    timeZoneId,
    studentCapacity
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          {program.name}
        </Typography>
        <GridContainer spacing={0}>
          <Grid item sm={9} className={classes.supportText}>
            <Typography variant="body2">
              <Trans i18nKey="classes.classHeader.location">
                <strong>Location</strong>: {{ stringAddress: streetAddress ?? '' }} {{ city }}, {{ state }} {{ zip }}
              </Trans>
            </Typography>
            <Typography variant="body2">
              <Trans i18nKey="classes.classHeader.contacts">
                <strong>Phone</strong>: {{ phoneNumber: primaryInstructor?.officePhoneNumber }} · <strong>Email</strong>
                : {{ email: primaryInstructor?.emailAddress }}
              </Trans>
            </Typography>
            <Typography variant="body2">
              <Trans i18nKey="classes.classHeader.courseLength">
                <strong>Course Length</strong>: {{ hours }} hrs
              </Trans>
            </Typography>
            <Typography variant="body2">
              <Trans i18nKey="classes.classHeader.supportedLanguages">
                <strong>Supported Languages</strong>: {{ languages: supportedLanguages.join(', ') }}
              </Trans>
            </Typography>
            {description && (
              <Typography variant="body2">
                <Trans i18nKey="classes.classHeader.locationDescription">
                  <strong>Location Description</strong>: <em>{{ description }}</em>
                </Trans>
              </Typography>
            )}
          </Grid>
          <Grid item style={{ textAlign: 'right' }} sm={3}>
            <Typography variant="body2">
              {t('classes.classHeader.maxReservations', {
                studentCapacity,
                defaultValue: '{{studentCapacity}} Max Reservations'
              })}
            </Typography>
            <Typography variant="body2">
              {t('classes.classHeader.seatsReserved', {
                totalSeatsReserved,
                defaultValue: '{{totalSeatsReserved}} Seats Reserved'
              })}
            </Typography>
            <Typography variant="body2">
              {t('classes.classHeader.seatsAvailable', {
                totalSeatsAvailable,
                defaultValue: '{{totalSeatsAvailable}} Seats Available'
              })}
            </Typography>
          </Grid>
        </GridContainer>
      </Grid>
      {showAddButton && (
        <Grid item style={{ textAlign: 'right' }} xs={12}>
          <Button variant="contained" color="primary" component={Link} to={`/${id}/reservations/add`}>
            {t('classes.classHeader.addReservation', 'Add Reservation')}
          </Button>
        </Grid>
      )}
      <Grid item classes={{ root: classes.reservationSection }} xs={12}>
        <EventIcon fontSize="large" className={`${classes.icon}`} />
        <Typography variant="h6">
          {t('classes.classHeader.startDate', {
            date: localizeDate(new Date(startDate).toDateString(), t, formats.dateFull),
            time:
              timeZoneId &&
              ` / ${localizeTime(
                {
                  time: new Date(startDate).getTime(),
                  timeZoneId
                },
                t
              )}`,
            defaultValue: 'Start Date: {{date}}{{time}}'
          })}
        </Typography>
      </Grid>
    </React.Fragment>
  );
};

export const ClassHeader = withStyles(styles)(Component);
