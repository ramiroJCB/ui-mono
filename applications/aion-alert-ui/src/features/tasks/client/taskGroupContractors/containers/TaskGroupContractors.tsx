import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTaskGroupContractorsIfNeeded } from '../actions';
import { fetchTaskGroupIfNeeded } from '../../taskGroup/actions/fetchTaskGroup';
import { ITaskGroupContractorsTableOption } from 'interfaces/taskGroupContractorsTableOption';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { TaskGroupContractorsComponent } from '../components/TaskGroupContractors';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  taskGroupId: string;
};
const mapStateToProps = (state: RootState) => ({
  taskGroup: state.taskGroup,
  taskGroupContractors: state.taskGroupContractors
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { taskGroupId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTaskGroupIfNeeded: () => dispatch(fetchTaskGroupIfNeeded(taskGroupId)),
  fetchTaskGroupContractorsIfNeeded: () => dispatch(fetchTaskGroupContractorsIfNeeded(taskGroupId, parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TaskGroupContractors extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchTaskGroupIfNeeded();
    props.fetchTaskGroupContractorsIfNeeded();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchTaskGroupContractorsIfNeeded();
    }
  }
  handleRowSelect = ({ id: assigneeId, taskId }: ITaskGroupContractorsTableOption) => {
    const {
      history,
      match: {
        params: { organizationId, taskGroupId }
      },
      location: { search }
    } = this.props;

    history.push(`/${organizationId}/alerts/taskGroups/${taskGroupId}/contractors/${assigneeId}/task/${taskId}`, {
      filter: search
    });
  };

  render() {
    const {
      taskGroupContractors: {
        taskGroupContractors,
        isFetching: isFetchingTaskGroupContractors,
        totalTaskGroupContractorsCount
      },
      taskGroup: { taskGroup, isFetching: isFetchingTaskGroup, error },
      match: {
        params: { organizationId, taskGroupId }
      }
    } = this.props;

    return taskGroup && !isFetchingTaskGroup ? (
      <TaskGroupContractorsComponent
        taskGroup={taskGroup}
        taskGroupContractors={taskGroupContractors}
        handleRowSelect={this.handleRowSelect}
        organizationId={organizationId}
        taskGroupId={taskGroupId}
        isFetchingData={isFetchingTaskGroupContractors}
        totalOptionsCount={totalTaskGroupContractorsCount}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const TaskGroupContractorsContainer = connect(mapStateToProps, mapDispatchToProps)(TaskGroupContractors);
