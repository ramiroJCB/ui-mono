import * as React from 'react';
import { connect } from 'react-redux';
import { fetchTaskGroups } from '../actions';
import { ITaskGroupTableOption } from 'interfaces/taskGroupTableOption';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { TaskGroupsComponent } from '../components/TaskGroups';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.taskGroups;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTaskGroups: () => dispatch(fetchTaskGroups(organizationId, parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TaskGroups extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTaskGroups();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchTaskGroups();
    }
  }

  handleRowSelect = ({ id: taskGroupId }: ITaskGroupTableOption) => {
    const {
      history,
      match: {
        params: { organizationId }
      },
      location: { search }
    } = this.props;

    history.push({ pathname: `/${organizationId}/alerts/taskGroups/${taskGroupId}`, state: { search } });
  };

  render() {
    const {
      taskGroups,
      isFetching,
      totalTaskGroupsCount,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return (
      <TaskGroupsComponent
        taskGroups={taskGroups}
        handleRowSelect={this.handleRowSelect}
        organizationId={organizationId}
        isFetchingData={isFetching}
        totalOptionsCount={totalTaskGroupsCount}
      />
    );
  }
}

export const TaskGroupsContainer = connect(mapStateToProps, mapDispatchToProps)(TaskGroups);
