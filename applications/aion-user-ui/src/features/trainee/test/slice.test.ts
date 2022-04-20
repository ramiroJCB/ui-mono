import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchTrainee, initialState, traineeReducer } from '../slice';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';

let prevState: typeof initialState;
const axiosMock = new MockAdapter(axios);
const error = new Error('test error');

beforeEach(() => {
  axiosMock.reset();
  prevState = initialState;
});

describe('trainee reducer', () => {
  test('trainee/fetchTrainee/pending', () => {
    const nextState = traineeReducer(prevState, fetchTrainee.pending);

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  test('trainee/fetchTrainee/fulfilled', () => {
    const payload: ITrainee = {
      id: 'f795adfb-31a6-4850-9081-54671765b682',
      addressLine1: '123 Hail The Satch Lane',
      addressLine2: null,
      birthDate: '1980-01-01T00:00:00',
      city: null,
      country: null,
      createdDate: '2014-10-28T14:21:00',
      emailAddress: 'SatchMeister@hotmail.com',
      emergencyContactName: 'Rubina Satriani',
      emergencyContactPhoneNumber: '2382874293',
      emergencyContactRelation: '',
      firstName: 'Joe',
      isDeleted: false,
      lastName: 'Satriani',
      middleInitial: null,
      nameSuffix: null,
      pecIdentifier: null,
      phoneNumber: null,
      photoUpload: null,
      photoUrl: null,
      ssnLastFour: '1245',
      state: 'CA',
      updatedDate: '2020-01-03T16:01:40',
      userId: '00a2fc64-7083-4e5f-9528-b00822b8fbdb',
      zip: '05882'
    };

    const nextState = traineeReducer(prevState, fetchTrainee.fulfilled(payload, ''));

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.trainee).toEqual(payload);
  });

  test('trainee/fetchTrainee/rejected', () => {
    axiosMock.onPost('/spapi/errors').reply(200);
    const nextState = traineeReducer(prevState, fetchTrainee.rejected(error, ''));

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error?.message).toEqual(error.message);
  });

  test('trainee returns undefined', () => {
    const payload = undefined;
    const nextState = traineeReducer(prevState, fetchTrainee.fulfilled(payload, ''));

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.trainee).toEqual(payload);
  });
});
