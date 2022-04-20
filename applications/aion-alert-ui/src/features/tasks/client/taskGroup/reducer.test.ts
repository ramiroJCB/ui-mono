import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { AxiosError } from 'axios';
import { initialState, reducer, State as TaskGroupState } from './reducer';
import { ITaskGroup, OwnerType, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

const { Deleting, Downloading, Failed, Uploaded, Uploading } = AttachmentStatus;

let prevState: TaskGroupState;

beforeEach(() => {
  prevState = {
    ...initialState,
    pendingAttachments: [
      {
        fileName: 'TestFile.txt',
        id: '',
        status: Uploading,
        mimeType: 'application/text'
      }
    ]
  };
});

describe('Task Group reducer', () => {
  it('updates state correctly when dispatching FETCH_TASK_GROUP_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUP_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_TASK_GROUP_SUCCESS', () => {
    const { Organization } = OwnerType;
    const taskGroup: ITaskGroup = {
      id: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      ownerType: Organization,
      ownerId: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      ownerName: 'Test Owner',
      assigneeGroups: [],
      subject: 'Test Subject',
      content: 'Test Content',
      attachments: [],
      ignoredAssigneeGroups: [],
      dueDateUtc: '2017-01-12T03:00:00Z',
      status: TaskStatus.AwaitingAction,
      canAssigneeComplete: true,
      isAttachmentRequiredForCompletion: false,
      createdDateUtc: '2019-03-22T03:00:00Z',
      createdByUserId: 'bc616e14-76d8-4cc0-a9ca-0e0d512c85b8',
      meta: {
        assigneeCount: 13,
        awaitingActionCount: 1,
        incompleteCount: 5,
        completeCount: 14
      }
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUP_SUCCESS',
      payload: taskGroup
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBeNull();
    expect(prevState.taskGroup).toBeNull();
    expect(nextState.taskGroup).toEqual(taskGroup);
  });

  it('updates state correctly when dispatching FETCH_TASK_GROUP_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TASK_GROUP_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toEqual(error);
  });

  it('updates state correctly when dispatching DELETE_TASK_GROUP_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_TASK_GROUP_REQUEST'
    });

    expect(prevState.isDeleting).toBe(false);
    expect(nextState.isDeleting).toBe(true);
  });

  it('updates state correctly when dispatching DELETE_TASK_GROUP_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_TASK_GROUP_SUCCESS'
    });

    expect(nextState.isDeleting).toBe(false);
  });

  it('updates state correctly when dispatching DELETE_TASK_GROUP_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'DELETE_TASK_GROUP_FAILURE',
      error
    });

    expect(nextState.isDeleting).toBe(false);
    expect(nextState.error).toEqual(error);
  });

  it('updates state correctly when dispatching ADD_TASK_GROUP_ATTACHMENT_REQUEST', () => {
    const fileWithPath = { name: 'testfile', lastModified: 1, size: 0, slice: null, type: '', path: 'testpath' };

    const rejectedFile = { name: 'testfailfile', reason: 'Unit test' };

    const nextState = reducer(prevState, {
      type: 'ADD_TASK_GROUP_ATTACHMENT_REQUEST',
      payload: [fileWithPath],
      rejectedFiles: [rejectedFile]
    });

    expect(nextState.pendingAttachments[1]).toEqual({
      causeOfFailure: rejectedFile.reason,
      fileName: rejectedFile.name,
      id: '',
      mimeType: '',
      status: Failed
    });
    expect(nextState.pendingAttachments[2]).toEqual({
      fileName: fileWithPath.name,
      id: '',
      mimeType: '',
      status: Uploading
    });
  });

  it('updates state correctly when dispatching ADD_TASK_GROUP_ATTACHMENT_SUCCESS', () => {
    const existingPendingAttachment = prevState.pendingAttachments[0];
    const newFileId = '9e299acb-d106-4c7f-ad0f-5f35a2d69c8e';

    const nextState = reducer(prevState, {
      type: 'ADD_TASK_GROUP_ATTACHMENT_SUCCESS',
      payload: newFileId,
      fileName: existingPendingAttachment.fileName
    });

    expect(nextState.pendingAttachments[0]).toEqual({
      ...existingPendingAttachment,
      id: newFileId,
      status: Uploaded
    });
  });

  it('updates state correctly when dispatching ADD_TASK_GROUP_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const existingPendingAttachment = prevState.pendingAttachments[0];

    const nextState = reducer(prevState, {
      type: 'ADD_TASK_GROUP_ATTACHMENT_FAILURE',
      error,
      fileName: existingPendingAttachment.fileName
    });

    expect(nextState.pendingAttachments[0]).toEqual({
      ...existingPendingAttachment,
      causeOfFailure: 'Internal server error',
      status: Failed
    });
  });

  it('updates state correctly when dispatching DOWNLOAD_TASK_GROUP_ATTACHMENT_REQUEST', () => {
    const existingPendingAttachment = prevState.pendingAttachments[0];

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_TASK_GROUP_ATTACHMENT_REQUEST',
      payload: existingPendingAttachment.id
    });

    expect(nextState.pendingAttachments[0]).toEqual({
      ...existingPendingAttachment,
      status: Downloading
    });
  });

  it('updates state correctly when dispatching DOWNLOAD_TASK_GROUP_ATTACHMENT_SUCCESS', () => {
    const existingPendingAttachment = prevState.pendingAttachments[0];

    const nextState = reducer(prevState, {
      type: 'DOWNLOAD_TASK_GROUP_ATTACHMENT_SUCCESS',
      payload: existingPendingAttachment.id
    });

    expect(nextState.pendingAttachments[0]).toEqual({
      ...existingPendingAttachment,
      status: Uploaded
    });
  });

  it('updates state correctly when dispatching DELETE_TASK_GROUP_ATTACHMENT_REQUEST', () => {
    const existingPendingAttachment = prevState.pendingAttachments[0];

    const nextState = reducer(prevState, {
      type: 'DELETE_TASK_GROUP_ATTACHMENT_REQUEST',
      payload: existingPendingAttachment.id
    });

    expect(nextState.pendingAttachments[0]).toEqual({
      ...existingPendingAttachment,
      status: Deleting
    });
  });

  it('updates state correctly when dispatching DELETE_TASK_GROUP_ATTACHMENT_SUCCESS', () => {
    const existingPendingAttachment = prevState.pendingAttachments[0];

    const nextState = reducer(prevState, {
      type: 'DELETE_TASK_GROUP_ATTACHMENT_SUCCESS',
      payload: existingPendingAttachment.id
    });

    expect(nextState.pendingAttachments.length).toBe(0);
  });
});
