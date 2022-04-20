import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentStatus';
import { AxiosError } from 'axios';
import { ComplianceLevel } from '../../../interfaces/complianceLevel';
import { ExpirationUnits, ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { IEmployee } from '../../../interfaces/employee';
import { IEmployeeTrainingRequirement } from '../../../interfaces/employeeTrainingRequirement';
import { initialState, reducer, State as EmployeeTrainingRequirementState } from './reducer';
import '@pec/aion-ui-i18next';

let prevState: EmployeeTrainingRequirementState;

const trainingRequirement: ITrainingRequirement = {
  organizationId: '08eaa1e1-dffc-4736-ac4f-a8d900e15ffe',
  name: 'H2S Awareness',
  description: 'h2s',
  expirationMillis: 63072000000.0,
  expirationUnits: ExpirationUnits.Days,
  uploadRequired: true,
  compliantContractorCount: 0,
  totalContractorCount: 1,
  compliantContractorPercentage: 0.0,
  contractorCountUpdatedDateUtc: '2019-10-04T19:40:17.265837Z',
  isDeleted: false,
  id: '61306f55-6a07-47a0-9361-aad400da1b83'
};

const employee: IEmployee = {
  id: 'b3faa6f9-b9bb-4c3c-be30-aad301609ee2',
  organizationId: '28e14b26-7a4c-42a3-8ad7-a8d900e15135',
  traineeId: '0dfc8d10-4ed9-e811-a9bb-8b450c7facc1',
  employeeId: '3ed4cfe7-e058-4b63-a6ba-a8ae0164cad0',
  name: 'CIARAN MOLLOY',
  emailAdress: null,
  phoneNumber: null,
  mobilePhoneNumber: null,
  addressLine1: null,
  addressLine2: null,
  city: null,
  state: null,
  zip: null,
  country: null,
  compliantTrainingCount: 1,
  totalTrainingCount: 4,
  compliantTrainingPercentage: 0.25,
  trainingCountUpdatedDateUtc: '2019-10-04T19:40:27.206397Z',
  isDeleted: false
};

const { Downloading, Failed, Uploaded, Uploading } = AttachmentStatus;

beforeEach(() => {
  prevState = {
    ...initialState,
    pendingDocuments: [
      {
        fileName: 'TestFile.txt',
        id: '9e299acb-d106-4c7f-ad0f-5f35a2d69c8e',
        isDeleted: false,
        mimeType: 'application/text',
        status: Uploading,
        path: '',
        storagePath: '',
        error: ''
      }
    ]
  };
});

describe('Employee Training Requirement reducer', () => {
  it('updates state correctly when dispatching FETCH_EMPLOYEE_TRAINING_REQUIREMENT_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_REQUEST'
    });
    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('updates state directly when dispatching FETCH_EMPLOYEE_TRAINING_REQUIREMENT_SUCCESS', () => {
    const employeeTrainingRequirement: IEmployeeTrainingRequirement = {
      id: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      employeeId: '',
      contractorId: '',
      trainingRequirementId: 'Test Subject',
      clientId: 'Test Content',
      status: ComplianceLevel.Compliant,
      completionDateUtc: '2017-01-12T03:00:00Z',
      completionDateUpdatedDateUtc: '2019-03-22T03:00:00Z',
      isDeleted: false,
      trainingRequirement: trainingRequirement,
      metaData: [],
      employee: employee
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_SUCCESS',
      payload: employeeTrainingRequirement
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBeNull();
    expect(prevState.employeeTrainingRequirement).toBeNull();
    expect(nextState.employeeTrainingRequirement).toEqual(employeeTrainingRequirement);
  });

  it('updates state correctly when dispatching FETCH_EMPLOYEE_TRAINING_REQUIREMENT_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toEqual(error);
  });

  it('updates state correctly when dispatching ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST', () => {
    const fileWithPath = {
      name: 'testfile',
      lastModified: 1,
      size: 0,
      slice: null,
      type: ''
    };

    const rejectedFile = { name: 'testfailfile', reason: 'Unit test' };

    const nextState = reducer(prevState, {
      type: 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST',
      payload: [fileWithPath],
      rejectedFiles: [rejectedFile]
    });

    expect(nextState.pendingDocuments[1]).toEqual({
      causeOfFailure: rejectedFile.reason,
      fileName: rejectedFile.name,
      id: '',
      isDeleted: false,
      mimeType: '',
      status: Failed,
      storagePath: ''
    });
    expect(nextState.pendingDocuments[2]).toEqual({
      fileName: fileWithPath.name,
      id: '',
      isDeleted: false,
      mimeType: '',
      status: Uploading,
      storagePath: ''
    });
  });

  it('updates state correctly when dispatching ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS', () => {
    const existingPendingDocument = prevState.pendingDocuments[0];
    const newFileId = '9e299acb-d106-4c7f-ad0f-5f35a2d69c8e';

    const nextState = reducer(prevState, {
      type: 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS',
      payload: { ...existingPendingDocument, id: newFileId }
    });

    expect(nextState.pendingDocuments[0]).toEqual({
      ...existingPendingDocument,
      id: newFileId,
      status: Uploaded
    });
  });

  it('updates state correctly when dispatching ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const existingPendingDocument = prevState.pendingDocuments[0];

    const nextState = reducer(prevState, {
      type: 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_FAILURE',
      error,
      fileName: existingPendingDocument.fileName
    });

    expect(nextState.pendingDocuments[0]).toEqual({
      ...existingPendingDocument,
      causeOfFailure: 'Internal server error',
      status: Failed
    });
  });

  it('updates state correctly when dispatching DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST ', () => {
    const existingPendingDocument = prevState.pendingDocuments[0];

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST',
      payload: existingPendingDocument.id
    });

    expect(nextState.pendingDocuments[0]).toEqual({
      ...existingPendingDocument,
      status: Downloading
    });
  });

  it('updates state correctly when dispatching DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS ', () => {
    const existingPendingDocument = prevState.pendingDocuments[0];

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS',
      payload: existingPendingDocument.id
    });

    expect(nextState.pendingDocuments[0]).toEqual({
      ...existingPendingDocument,
      status: Uploaded
    });
  });

  it('updates state correctly when dispatching DELETE_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS ', () => {
    const existingPendingDocument = prevState.pendingDocuments[0];

    const nextState = reducer(prevState, {
      type: 'DELETE_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS',
      payload: existingPendingDocument.id
    });

    expect(nextState.pendingDocuments.length).toBe(0);
  });
});
