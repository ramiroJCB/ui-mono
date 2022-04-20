import * as React from 'react';
import moment from 'moment/moment';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTaskAssigneeDetailsIfNeeded } from '../taskAssigneeDetails/actions/fetchTaskAssigneeDetails';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { TaskThreadComponent } from '../../taskThread/components/TaskThread';
import { ThunkDispatch } from 'redux-thunk';

const { Incomplete } = TaskStatus;

type RouteParams = {
  organizationId: string;
  taskGroupId: string;
  contractorId: string;
  taskId: string;
};

const mapStateToProps = (state: RootState) => state.taskAssigneeDetails;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { taskId }
    }
  }: RouteComponentProps<RouteParams>
) => {
  return {
    fetchTaskAssigneeDetailsIfNeeded: () => dispatch(fetchTaskAssigneeDetailsIfNeeded(taskId))
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TaskThread extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchTaskAssigneeDetailsIfNeeded();
  }

  getTaskStatus = () => {
    const { taskAssigneeDetails } = this.props;

    const taskStatus =
      taskAssigneeDetails && taskAssigneeDetails.statuses.length > 0
        ? taskAssigneeDetails.statuses.reduce((acc, cur) =>
            moment.utc(cur.createdDateUtc).isAfter(moment.utc(acc.createdDateUtc)) ? cur : acc
          ).status
        : Incomplete;

    return taskStatus;
  };

  render() {
    const {
      error,
      isFetching,
      taskAssigneeDetails,
      match: {
        params: { organizationId, taskId }
      },
      location: { state }
    } = this.props;

    return !isFetching && taskAssigneeDetails && taskAssigneeDetails.id === taskId ? (
      <TaskThreadComponent
        taskGroup={taskAssigneeDetails.meta.taskGroup}
        assignee={taskAssigneeDetails.assignees[0]}
        organizationId={organizationId}
        state={state}
        status={this.getTaskStatus()}
        taskId={taskId}
        threadId={taskAssigneeDetails.threadId}
        taskNumber={taskAssigneeDetails.taskNumber}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const TaskThreadContainer = connect(mapStateToProps, mapDispatchToProps)(TaskThread);
