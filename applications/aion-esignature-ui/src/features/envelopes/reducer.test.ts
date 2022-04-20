import { AxiosError } from 'axios';
import { EnvelopeStatus, IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { initialState, reducer, State as EnvelopeState } from './reducer';

const { AssigneeAssigned } = EnvelopeStatus;

let prevState: EnvelopeState;

beforeEach(() => {
  prevState = initialState;
});

describe('Envelopes reducer', () => {
  it('updates state correctly when dispatching FETCH_ENVELOPES_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ENVELOPES_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('updates state correctly when dispatching FETCH_CLIENT_TASKS_SUCCESS', () => {
    const envelope: IEnvelope = {
      id: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      externalEnvelopeId: 'e3cfc508-4f3b-4c45-bd33-b537a4aca032',
      assigneeTypeId: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      assigneeTypeName: 'Test Owner',
      createdBy: 'testuser',
      updatedDateUtc: '2019-03-22T03:00:00Z',
      status: AssigneeAssigned,
      documentFileNames: 'test.pdf',
      documents: []
    };

    const totalCount = 10;

    const nextState = reducer(prevState, {
      type: 'FETCH_ENVELOPES_SUCCESS',
      payload: [envelope],
      totalCount
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(prevState.envelopes).not.toContain(envelope);
    expect(nextState.envelopes).toContain(envelope);
    expect(prevState.totalCount).toEqual(initialState.totalCount);
    expect(nextState.totalCount).toEqual(totalCount);
  });

  it('updates state correctly when dispatching FETCH_ENVELOPES_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_ENVELOPES_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
