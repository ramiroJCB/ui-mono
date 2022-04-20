import * as React from 'react';
import { firstDayOfCurrentMonth, today } from 'helpers/dates';
import { merge, parse, stringify } from '@pec/aion-ui-core/helpers/querystring';
import { ReservationsReportComponent } from '../components/ReservationsReport';
import { RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps;

export class ReservationsReportContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    if (!props.location.search) {
      this.setInitialParams();
    }
  }

  handleDateFilter = (property: string, value: string) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        [property]: value
      })
    });
  };

  setInitialParams() {
    const {
      history,
      location: { state }
    } = this.props;

    history.replace({
      search: stringify({
        page: '1',
        sortOrder: 'desc'
      }),
      state
    });
  }

  render() {
    const {
      location: { search }
    } = this.props;
    const { startCreatedDateUtc, endCreatedDateUtc } = parse(search);

    return (
      <ReservationsReportComponent
        startCreatedDateUtc={startCreatedDateUtc?.toString() ?? firstDayOfCurrentMonth}
        endCreatedDateUtc={endCreatedDateUtc?.toString() ?? today}
        handleDateFilter={this.handleDateFilter}
      />
    );
  }
}
