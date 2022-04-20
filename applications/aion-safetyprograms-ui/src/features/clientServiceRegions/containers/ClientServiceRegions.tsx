import * as React from 'react';
import { ClientServiceRegionsComponent } from '../components/ClientServiceRegions';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClientServiceRegions } from '../actions/fetchClientServiceRegions';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  clientId: string;
};

const mapStateToProps = (state: RootState) => state.clientServiceRegions;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { clientId }: OwnProps) => ({
  fetchClientServiceRegions: () => dispatch(fetchClientServiceRegions(clientId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientServiceRegions();
  }

  render() {
    const { clientServiceRegions, isFetching, error } = this.props;

    return !isFetching && clientServiceRegions ? (
      <ClientServiceRegionsComponent clientServiceRegions={clientServiceRegions} />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ClientServiceRegionsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
