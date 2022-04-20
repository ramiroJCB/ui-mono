import * as React from 'react';
import { connect } from 'react-redux';
import { deleteTaskGroup } from '../actions/deleteTaskGroup';
import { downloadTaskGroupAttachment } from '../actions/downloadTaskGroupAttachment';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTaskGroupIfNeeded } from '../actions/fetchTaskGroup';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { TaskGroupComponent } from '../components/TaskGroup';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  taskGroupId: string;
};

const mapStateToProps = (state: RootState) => state.taskGroup;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, taskGroupId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTaskGroupIfNeeded: () => dispatch(fetchTaskGroupIfNeeded(taskGroupId)),
  deleteTaskGroup: () => dispatch(deleteTaskGroup(taskGroupId, organizationId, history)),
  downloadAttachment: (attachment: IAttachment) => dispatch(downloadTaskGroupAttachment(attachment))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TaskGroup extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTaskGroupIfNeeded();
  }

  deleteTaskGroup = async () => await this.props.deleteTaskGroup();

  render() {
    const {
      taskGroup,
      downloadAttachment,
      isDeleting,
      isFetching,
      error,
      match: {
        params: { organizationId, taskGroupId }
      }
    } = this.props;

    return taskGroup && !isFetching ? (
      <TaskGroupComponent
        taskGroup={taskGroup}
        downloadAttachment={downloadAttachment}
        isDeleting={isDeleting}
        organizationId={organizationId}
        taskGroupId={taskGroupId}
        deleteTaskGroup={this.deleteTaskGroup}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const TaskGroupContainer = connect(mapStateToProps, mapDispatchToProps)(TaskGroup);
