import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IReservationMetrics } from 'interfaces/reservationMetrics';
import { SupportMetrics } from './SupportMetrics';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { localizeCurrency, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    cardContent: {
      flexGrow: 1
    },
    summaryCallout: {
      fontWeight: theme.typography.fontWeightMedium
    },
    supportingStat: {
      paddingLeft: 0,
      paddingTop: 0
    }
  });

type OwnProps = {
  reservationMetrics: DeepReadonly<IReservationMetrics>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  classes: { card, cardContent, summaryCallout, supportingStat },
  reservationMetrics: { totalSeats, totalReservations, totalValue, averageSeats, averageSeatValue, averageValue }
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12} sm={6}>
        <Card elevation={0} className={card}>
          <CardContent className={cardContent}>
            <Typography variant="overline" color="textSecondary">
              {t('classes.reservationsReport.reservations', 'Reservations')}
            </Typography>
            <Typography component="h3" variant="h3" color="secondary" className={summaryCallout} gutterBottom>
              {localizeNumber(totalReservations, t)}
            </Typography>
            <GridContainer className={supportingStat} spacing={0}>
              <SupportMetrics
                title={t('classes.reservationsReport.totalSeats', 'Total Seats').toString()}
                value={totalSeats}
                shouldMonetize={false}
              />
              <SupportMetrics
                title={t('classes.reservationsReport.avgSeats', 'Avg Seats').toString()}
                value={averageSeats}
                shouldMonetize={false}
              />
            </GridContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card elevation={0} className={card}>
          <CardContent className={cardContent}>
            <Typography variant="overline" color="textSecondary">
              {t('classes.reservationsReport.reservationMetrics', 'Reservation Amount')}
            </Typography>
            <Typography component="h3" variant="h3" color="secondary" className={summaryCallout} gutterBottom>
              {localizeCurrency(totalValue, t)}
            </Typography>
            <GridContainer className={supportingStat} spacing={0}>
              <SupportMetrics
                title={t('classes.reservationsReport.perReservation', 'Per Reservation').toString()}
                value={averageValue}
                shouldMonetize={true}
              />
              <SupportMetrics
                title={t('classes.reservationsReport.perSeat', 'Per Seat').toString()}
                value={averageSeatValue}
                shouldMonetize={true}
              />
            </GridContainer>
          </CardContent>
        </Card>
      </Grid>
    </GridContainer>
  );
};

export const ReservationMetricsComponent = withStyles(styles)(Component);
