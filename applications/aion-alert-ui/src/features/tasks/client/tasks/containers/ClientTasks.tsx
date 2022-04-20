import * as React from 'react';
import { ClientTasksComponent } from '../components/ClientTasks';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClientTasks } from '../actions';
import { IClientTaskTableOption } from 'interfaces/clientTaskTableOption';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.clientTasks;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientTasks: () => dispatch(fetchClientTasks(organizationId, parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientTasks extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientTasks();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;
    if (prevSearch !== search) {
      this.props.fetchClientTasks();
    }
  }

  handleRowSelect = ({ id: taskId }: IClientTaskTableOption) => {
    const {
      history,
      match: {
        params: { organizationId }
      },
      location: { search }
    } = this.props;
    history.push({ pathname: `/${organizationId}/alerts/tasks/${taskId}`, state: { search } });
  };

  render() {
    const {
      clientTasks,
      error,
      isFetching,
      totalClientTasksCount,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return !error ? (
      <ClientTasksComponent
        clientTasks={clientTasks}
        handleRowSelect={this.handleRowSelect}
        isFetchingData={isFetching}
        organizationId={organizationId}
        totalOptionsCount={totalClientTasksCount}
      />
    ) : (
      <Error />
    );
  }
}

export const ClientTasksContainer = connect(mapStateToProps, mapDispatchToProps)(ClientTasks);
