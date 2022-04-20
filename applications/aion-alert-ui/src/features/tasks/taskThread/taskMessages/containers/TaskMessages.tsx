import * as React from 'react';
import { connect } from 'react-redux';
import { downloadMessageAttachment } from '../actions/downloadMessageAttachment';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTaskMessagesIfNeeded } from '../actions/fetchTaskMessages';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { merge, parse, stringify } from '@pec/aion-ui-core/helpers/querystring';
import { Messages } from '../components/Messages';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

const mapStateToProps = (state: RootState) => {
  const { isFetching: isFetchingTaskMessages, error: taskMessagesError, ...taskMessages } = state.taskMessages;
  const {
    isFetching: isFetchingTaskAssigneeDetails,
    error: taskAssigneeDetailsError,
    ...rest
  } = state.taskAssigneeDetails;

  return {
    ...taskMessages,
    ...rest,
    isFetching: isFetchingTaskMessages || isFetchingTaskAssigneeDetails,
    error: taskMessagesError || taskAssigneeDetailsError
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  downloadAttachment: (attachment: IAttachment) => dispatch(downloadMessageAttachment(attachment)),
  fetchTaskMessagesIfNeeded: (taskId: string, threadId: string) =>
    dispatch(fetchTaskMessagesIfNeeded(taskId, threadId, parse(search)))
});

type OwnProps = {
  isAssignee: boolean;
  organizationId: string;
  taskId: string;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class TaskMessages extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    if (props.taskAssigneeDetails && props.taskAssigneeDetails.threadId) {
      props.fetchTaskMessagesIfNeeded(props.taskId, props.taskAssigneeDetails.threadId);
    }

    if (!props.location.search) {
      this.setInitialParams();
    }
  }

  componentDidUpdate({ taskAssigneeDetails: prevTaskAssigneeDetails, location: { search: prevSearch } }: Props) {
    const {
      taskAssigneeDetails,
      taskId,
      location: { search }
    } = this.props;

    if (taskAssigneeDetails && taskAssigneeDetails.threadId && (!prevTaskAssigneeDetails || search !== prevSearch)) {
      this.props.fetchTaskMessagesIfNeeded(taskId, taskAssigneeDetails.threadId);
    }
  }

  setInitialParams() {
    const {
      location: { state }
    } = this.props;

    this.props.history.replace({
      search: stringify({
        page: '1',
        sortOrder: 'desc'
      }),
      state
    });
  }

  handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const {
      history,
      location: { search, state }
    } = this.props;

    history.push({
      search: merge(search, {
        page: (page + 1).toString() // MUI is zero-indexed; API is one-indexed
      }),
      state
    });
  };

  handleChangeSortOrder = (sortOrder: 'asc' | 'desc') => {
    const {
      history,
      location: { search }
    } = this.props;
    history.push({
      search: merge(search, {
        sortOrder
      })
    });
  };

  render() {
    const {
      isAssignee,
      taskMessages,
      totalCount,
      isFetching,
      error,
      location: { search },
      organizationId,
      taskAssigneeDetails
    } = this.props;
    const { page, sortOrder } = parse(search);

    const messages = taskAssigneeDetails && taskAssigneeDetails.threadId ? taskMessages : [];

    return taskAssigneeDetails ? (
      <Messages
        organizationId={organizationId}
        taskMessages={messages}
        handleChangePage={this.handleChangePage}
        totalCount={totalCount}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        sortOrder={sortOrder as 'asc' | 'desc'}
        handleChangeSortOrder={this.handleChangeSortOrder}
        isFetching={isFetching}
        error={error}
        statuses={taskAssigneeDetails.statuses}
        downloadAttachment={this.props.downloadAttachment}
        isAssignee={isAssignee}
      />
    ) : (
      <Error />
    );
  }
}

export const TaskMessagesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskMessages));
