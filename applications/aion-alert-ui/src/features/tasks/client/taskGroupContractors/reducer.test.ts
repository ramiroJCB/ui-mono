import { AxiosError } from 'axios';
import { initialState, reducer, State as TaskGroupContractorsState } from './reducer';
import { ITaskAssignee } from '../../../../interfaces/taskAssignee';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

let prevState: TaskGroupContractorsState;

beforeEach(() => {
  prevState = initialState;
});

describe('Task Contractors reducer', () => {
  it('updates state correctly when dispatching FETCH_TASK_GROUP_CONTRACTORS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUP_CONTRACTORS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('updates state correctly when dispatching FETCH_TASK_GROUP_CONTRACTORS_SUCCESS', () => {
    const taskAssignee: ITaskAssignee = {
      taskId: 'ce26ae79-6150-42ea-b949-684e67baa90a',
      assigneeId: '55de48da-3cba-4cd7-977e-46511b8fd2ce',
      assigneeName: 'Contractor Name',
      status: TaskStatus.AwaitingAction,
      hasAttachments: true
    };

    const totalCount = 10;

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUP_CONTRACTORS_SUCCESS',
      payload: [taskAssignee],
      totalCount
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(prevState.taskGroupContractors).not.toContain(taskAssignee);
    expect(nextState.taskGroupContractors).toContain(taskAssignee);
    expect(prevState.totalTaskGroupContractorsCount).toEqual(initialState.totalTaskGroupContractorsCount);
    expect(nextState.totalTaskGroupContractorsCount).toEqual(totalCount);
  });

  it('updates state correctly when dispatching FETCH_TASK_GROUP_CONTRACTORS_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUP_CONTRACTORS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
