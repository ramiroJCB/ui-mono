import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchRegionalServices } from '../actions/fetchRegionalServices';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RegionalServicesComponent } from '../components/RegionalServices';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  serviceRegionId: string;
};

const mapStateToProps = (state: RootState) => state.regionalServices;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { serviceRegionId }: OwnProps) => ({
  fetchRegionalServices: () => dispatch(fetchRegionalServices(serviceRegionId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchRegionalServices();
  }

  componentDidUpdate({ serviceRegionId: prevServiceRegionId }: Props) {
    const { serviceRegionId, fetchRegionalServices } = this.props;

    if (serviceRegionId !== prevServiceRegionId) {
      fetchRegionalServices();
    }
  }

  render() {
    const { serviceRegionId, regionalServices, isFetching, error } = this.props;

    return !isFetching && regionalServices ? (
      <RegionalServicesComponent serviceRegionId={serviceRegionId} regionalServices={regionalServices} />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const RegionalServicesContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
