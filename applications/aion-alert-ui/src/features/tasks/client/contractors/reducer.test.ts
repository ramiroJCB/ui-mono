import { AxiosError } from 'axios';
import { IAssignee } from '../../../../interfaces/assignee';
import { initialState, reducer, State as ClientContractorsState } from './reducer';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

let prevState: ClientContractorsState;

beforeEach(() => {
  prevState = initialState;
});

describe('Client Contractors reducer', () => {
  it('updates state correctly when dispatching FETCH_CLIENT_CONTRACTORS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CLIENT_CONTRACTORS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('updates state correctly when dispatching FETCH_CLIENT_CONTRACTORS_SUCCESS', () => {
    const clientContractor: IAssignee = {
      assigneeId: '89fdd78c-d9d2-4549-a71f-eddf3a613ecc',
      assigneeName: 'Test Contractor',
      assigneeGroups: [],
      status: TaskStatus.AssigneeReplied,
      assigneeRepliedCount: 5,
      incompleteCount: 4,
      completeCount: 3,
      ownerRepliedCount: 0,
      submittedCount: 2
    };

    const totalCount = 10;

    const nextState = reducer(prevState, {
      type: 'FETCH_CLIENT_CONTRACTORS_SUCCESS',
      payload: [clientContractor],
      totalCount
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(prevState.contractors).not.toContain(clientContractor);
    expect(nextState.contractors).toContain(clientContractor);
    expect(prevState.totalContractorsCount).toEqual(initialState.totalContractorsCount);
    expect(nextState.totalContractorsCount).toEqual(totalCount);
  });

  it('updates state correctly when dispatching FETCH_CLIENT_CONTRACTORS_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_CLIENT_CONTRACTORS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
