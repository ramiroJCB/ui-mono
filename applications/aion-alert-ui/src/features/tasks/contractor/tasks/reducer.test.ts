import { initialState, reducer, State as ContractorTasksState } from './reducer';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

const { Complete } = TaskStatus;

let prevState: ContractorTasksState;

beforeEach(() => {
  prevState = initialState;
});

describe('Contractor Tags reducer', () => {
  it('updates state correctly when dispatching FETCH_CONTRACTOR_TASKS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_TASKS_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_CONTRACTOR_TASKS_SUCCESS', () => {
    const payload = [
      {
        id: 'c9c3dd67-fb44-48d6-8f78-b4432ebb3420',
        contractorName: 'Test Contractor',
        clientId: 'a6429139-1126-4a2b-95f2-5c2a7991fa20',
        clientName: 'Test Client',
        createdDateUtc: new Date().toISOString(),
        dueDateUtc: new Date().toISOString(),
        status: Complete,
        hasAttachments: false,
        isAttachmentRequiredForCompletion: false,
        taskGroupId: '5376a829-34a7-41b2-b056-86aacfd4f6b6',
        taskGroupSubject: 'Test Subject',
        taskGroupContent: 'Test Content',
        assigneeGroups: []
      }
    ];
    const totalCount = 10;

    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_TASKS_SUCCESS',
      payload,
      totalCount
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.contractorTasks).toEqual(payload);
    expect(nextState.totalContractorTasksCount).toBe(totalCount);
    expect(nextState.error).toBeNull();
  });

  it('updates state correctly when dispatching FETCH_CONTRACTOR_TASKS_FAILURE', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_TASKS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBe(error);
  });
});
