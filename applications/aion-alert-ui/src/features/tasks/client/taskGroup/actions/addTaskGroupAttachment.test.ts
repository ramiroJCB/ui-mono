import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';

import {
  Actions,
  addTaskGroupAttachment,
  addTaskGroupAttachmentRequest,
  addTaskGroupAttachmentSuccess,
  addTaskGroupAttachmentFailure
} from './addTaskGroupAttachment';

import { FileWithPath } from 'react-dropzone';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { RootState } from 'combineReducers';

const acceptedFiles: FileWithPath[] = [new File([], 'test.png', { type: 'image/png' })];
const rejectedFiles: InvalidFileUpload[] = [
  {
    name: 'badFile.jpeg',
    reason: 'too big'
  }
];

const response = {
  id: '835d668b-0571-4e00-87a7-da6a38046833'
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<Partial<RootState>, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const initialState = {
  error: null,
  pendingAttachments: []
};

const store = mockStore(initialState);

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

it('adds task group attachment successfully', async () => {
  axiosMock.onPost(`/files/v3.01/taskGroupAttachments`).reply(200, response);
  await store.dispatch(addTaskGroupAttachment(acceptedFiles, rejectedFiles));

  const actions = store.getActions();
  expect(actions[0]).toEqual(addTaskGroupAttachmentRequest(acceptedFiles, rejectedFiles));
  expect(actions[1]).toEqual(addTaskGroupAttachmentSuccess(response.id, acceptedFiles[0].name));
});

it('adds multiple task group attachments successfully', async () => {
  const multipleAcceptedFiles: FileWithPath[] = [
    new File([], 'test.png', { type: 'image/png' }),
    new File([], 'test2.png', { type: 'image/png' })
  ];
  axiosMock.onPost(`/files/v3.01/taskGroupAttachments`).reply(200, response);
  await store.dispatch(addTaskGroupAttachment(multipleAcceptedFiles, rejectedFiles));

  const actions = store.getActions();

  expect(actions[0]).toEqual(addTaskGroupAttachmentRequest(multipleAcceptedFiles, rejectedFiles));
  expect(actions[1]).toEqual(addTaskGroupAttachmentSuccess(response.id, multipleAcceptedFiles[0].name));
  expect(actions[2]).toEqual(addTaskGroupAttachmentSuccess(response.id, multipleAcceptedFiles[1].name));
});

it('adds task group attachment successfully with call to encodeURIComponent for fileName', async () => {
  axiosMock.onPost(`/files/v3.01/taskGroupAttachments`).reply(200, response);
  const axiosSpy = jest.spyOn(axios, 'post');
  const encodeUriComponentSpy = jest.spyOn(window, 'encodeURIComponent');

  await store.dispatch(addTaskGroupAttachment(acceptedFiles, rejectedFiles));

  const expectedFormData = new FormData();
  expectedFormData.append(
    'value',
    new Blob([acceptedFiles[0]], { type: acceptedFiles[0].type }),
    encodeURIComponent(acceptedFiles[0].name)
  );

  expect(axiosSpy).toHaveBeenCalledWith(`/files/v3.01/taskGroupAttachments`, expectedFormData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  expect(encodeUriComponentSpy).toHaveBeenCalledWith(acceptedFiles[0].name);
});

it('fails to add attachment', async () => {
  try {
    axiosMock.onPost('/spapi/errors').reply(200);
    axiosMock.onPost(`/files/v3.01/taskGroupAttachments`).networkError();
    await store.dispatch(addTaskGroupAttachment(acceptedFiles, rejectedFiles));
  } catch (error) {
    const actions = store.getActions();
    expect(actions[0]).toEqual(addTaskGroupAttachmentRequest(acceptedFiles, rejectedFiles));
    expect(actions[1]).toEqual(addTaskGroupAttachmentFailure(error, acceptedFiles[0].name));
  }
});
