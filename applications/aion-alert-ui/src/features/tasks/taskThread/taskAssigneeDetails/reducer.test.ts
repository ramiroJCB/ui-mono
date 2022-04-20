import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { ICreatedMessage, SenderType } from '../../../../interfaces/message';
import { ICreatedThread } from '../../../../interfaces/thread';
import { initialState, reducer, State as TaskAssigneeDetailsState } from './reducer';
import { ITaskAssigneeDetails, ITaskAssigneeStatus } from '../../../../interfaces/taskAssigneeDetails';
import { OwnerType, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

const { Downloading, Failed, Uploaded } = AttachmentStatus;
const { Organization } = OwnerType;

let prevState: TaskAssigneeDetailsState;

beforeEach(() => {
  prevState = initialState;
});

describe('Task Assignee Details reducer', () => {
  it('updates state correctly when dispatching FETCH_TASK_ASSIGNEE_DETAILS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS', () => {
    const payload: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.taskAssigneeDetails).toEqual(payload);
    expect(nextState.error).toBeNull();
  });

  it('updates state correctly when dispatching FETCH_TASK_ASSIGNEE_DETAILS_FAILURE', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBe(error);
  });

  it('updates state correctly when dispatching ADD_THREAD_AND_COMPLETE_TASK_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_AND_COMPLETE_TASK_REQUEST'
    });

    expect(prevState.isCompleting).toBe(false);
    expect(nextState.isCompleting).toBe(true);
  });

  it('updates state correctly when dispatching COMPLETE_TASK_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_AND_COMPLETE_TASK_REQUEST'
    });

    expect(prevState.isCompleting).toBe(false);
    expect(nextState.isCompleting).toBe(true);
  });

  it('updates state correctly when dispatching COMPLETE_TASK_SUCCESS if taskAssigneeDetails is null', () => {
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

    expect(nextState.isCompleting).toBe(false);
    expect(nextState.taskAssigneeDetails).toBe(null);
  });

  it('updates state correctly when dispatching COMPLETE_TASK_SUCCESS if taskAssigneeDetails is not null', () => {
    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
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

    const taskAssigneeStatus: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskAssigneeDetail = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetail, {
      type: 'COMPLETE_TASK_SUCCESS',
      message,
      payload: taskAssigneeStatus
    });

    expect(nextState.isCompleting).toBe(false);
    expect(nextState.taskAssigneeDetails).toStrictEqual({ ...taskAssigneeDetails, statuses: [taskAssigneeStatus] });
  });

  it('updates state correctly when dispatching ADD_THREAD_AND_COMPLETE_TASK_SUCCESS if taskAssigneeDetails is null', () => {
    const payload: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: Organization,
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
      message,
      payload,
      status
    });

    expect(nextState.isCompleting).toBe(false);
    expect(nextState.taskAssigneeDetails).toBe(null);
  });

  it('updates state correctly when dispatching ADD_THREAD_AND_COMPLETE_TASK_SUCCESS if taskAssigneeDetails is not null', () => {
    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const createdThread: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: Organization,
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

    const taskAssigneeStatus: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: message.id,
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskAssigneeDetail = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetail, {
      type: 'ADD_THREAD_AND_COMPLETE_TASK_SUCCESS',
      message,
      payload: createdThread,
      status: taskAssigneeStatus
    });

    expect(nextState.isCompleting).toBe(false);
    expect(nextState.taskAssigneeDetails).toStrictEqual({
      ...taskAssigneeDetails,
      statuses: [taskAssigneeStatus],
      threadId: createdThread.id
    });
  });

  it('updates state correctly when dispatching ADD_MESSAGE_SUCCESS if taskAssigneeDetails is null', () => {
    const payload: ICreatedMessage = {
      attachments: [],
      content: 'Test Content',
      createdByUserId: 'be825bdb-12e5-4275-bf80-f6cfbc4fbd28',
      createdByUserName: 'Test Username',
      createdDateUtc: new Date().toISOString(),
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      isDeleted: false,
      recipients: [],
      senderId: '337e5a11-f627-4015-9a35-d33efeb725a9',
      senderName: 'Test Sender',
      senderType: SenderType.Organization
    };

    const status: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: '643b4330-b466-482e-baa7-9bdba37ebc0e',
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const nextState = reducer(prevState, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload,
      status,
      sortOrder: 'asc'
    });

    expect(nextState.taskAssigneeDetails).toBe(null);
  });

  it('updates state correctly when dispatching ADD_MESSAGE_SUCCESS if taskAssigneeDetails is not null', () => {
    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const payload: ICreatedMessage = {
      attachments: [],
      content: 'Test Content',
      createdByUserId: 'e8bf32cd-0b50-4b9e-8037-46a585e414d2',
      createdByUserName: 'Test Username',
      createdDateUtc: new Date().toISOString(),
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      isDeleted: false,
      recipients: [],
      senderId: 'e83c0a45-000f-4c2b-a0bb-d097cc6fe807',
      senderName: 'Test Sender',
      senderType: SenderType.Organization
    };

    const status: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: '643b4330-b466-482e-baa7-9bdba37ebc0e',
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const stateWithTaskAssigneeDetail = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetail, {
      type: 'ADD_MESSAGE_SUCCESS',
      payload,
      status,
      sortOrder: 'asc'
    });

    expect(nextState.taskAssigneeDetails).toStrictEqual({ ...taskAssigneeDetails, statuses: [status] });
  });

  it('updates state correctly when dispatching ADD_THREAD_WITH_MESSAGE_SUCCESS if taskAssigneeDetails is null', () => {
    const payload: ICreatedMessage = {
      attachments: [],
      content: 'Test Content',
      createdByUserId: '46138bf7-3017-4af1-80af-ab84c10f03d9',
      createdByUserName: 'Test Username',
      createdDateUtc: new Date().toISOString(),
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      isDeleted: false,
      recipients: [],
      senderId: '7bfa86aa-1caa-42a5-bb49-897342eabdfb',
      senderName: 'Test Sender',
      senderType: SenderType.Organization
    };

    const status: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: '643b4330-b466-482e-baa7-9bdba37ebc0e',
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const thread: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: Organization,
      participants: [],
      subject: 'Thread Subject'
    };

    const nextState = reducer(prevState, {
      type: 'ADD_THREAD_WITH_MESSAGE_SUCCESS',
      payload,
      status,
      sortOrder: 'asc',
      thread
    });

    expect(nextState.taskAssigneeDetails).toBe(null);
  });

  it('updates state correctly when dispatching ADD_THREAD_WITH_MESSAGE_SUCCESS if taskAssigneeDetails is not null', () => {
    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const payload: ICreatedMessage = {
      attachments: [],
      content: 'Test Content',
      createdByUserId: '9346ba08-1ffa-4db6-8405-dfb4e1b47979',
      createdByUserName: 'Test Username',
      createdDateUtc: new Date().toISOString(),
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      isDeleted: false,
      recipients: [],
      senderId: 'a22185c2-e682-481d-872b-8a93c53f9562',
      senderName: 'Test Sender',
      senderType: SenderType.Organization
    };

    const status: ITaskAssigneeStatus = {
      id: '0e41e42a-15ed-44e1-b100-b8b3906bc586',
      messageId: '643b4330-b466-482e-baa7-9bdba37ebc0e',
      status: TaskStatus.Complete,
      createdDateUtc: new Date().toISOString()
    };

    const thread: ICreatedThread = {
      canOnlyMessageOwner: true,
      id: '0760bc07-2609-409e-befd-b824f5ea81f1',
      messages: [],
      ownerId: 'd16f2feb-bb36-4432-9bcf-6106e2382821',
      ownerType: Organization,
      participants: [],
      subject: 'Thread Subject'
    };

    const stateWithTaskAssigneeDetail = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetail, {
      type: 'ADD_THREAD_WITH_MESSAGE_SUCCESS',
      payload,
      status,
      sortOrder: 'asc',
      thread
    });

    expect(nextState.taskAssigneeDetails).toStrictEqual({
      ...taskAssigneeDetails,
      statuses: [status],
      threadId: thread.id
    });
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST if taskAssigneeDetails is null', () => {
    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST',
      payload
    });

    expect(nextState.taskAssigneeDetails).toBe(null);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST if taskAssigneeDetails is not null and does not have attachment with payload id', () => {
    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const attachmentWithStatus = { id: payload, status: Uploaded, fileName: 'TestFile.txt', mimeType: 'text/plain' };

    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [attachmentWithStatus],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const stateWithTaskAssigneeDetails = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetails, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST',
      payload: 'b79dad07-971c-476b-ba27-90b5046c0576'
    });

    expect(stateWithTaskAssigneeDetails.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      attachmentWithStatus
    ]);
    expect(nextState.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([attachmentWithStatus]);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST if taskAssigneeDetails is not null and has attachment with payload id', () => {
    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const attachmentWithStatus = { id: payload, status: Uploaded, fileName: 'TestFile.txt', mimeType: 'text/plain' };

    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [attachmentWithStatus],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const stateWithTaskAssigneeDetails = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetails, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST',
      payload
    });

    expect(stateWithTaskAssigneeDetails.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      attachmentWithStatus
    ]);
    expect(nextState.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      {
        ...attachmentWithStatus,
        status: Downloading
      }
    ]);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS if taskAssigneeDetails is null', () => {
    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS',
      payload
    });

    expect(nextState.taskAssigneeDetails).toBe(null);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS if taskAssigneeDetails is not null and does not have attachment with payload id', () => {
    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const attachmentWithStatus = { id: payload, status: Uploaded, fileName: 'TestFile.txt', mimeType: 'text/plain' };

    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [attachmentWithStatus],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const stateWithTaskAssigneeDetails = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetails, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS',
      payload: 'b79dad07-971c-476b-ba27-90b5046c0576'
    });

    expect(stateWithTaskAssigneeDetails.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      attachmentWithStatus
    ]);
    expect(nextState.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([attachmentWithStatus]);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS if taskAssigneeDetails is not null and has attachment with payload id', () => {
    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const attachmentWithStatus = { id: payload, status: Uploaded, fileName: 'TestFile.txt', mimeType: 'text/plain' };

    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [attachmentWithStatus],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const stateWithTaskAssigneeDetails = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetails, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS',
      payload
    });

    expect(stateWithTaskAssigneeDetails.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      attachmentWithStatus
    ]);
    expect(nextState.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      {
        ...attachmentWithStatus,
        status: Uploaded
      }
    ]);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE if taskAssigneeDetails is null', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE',
      payload,
      error
    });

    expect(nextState.taskAssigneeDetails).toBe(null);
    expect(nextState.error).toBe(error);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE if taskAssigneeDetails is not null and does not have attachment with payload id', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const attachmentWithStatus = { id: payload, status: Uploaded, fileName: 'TestFile.txt', mimeType: 'text/plain' };

    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [attachmentWithStatus],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const stateWithTaskAssigneeDetails = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetails, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE',
      payload: 'b79dad07-971c-476b-ba27-90b5046c0576',
      error
    });

    expect(stateWithTaskAssigneeDetails.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      attachmentWithStatus
    ]);
    expect(nextState.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([attachmentWithStatus]);
  });

  it('updates state correctly when dispatching DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE if taskAssigneeDetails is not null and has attachment with payload id', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const payload = '8d90cc3b-f091-4647-92f8-4d301187a3e2';

    const attachmentWithStatus = { id: payload, status: Uploaded, fileName: 'TestFile.txt', mimeType: 'text/plain' };

    const taskAssigneeDetails: ITaskAssigneeDetails = {
      id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
      assignees: [],
      taskNumber: 8761,
      statuses: [],
      threadId: null,
      meta: {
        taskGroup: {
          id: 'e68ff513-29b2-43a6-a810-fb1a1957aadf',
          ownerType: Organization,
          ownerId: '7b3beb80-8ab9-4c7e-a6a4-f33cd8cd4d08',
          ownerName: 'Test Owner',
          assigneeGroups: [],
          ignoredAssigneeGroups: [],
          subject: 'Test Subject',
          content: 'Test Content',
          canAssigneeComplete: false,
          attachments: [attachmentWithStatus],
          dueDateUtc: new Date().toISOString(),
          status: TaskStatus.Complete,
          isAttachmentRequiredForCompletion: false,
          createdDateUtc: new Date().toISOString(),
          createdByUserId: '0c4f5928-a132-47f4-b6b9-ee2cdc7c7fc3',
          meta: {
            assigneeCount: 6,
            awaitingActionCount: 2,
            incompleteCount: 2,
            completeCount: 2
          }
        }
      }
    };

    const stateWithTaskAssigneeDetails = reducer(prevState, {
      type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
      payload: taskAssigneeDetails
    });

    const nextState = reducer(stateWithTaskAssigneeDetails, {
      type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE',
      payload,
      error
    });

    expect(stateWithTaskAssigneeDetails.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      attachmentWithStatus
    ]);
    expect(nextState.taskAssigneeDetails.meta.taskGroup.attachments).toStrictEqual([
      {
        ...attachmentWithStatus,
        causeOfFailure: 'Internal Server Error',
        status: Failed
      }
    ]);
  });
});
