import { AxiosError } from 'axios';
import { EnvelopeStatus, IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { IEnvelopeDocument } from '@pec/aion-ui-core/interfaces/envelopeDocument';
import { initialState, reducer, State as EnvelopeState } from './reducer';

const { AssigneeAssigned } = EnvelopeStatus;

let prevState: EnvelopeState;

beforeEach(() => {
  prevState = initialState;
});

describe('Envelope reducer', () => {
  it('updates state correctly when dispatching FETCH_ENVELOPE_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ENVELOPE_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_ENVELOPE_SUCCESS', () => {
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

    const nextState = reducer(prevState, {
      type: 'FETCH_ENVELOPE_SUCCESS',
      payload: envelope
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBeNull();
    expect(prevState.envelope).toBeNull();
    expect(nextState.envelope).toEqual(envelope);
  });

  it('updates state correctly when dispatching FETCH_CLIENT_TASK_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_ENVELOPE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toEqual(error);
  });

  it('updates state correctly when dispatching ADD_ENVELOPE_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_ENVELOPE_REQUEST'
    });

    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching ADD_ENVELOPE_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_ENVELOPE_SUCCESS'
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toEqual(null);
  });

  it('updates state correctly when dispatching ADD_ENVELOPE_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'ADD_ENVELOPE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toEqual(error);
  });

  it('updates state correctly when dispatching DOWNLOAD_ENVELOPE_DOCUMENT_REQUEST', () => {
    const payload: string = '43272aa0-9edc-4573-bc41-14ccbcb740c4';

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_ENVELOPE_DOCUMENT_REQUEST',
      payload
    });

    expect(prevState.downloadingDocumentIds).toEqual([]);
    expect(nextState.downloadingDocumentIds).toContain(payload);
  });

  it('updates state correctly when dispatching DOWNLOAD_ENVELOPE_DOCUMENT_SUCCESS', () => {
    const payload: string = '43272aa0-9edc-4573-bc41-14ccbcb740c4';

    const stateWithDownloadingDocumentId = reducer(prevState, {
      type: 'DOWNLOAD_ENVELOPE_DOCUMENT_REQUEST',
      payload
    });

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_ENVELOPE_DOCUMENT_SUCCESS',
      payload
    });

    expect(stateWithDownloadingDocumentId.downloadingDocumentIds).toContain(payload);
    expect(nextState.downloadingDocumentIds).toEqual([]);
  });

  it('updates state correctly when dispatching DOWNLOAD_ENVELOPE_DOCUMENT_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const payload: string = '43272aa0-9edc-4573-bc41-14ccbcb740c4';

    const stateWithDownloadingDocumentId = reducer(prevState, {
      type: 'DOWNLOAD_ENVELOPE_DOCUMENT_REQUEST',
      payload
    });

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_ENVELOPE_DOCUMENT_FAILURE',
      payload,
      error
    });

    expect(stateWithDownloadingDocumentId.downloadingDocumentIds).toContain(payload);
    expect(nextState.downloadingDocumentIds).toEqual([]);
    expect(nextState.error).toEqual(error);
  });
});
