import * as React from 'react';
import { ClientContractorsComponent } from '../components/ClientContractors';
import { connect } from 'react-redux';
import { fetchClientContractorsIfNeeded } from '../actions';
import { IClientContractorsTableOption } from 'interfaces/clientContractorsTableOption';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.clientContractors;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorsIfNeeded: () => dispatch(fetchClientContractorsIfNeeded(organizationId, parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientContractors extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorsIfNeeded();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchContractorsIfNeeded();
    }
  }

  handleRowSelect = ({ id: contractorId }: IClientContractorsTableOption) => {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    history.push(`/${organizationId}/alerts/taskGroups/contractors/${contractorId}`);
  };

  render() {
    const {
      contractors,
      isFetching,
      totalContractorsCount,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return (
      <ClientContractorsComponent
        contractors={contractors}
        handleRowSelect={this.handleRowSelect}
        organizationId={organizationId}
        isFetchingData={isFetching}
        totalOptionsCount={totalContractorsCount}
      />
    );
  }
}

export const ClientContractorsContainer = connect(mapStateToProps, mapDispatchToProps)(ClientContractors);
