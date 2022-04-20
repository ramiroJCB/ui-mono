import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import Typography from '@material-ui/core/Typography';
import { debounce } from 'lodash';
import { FiltersContainer } from '../filters/containers/Filters';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Link } from 'react-router-dom';
import { Moment } from 'moment';
import { ReservationMetricsContainer } from '../ReservationMetrics/containers/ReservationMetrics';
import { ReservationsListContainer } from '../ReservationsList/containers/ReservationsList';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  startCreatedDateUtc: string;
  endCreatedDateUtc: string;
  handleDateFilter: (property: string, value: string) => void;
};

type Props = OwnProps & I18nextProps;

class ReservationsReport extends React.Component<Props> {
  updateDateFilter = (property: string) => (momentDate: Moment) => {
    if (momentDate === null) {
      this.props.handleDateFilter(property, '');
    } else if (momentDate.isValid()) {
      this.debounceUpdateFilter(property, momentDate.format('YYYY-MM-DD'));
    }
  };

  debounceUpdateFilter = debounce((id: string, value: string) => {
    this.props.handleDateFilter(id, value);
  }, 500);

  render() {
    const { startCreatedDateUtc, endCreatedDateUtc, t } = this.props;

    return (
      <GridContainer>
        <Grid item xs={12} style={{ padding: 0 }}>
          <GridContainer justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5">{t('classes.common.reservationsReport', 'Reservations Report')}</Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" component={Link} to={'/'}>
                {t('classes.common.upcomingClasses', 'Upcoming classes')}
              </Button>
            </Grid>
          </GridContainer>
        </Grid>
        <Grid item xs={12} style={{ padding: 0 }}>
          <GridContainer>
            <Grid item xs={12} sm={3}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  name="startCreatedDateUtc"
                  label={t('classes.common.startDate', 'Start Date')}
                  onChange={this.updateDateFilter('startCreatedDateUtc')}
                  value={startCreatedDateUtc || null}
                  format={localizeDate(startCreatedDateUtc, t)}
                  fullWidth
                  disableFuture
                  maxDateMessage={<span>{t('classes.common.maxDateMessage', 'Date cannot be in the future')}</span>}
                  clearable
                  inputVariant="filled"
                  KeyboardButtonProps={{
                    'aria-label': t('classes.common.changeDate', 'change date')
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  name="endCreatedDateUtc"
                  label={t('classes.reservationsReport.endDate', 'End Date')}
                  onChange={this.updateDateFilter('endCreatedDateUtc')}
                  value={endCreatedDateUtc}
                  format={localizeDate(endCreatedDateUtc, t)}
                  fullWidth
                  disableFuture
                  maxDateMessage={<span>{t('classes.common.maxDateMessage', 'Date cannot be in the future')}</span>}
                  clearable
                  inputVariant="filled"
                  KeyboardButtonProps={{
                    'aria-label': t('classes.common.changeDate', 'change date')
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FiltersContainer />
            </Grid>
          </GridContainer>
        </Grid>

        <Grid item xs={12} style={{ padding: 0 }}>
          <ReservationMetricsContainer />
        </Grid>
        <Grid item xs={12}>
          <ReservationsListContainer />
        </Grid>
      </GridContainer>
    );
  }
}

export const ReservationsReportComponent = withTranslation()(ReservationsReport);
