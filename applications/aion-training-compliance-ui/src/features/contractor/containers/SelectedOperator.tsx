import * as React from 'react';
import { connect } from 'react-redux';
import { fetchClientIfNeeded } from '@pec/aion-ui-core/actions/client';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectedOperatorComponent } from '../components/SelectedOperator';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  clientId: string;
};

const mapStateToProps = (state: RootState) => state.client;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { clientId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientIfNeeded: () => dispatch(fetchClientIfNeeded(clientId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class SelectedOperator extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIfNeeded();
  }

  render() {
    const { client } = this.props;

    return client && <SelectedOperatorComponent client={client} />;
  }
}

export const SelectedOperatorContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectedOperator));
