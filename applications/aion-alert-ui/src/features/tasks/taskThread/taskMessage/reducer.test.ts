import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { FileWithPath } from 'file-selector';
import { ICreatedMessage, SenderType } from '../../../../interfaces/message';
import { ICreatedThread } from '../../../../interfaces/thread';
import { initialState, reducer, State as TaskMessageState } from './reducer';
import { InvalidFileUpload } from '../../../../interfaces/invalidFileUpload';
import { ITaskAssigneeStatus } from '../../../../interfaces/taskAssigneeDetails';
import { OwnerType, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

let prevState: TaskMessageState;

beforeEach(() => {
  prevState = initialState;
});

describe('Task Message reducer', () => {
  it('updates state correctly when dispatching ADD_THREAD_WITH_MESSAGE_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_WITH_MESSAGE_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching ADD_MESSAGE_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_WITH_MESSAGE_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching ADD_THREAD_WITH_MESSAGE_SUCCESS', () => {
    const payload: ICreatedMessage = {
      attachments: [],
      content: 'Test Content',
      createdByUserId: '1812c43b-6fa6-4fec-8431-e82514d8204b',
      createdByUserName: 'Test Username',
      createdDateUtc: new Date().toISOString(),
      id: '710549e9-33f5-4169-9218-873d6d8fbeea',
      isDeleted: false,
      recipients: [],
      senderId: '0e835cf4-216e-4a9b-8090-4666d22f7130',
      senderName: 'Test Sender Name',
      senderType: SenderType.Organization
    };

    const thread: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: OwnerType.Organization,
      participants: [],
      subject: 'Thread Subject'
    };

    const status: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: payload.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_WITH_MESSAGE_SUCCESS',
      payload,
      status,
      thread,
      sortOrder: 'asc'
    });

    expect(nextState.error).toBeNull();
    expect(nextState.uploadedAttachments).toStrictEqual([]);
    expect(nextState.taskMessage).toStrictEqual(payload);
    expect(nextState.isFetching).toBe(false);
  });

  it('updates state correctly when dispatching ADD_MESSAGE_SUCCESS', () => {
    const payload: ICreatedMessage = {
      attachments: [],
      content: 'Test Content',
      createdByUserId: '1812c43b-6fa6-4fec-8431-e82514d8204b',
      createdByUserName: 'Test Username',
      createdDateUtc: new Date().toISOString(),
      id: '710549e9-33f5-4169-9218-873d6d8fbeea',
      isDeleted: false,
      recipients: [],
      senderId: '0e835cf4-216e-4a9b-8090-4666d22f7130',
      senderName: 'Test Sender Name',
      senderType: SenderType.Organization
    };

    const status: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: payload.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const nextState = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload,
      status,
      sortOrder: 'asc'
    });

    expect(nextState.error).toBeNull();
    expect(nextState.uploadedAttachments).toStrictEqual([]);
    expect(nextState.taskMessage).toStrictEqual(payload);
    expect(nextState.isFetching).toBe(false);
  });

  it('updates state correctly when dispatching ADD_THREAD_WITH_MESSAGE_FAILURE', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_WITH_MESSAGE_FAILURE',
      error
    });

    expect(nextState.error).toStrictEqual(error);
    expect(nextState.isFetching).toBe(false);
  });

  it('updates state correctly when dispatching ADD_MESSAGE_FAILURE', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'ADD_MESSAGE_FAILURE',
      error
    });

    expect(nextState.error).toStrictEqual(error);
    expect(nextState.isFetching).toBe(false);
  });

  it('updates state correctly when dispatching ADD_MESSAGE_FORM_ATTACHMENT_REQUEST with existing uploadedFiles', () => {
    const existingUploadedFile = {
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const acceptedFile: FileWithPath = {
      name: 'TestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const nextState = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [acceptedFile],
      rejectedFiles: []
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      fileName: existingUploadedFile.name,
      id: '',
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Uploading
    });
    expect(nextState.uploadedAttachments[1]).toEqual({
      fileName: acceptedFile.name,
      id: '',
      mimeType: acceptedFile.type,
      status: AttachmentStatus.Uploading
    });
  });

  it('updates state correctly when dispatching ADD_MESSAGE_FORM_ATTACHMENT_REQUEST with no existing uploadedFiles', () => {
    const acceptedFile: FileWithPath = {
      name: 'TestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const rejectedFile: InvalidFileUpload = {
      name: 'TestFile.txt',
      reason: 'Some reject reason'
    };

    const nextState = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [acceptedFile],
      rejectedFiles: [rejectedFile]
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      causeOfFailure: rejectedFile.reason,
      fileName: rejectedFile.name,
      id: '',
      mimeType: '',
      status: AttachmentStatus.Failed
    });

    expect(nextState.uploadedAttachments[1]).toEqual({
      fileName: acceptedFile.name,
      id: '',
      mimeType: acceptedFile.type,
      status: AttachmentStatus.Uploading
    });
  });

  it('updates state correctly when dispatching ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS when the file does not exist', () => {
    const existingUploadedFile = {
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const attachmentId = '6c0fd010-927e-4c7a-83bc-c461a65c82aa';

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const nextState = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: attachmentId,
      fileName: 'DifferentFileName.txt'
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      fileName: existingUploadedFile.name,
      id: '',
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Uploading
    });
  });

  it('updates state correctly when dispatching ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS when the file exists', () => {
    const existingUploadedFile = {
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const attachmentId = '6c0fd010-927e-4c7a-83bc-c461a65c82aa';

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const nextState = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: attachmentId,
      fileName: existingUploadedFile.name
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      fileName: existingUploadedFile.name,
      id: attachmentId,
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Uploaded
    });
  });

  it('updates state correctly when dispatching ADD_MESSAGE_FORM_ATTACHMENT_FAILURE when the file exists', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const existingUploadedFile = {
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const nextState = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_FAILURE',
      error,
      fileName: existingUploadedFile.name
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      causeOfFailure: 'Internal server error',
      fileName: existingUploadedFile.name,
      id: '',
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Failed
    });
  });

  it('updates state correctly when dispatching ADD_MESSAGE_FORM_ATTACHMENT_FAILURE when the file does not exist', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const existingUploadedFile = {
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const nextState = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_FAILURE',
      error,
      fileName: existingUploadedFile.name
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      causeOfFailure: 'Internal server error',
      fileName: existingUploadedFile.name,
      id: '',
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Failed
    });
  });

  it('updates state correctly when dispatching DELETE_MESSAGE_FORM_ATTACHMENT_REQUEST when the file exists', () => {
    const existingUploadedFile = {
      id: 'b251396e-1d64-4966-a81b-c66ce2e5ffa7',
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const stateWithFileUploadedSuccess = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: existingUploadedFile.id,
      fileName: existingUploadedFile.name
    });

    const nextState = reducer(stateWithFileUploadedSuccess, {
      type: 'DELETE_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: existingUploadedFile.id
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      fileName: existingUploadedFile.name,
      id: existingUploadedFile.id,
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Deleting
    });
  });

  it('updates state correctly when dispatching DELETE_MESSAGE_FORM_ATTACHMENT_REQUEST when the file does not exist', () => {
    const existingUploadedFile = {
      id: 'b251396e-1d64-4966-a81b-c66ce2e5ffa7',
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const stateWithFileUploadedSuccess = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: existingUploadedFile.id,
      fileName: existingUploadedFile.name
    });

    const nextState = reducer(stateWithFileUploadedSuccess, {
      type: 'DELETE_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: '0d2412e2-b7b0-4664-8fc1-ffc71004416a'
    });

    expect(nextState.uploadedAttachments[0]).toEqual({
      fileName: existingUploadedFile.name,
      id: existingUploadedFile.id,
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Uploaded
    });
  });

  it('updates state correctly when dispatching DELETE_MESSAGE_FORM_ATTACHMENT_SUCCESS when the file exists', () => {
    const existingUploadedFile = {
      id: 'b251396e-1d64-4966-a81b-c66ce2e5ffa7',
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const stateWithFileUploadedSuccess = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: existingUploadedFile.id,
      fileName: existingUploadedFile.name
    });

    const nextState = reducer(stateWithFileUploadedSuccess, {
      type: 'DELETE_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: existingUploadedFile.id
    });

    expect(stateWithFileUploadedSuccess.uploadedAttachments.length).toBe(1);
    expect(nextState.uploadedAttachments.length).toBe(0);
  });

  it('updates state correctly when dispatching DELETE_MESSAGE_FORM_ATTACHMENT_FAILURE when the file does not exist', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const existingUploadedFile = {
      id: 'b251396e-1d64-4966-a81b-c66ce2e5ffa7',
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const stateWithFileUploadedSuccess = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: existingUploadedFile.id,
      fileName: existingUploadedFile.name
    });

    const nextState = reducer(stateWithFileUploadedSuccess, {
      type: 'DELETE_MESSAGE_FORM_ATTACHMENT_FAILURE',
      payload: '1e5145a8-3d52-420f-98c5-395f7c6d63e2',
      error
    });

    expect(nextState.uploadedAttachments[0]).toStrictEqual({
      fileName: existingUploadedFile.name,
      id: existingUploadedFile.id,
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Uploaded
    });
  });

  it('updates state correctly when dispatching DELETE_MESSAGE_FORM_ATTACHMENT_FAILURE when the file exists', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const existingUploadedFile = {
      id: 'b251396e-1d64-4966-a81b-c66ce2e5ffa7',
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const stateWithFileUploadedSuccess = reducer(stateWithFileUploaded, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
      payload: existingUploadedFile.id,
      fileName: existingUploadedFile.name
    });

    const nextState = reducer(stateWithFileUploadedSuccess, {
      type: 'DELETE_MESSAGE_FORM_ATTACHMENT_FAILURE',
      payload: existingUploadedFile.id,
      error
    });

    expect(nextState.uploadedAttachments[0]).toStrictEqual({
      causeOfFailure: 'Internal Server Error',
      fileName: existingUploadedFile.name,
      id: existingUploadedFile.id,
      mimeType: existingUploadedFile.type,
      status: AttachmentStatus.Failed
    });
  });

  it('updates state correctly when dispatching REMOVE_PENDING_MESSAGE_FORM_ATTACHMENTS_REQUEST', () => {
    const existingUploadedFile = {
      id: 'b251396e-1d64-4966-a81b-c66ce2e5ffa7',
      name: 'ExistingTestFile.txt',
      size: 1000,
      lastModified: 2,
      type: 'text/plain',
      slice: null
    };

    const stateWithFileUploaded = reducer(prevState, {
      type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
      payload: [existingUploadedFile],
      rejectedFiles: []
    });

    const nextState = reducer(stateWithFileUploaded, {
      type: 'REMOVE_PENDING_MESSAGE_FORM_ATTACHMENTS_REQUEST'
    });

    expect(stateWithFileUploaded.uploadedAttachments.length).toBe(1);
    expect(nextState.uploadedAttachments.length).toBe(0);
  });
});
