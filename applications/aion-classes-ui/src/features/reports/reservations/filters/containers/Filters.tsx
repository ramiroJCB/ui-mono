import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchCreators } from '../../creators/actions';
import { fetchReservationReportFilters } from '../actions';
import { FiltersComponent } from '../components/Filters';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

const mapStateToProps = ({ reservationReportFilters: { filters, isFetching, error }, creators }: RootState) => ({
  filters,
  isFetching,
  error,
  creators
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchReservationReportFilters: () => {
    const { creators = '' } = parse(search);
    dispatch(fetchReservationReportFilters(creators.toString()));
  },
  fetchCreators: (searchTerm: string) => dispatch(fetchCreators(searchTerm))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchReservationReportFilters();
  }

  handleSelect = (param: string) => (ids: string) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        [param]: ids,
        page: '1'
      })
    });
  };

  handleSearch = (param: string) => (searchTerm: string) => {
    const { fetchCreators } = this.props;

    switch (param) {
      case 'creators':
        return fetchCreators(searchTerm);
      default:
        return;
    }
  };

  render() {
    const { filters, isFetching, error, creators } = this.props;

    return !isFetching && filters ? (
      <FiltersComponent
        filters={filters}
        creators={creators}
        handleSelect={this.handleSelect}
        handleSearch={this.handleSearch}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const FiltersContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
