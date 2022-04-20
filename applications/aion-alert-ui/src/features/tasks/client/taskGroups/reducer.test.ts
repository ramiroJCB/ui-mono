import { AxiosError } from 'axios';
import { initialState, reducer, State as TaskGroupsState } from './reducer';
import { ITaskGroup, OwnerType, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

let prevState: TaskGroupsState;

beforeEach(() => {
  prevState = initialState;
});

describe('Task Groups reducer', () => {
  it('updates state correctly when dispatching FETCH_TASK_GROUPS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUPS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('updates state correctly when dispatching FETCH_TASK_GROUPS_SUCCESS', () => {
    const taskGroup: ITaskGroup = {
      id: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      canAssigneeComplete: true,
      ownerName: 'Test Owner Name',
      ownerType: OwnerType.Organization,
      ownerId: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      assigneeGroups: [],
      subject: 'Test Subject',
      content: 'Test Content',
      attachments: [],
      dueDateUtc: '2017-01-12T03:00:00Z',
      status: TaskStatus.AwaitingAction,
      isAttachmentRequiredForCompletion: false,
      createdDateUtc: '2019-03-22T03:00:00Z',
      createdByUserId: 'bc616e14-76d8-4cc0-a9ca-0e0d512c85b8',
      ignoredAssigneeGroups: [],
      meta: {
        assigneeCount: 13,
        awaitingActionCount: 1,
        incompleteCount: 5,
        completeCount: 14
      }
    };

    const totalCount = 10;

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUPS_SUCCESS',
      payload: [taskGroup],
      totalCount
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(prevState.taskGroups).not.toContain(taskGroup);
    expect(nextState.taskGroups).toContain(taskGroup);
    expect(prevState.totalTaskGroupsCount).toEqual(initialState.totalTaskGroupsCount);
    expect(nextState.totalTaskGroupsCount).toEqual(totalCount);
  });

  it('updates state correctly when dispatching FETCH_TASK_GROUPS_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUPS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
