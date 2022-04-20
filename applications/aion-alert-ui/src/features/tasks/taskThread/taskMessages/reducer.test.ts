import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { ICreatedMessage, SenderType } from '../../../../interfaces/message';
import { ICreatedThread } from '../../../../interfaces/thread';
import { initialState, reducer, State as TaskMessagesState } from './reducer';
import { ITaskAssigneeStatus } from '../../../../interfaces/taskAssigneeDetails';
import { OwnerType, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

let prevState: TaskMessagesState;

beforeEach(() => {
  prevState = initialState;
});

describe('Task Messages reducer', () => {
  it('updates state correctly when dispatching FETCH_TASK_MESSAGES_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_MESSAGES_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_TASK_MESSAGES_SUCCESS', () => {
    const message: ICreatedMessage = {
      attachments: [
        {
          id: '',
          fileName: 'TestFile.txt',
          mimeType: 'text/plain',
          status: AttachmentStatus.Uploading
        }
      ],
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

    const totalCount = 10;

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_MESSAGES_SUCCESS',
      taskMessages: [message],
      totalCount
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.totalCount).toBe(totalCount);
    expect(nextState.taskMessages[0]).toStrictEqual({
      ...message,
      attachments: message.attachments.map(attachment => ({ ...attachment, status: AttachmentStatus.Uploaded }))
    });
  });

  it('updates state correctly when dispatching ADD_THREAD_WITH_MESSAGE_SUCCESS with no existing task messages', () => {
    const thread: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: OwnerType.Organization,
      participants: [],
      subject: 'Thread Subject'
    };

    const payload: ICreatedMessage = {
      attachments: [
        {
          id: '',
          fileName: 'TestFile.txt',
          mimeType: 'text/plain',
          status: AttachmentStatus.Uploading
        }
      ],
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
      type: 'ADD_THREAD_WITH_MESSAGE_SUCCESS',
      payload,
      status,
      thread,
      sortOrder: 'asc'
    });

    expect(nextState.taskMessages[0]).toStrictEqual(payload);
    expect(nextState.totalCount).toBe(1);
  });

  it('updates state correctly when dispatching ADD_THREAD_WITH_MESSAGE_SUCCESS with an existing task message', () => {
    const thread: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: OwnerType.Organization,
      participants: [],
      subject: 'Thread Subject'
    };

    const existingMessage: ICreatedMessage = {
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

    const payload: ICreatedMessage = {
      attachments: [
        {
          id: '',
          fileName: 'TestFile.txt',
          mimeType: 'text/plain',
          status: AttachmentStatus.Uploaded
        }
      ],
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

    const stateWithTaskMessage = reducer(prevState, {
      type: 'FETCH_TASK_MESSAGES_SUCCESS',
      taskMessages: [existingMessage],
      totalCount: 1
    });

    const nextState = reducer(stateWithTaskMessage, {
      type: 'ADD_THREAD_WITH_MESSAGE_SUCCESS',
      payload,
      status,
      thread,
      sortOrder: 'asc'
    });

    expect(nextState.totalCount).toBe(2);
    expect(nextState.taskMessages[0]).toStrictEqual(payload);
    expect(nextState.taskMessages[1]).toStrictEqual(existingMessage);
  });

  it('updates state correctly when dispatching FETCH_TASK_MESSAGES_FAILURE', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_MESSAGES_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toStrictEqual(error);
  });

  it('updates state correctly when dispatching COMPLETE_TASK_SUCCESS when taskMessages is null', () => {
    const message: ICreatedMessage = {
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

    const payload: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const nextState = reducer(prevState, {
      type: 'COMPLETE_TASK_SUCCESS',
      message,
      payload
    });

    expect(nextState.totalCount).toBe(1);
    expect(nextState.taskMessages[0]).toStrictEqual(message);
  });

  it('updates state correctly when dispatching COMPLETE_TASK_SUCCESS when taskMessages is not null', () => {
    const existingMessage: ICreatedMessage = {
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

    const newMessage: ICreatedMessage = {
      attachments: [],
      content: 'New Test Content',
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
      messageId: newMessage.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: existingMessage,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'COMPLETE_TASK_SUCCESS',
      payload: status,
      message: newMessage
    });

    expect(nextState.totalCount).toBe(2);
    expect(nextState.taskMessages[0]).toStrictEqual(newMessage);
    expect(nextState.taskMessages[1]).toStrictEqual(existingMessage);
  });

  it('updates state correctly when dispatching ADD_THREAD_AND_COMPLETE_TASK_SUCCESS when taskMessages is null', () => {
    const payload: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: OwnerType.Organization,
      participants: [],
      subject: 'Thread Subject'
    };

    const message: ICreatedMessage = {
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
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_AND_COMPLETE_TASK_SUCCESS',
      payload,
      message,
      status
    });

    expect(nextState.totalCount).toBe(1);
    expect(nextState.taskMessages[0]).toStrictEqual(message);
  });

  it('updates state correctly when dispatching ADD_THREAD_AND_COMPLETE_TASK_SUCCESS when taskMessages is not null', () => {
    const payload: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: OwnerType.Organization,
      participants: [],
      subject: 'Thread Subject'
    };

    const existingMessage: ICreatedMessage = {
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

    const newMessage: ICreatedMessage = {
      attachments: [],
      content: 'New Test Content',
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
      messageId: newMessage.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: existingMessage,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'ADD_THREAD_AND_COMPLETE_TASK_SUCCESS',
      payload,
      status: status,
      message: newMessage
    });

    expect(nextState.totalCount).toBe(2);
    expect(nextState.taskMessages[0]).toStrictEqual(newMessage);
    expect(nextState.taskMessages[1]).toStrictEqual(existingMessage);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST when message attachment exists', () => {
    const attachmentId = '516cabd1-3284-419c-a52a-03411afd4d59';

    const message: ICreatedMessage = {
      attachments: [
        {
          id: attachmentId,
          status: AttachmentStatus.Uploaded,
          fileName: 'ExistingTestFile.txt',
          mimeType: 'text/plain'
        }
      ],
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
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: message,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST',
      payload: attachmentId
    });

    expect(nextState.taskMessages[0].attachments[0].status).toStrictEqual(AttachmentStatus.Downloading);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST when message attachment does not exist', () => {
    const attachmentId = '516cabd1-3284-419c-a52a-03411afd4d59';

    const message: ICreatedMessage = {
      attachments: [
        {
          id: attachmentId,
          status: AttachmentStatus.Uploaded,
          fileName: 'ExistingTestFile.txt',
          mimeType: 'text/plain'
        }
      ],
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
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: message,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST',
      payload: '752c9540-a0c0-41a1-96a4-36f9f4e6177d'
    });

    expect(nextState.taskMessages[0].attachments[0].status).toStrictEqual(message.attachments[0].status);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST when taskMessags is null', () => {
    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST',
      payload: '752c9540-a0c0-41a1-96a4-36f9f4e6177d'
    });

    expect(prevState.taskMessages).toStrictEqual(nextState.taskMessages);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS when message attachment exists', () => {
    const attachmentId = '516cabd1-3284-419c-a52a-03411afd4d59';

    const message: ICreatedMessage = {
      attachments: [
        {
          id: attachmentId,
          status: AttachmentStatus.Uploaded,
          fileName: 'ExistingTestFile.txt',
          mimeType: 'text/plain'
        }
      ],
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
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: message,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS',
      payload: attachmentId
    });

    expect(nextState.taskMessages[0].attachments[0].status).toStrictEqual(AttachmentStatus.Uploaded);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS when message attachment does not exist', () => {
    const attachmentId = '516cabd1-3284-419c-a52a-03411afd4d59';

    const message: ICreatedMessage = {
      attachments: [
        {
          id: attachmentId,
          status: AttachmentStatus.Uploaded,
          fileName: 'ExistingTestFile.txt',
          mimeType: 'text/plain'
        }
      ],
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
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: message,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS',
      payload: '752c9540-a0c0-41a1-96a4-36f9f4e6177d'
    });

    expect(nextState.taskMessages[0].attachments[0].status).toStrictEqual(message.attachments[0].status);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS when taskMessags is null', () => {
    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS',
      payload: '752c9540-a0c0-41a1-96a4-36f9f4e6177d'
    });

    expect(prevState.taskMessages).toStrictEqual(nextState.taskMessages);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE when message attachment exists', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const attachmentId = '516cabd1-3284-419c-a52a-03411afd4d59';

    const message: ICreatedMessage = {
      attachments: [
        {
          id: attachmentId,
          status: AttachmentStatus.Uploaded,
          fileName: 'ExistingTestFile.txt',
          mimeType: 'text/plain'
        }
      ],
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
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: message,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE',
      payload: attachmentId,
      error
    });

    expect(nextState.taskMessages[0].attachments[0]).toStrictEqual({
      ...message.attachments[0],
      causeOfFailure: 'Internal Server Error',
      status: AttachmentStatus.Failed
    });
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE when message attachment does not exist', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const attachmentId = '516cabd1-3284-419c-a52a-03411afd4d59';

    const message: ICreatedMessage = {
      attachments: [
        {
          id: attachmentId,
          status: AttachmentStatus.Uploaded,
          fileName: 'ExistingTestFile.txt',
          mimeType: 'text/plain'
        }
      ],
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
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskMessages = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload: message,
      status,
      sortOrder: 'asc'
    });

    const nextState = reducer(stateWithTaskMessages, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE',
      payload: '752c9540-a0c0-41a1-96a4-36f9f4e6177d',
      error
    });

    expect(nextState.taskMessages[0].attachments[0].status).toStrictEqual(message.attachments[0].status);
  });

  it('updates state correctly when dispatching DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE when taskMessags is null', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE',
      payload: '752c9540-a0c0-41a1-96a4-36f9f4e6177d',
      error
    });

    expect(prevState.taskMessages).toStrictEqual(nextState.taskMessages);
  });

  it('updates state correctly when dispatching FETCH_TASK_ASSIGNEE_DETAILS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_REQUEST'
    });

    expect(nextState).toStrictEqual(initialState);
  });
});
