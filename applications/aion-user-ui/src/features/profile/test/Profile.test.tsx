import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import { initialState as traineeInitialState } from '../../trainee/slice';
import { initialState as traineeCourseCreditsInitialState } from '../../traineeCourseCredits/slice';
import { ITraineeCourseCredit } from 'interfaces/traineeCourseCredit';
import { Profile } from '../Profile';
import { renderWithProviders, screen } from 'common/utils/test-utils';
import { userInfo } from '../../../../fixtures';
import '@pec/aion-ui-i18next';

const traineeTest = {
  value: [
    {
      id: 'f795adfb-31a6-4850-9081-54671765b682',
      addressLine1: '123 Hail The Satch Lane',
      addressLine2: null,
      birthDate: '1980-01-01T00:00:00',
      city: 'Satch',
      country: null,
      createdDate: '2014-10-28T14:21:00',
      emailAddress: 'SatchMeister@hotmail.com',
      emergencyContactName: 'Rubina Satriani',
      emergencyContactPhoneNumber: '2382874293',
      emergencyContactRelation: 'Satchs Biggest Fan',
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
    }
  ]
};

const courseCreditTest: { value: ITraineeCourseCredit[] } = {
  value: [
    {
      completionDate: '2015-04-13T14:05:48.113',
      courseExpired: false,
      courseName: 'PEC- Back Safety',
      granfathered: false,
      passed: true,
      retrainingNecessary: false,
      revoked: false,
      traineeId: '9fba2710-4ed9-e811-a9bb-8b450c7facc1',
      trainingCourseId: '63d9288b-df8a-4c9f-9f16-7217e5ddfa1e',
      trainingLevel: 'Full Training',
      updatedDateUtc: '2019-11-15T15:18:47.147',
      userId: '0adda027-f615-4770-b7d8-d3456ab62f73',
      validatingCompanyId: null,
      validatingCompanyName: 'PEC/PREMIER SAFETY MANAGEMENT'
    }
  ]
};

const axiosMock = new MockAdapter(axios);

describe('view profile', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('can show a loading spinner and renders an error message if there was an error fetching the trainee', async () => {
    axiosMock.onGet('/api/v2/userInfo').reply(200, userInfo);
    axiosMock.onGet('/api/v3.01/trainees').reply(500);
    axiosMock.onGet('/api/v3.01/traineeCourseCredits').reply(200, { value: [] });
    axiosMock.onPost('/spapi/errors').reply(200);

    renderWithProviders(<Profile />, {
      initialState: { trainee: traineeInitialState, traineeCourseCredits: traineeCourseCreditsInitialState }
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByTitle('Error')).toBeDefined();
  });

  it('can show a loading spinner and renders an error message if there was an error fetching the traineeCourseCredits', async () => {
    axiosMock.onGet('/api/v2/userInfo').reply(200, userInfo);
    axiosMock.onGet('/api/v3.01/trainees').reply(200, traineeTest);
    axiosMock.onGet('/api/v3.01/traineeCourseCredits').reply(500);
    axiosMock.onPost('/spapi/errors').reply(200);

    renderWithProviders(<Profile />, {
      initialState: { trainee: traineeInitialState, traineeCourseCredits: traineeCourseCreditsInitialState }
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByTitle('Error')).toBeDefined();
  });

  it('can show a loading spinner and then renders the training history component if the user has a trainee and traineeCourseCredits', async () => {
    axiosMock.onGet('/api/v2/userInfo').reply(200, userInfo);
    axiosMock.onGet('/api/v3.01/trainees').reply(200, traineeTest);
    axiosMock.onGet('/api/v3.01/traineeCourseCredits').reply(200, courseCreditTest);

    renderWithProviders(<Profile />, {
      initialState: { trainee: traineeInitialState, traineeCourseCredits: traineeCourseCreditsInitialState }
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const { firstName, lastName } = traineeTest.value[0];

    expect(screen.getByText(`${firstName} ${lastName}`)).toBeTruthy();
    expect(screen.getByText(courseCreditTest.value[0].validatingCompanyName)).toBeTruthy();
  });

  it('can show a loading spinner and then still renders the training history component if the user has a trainee and no traineeCourseCredits but doesnt render the actual list of courses', async () => {
    axiosMock.onGet('/api/v2/userInfo').reply(200, userInfo);
    axiosMock.onGet('/api/v3.01/trainees').reply(200, traineeTest);
    axiosMock.onGet('/api/v3.01/traineeCourseCredits').reply(200, { value: [] });

    renderWithProviders(<Profile />, {
      initialState: { trainee: traineeInitialState, traineeCourseCredits: traineeCourseCreditsInitialState }
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const { firstName, lastName } = traineeTest.value[0];

    expect(screen.getByText(`${firstName} ${lastName}`)).toBeTruthy();
    expect(screen.getByText('No training has been associated with this profile.')).toBeTruthy();
  });

  it('can show a loading spinner and renders the RegisterPrompt component if no trainee is found for the user', async () => {
    axiosMock.onGet('/api/v2/userInfo').reply(200, userInfo);
    axiosMock.onGet('/api/v3.01/trainees').reply(200, { value: [] });
    axiosMock.onGet('/api/v3.01/traineeCourseCredits').reply(200, { value: [] });

    renderWithProviders(<Profile />, {
      initialState: { trainee: traineeInitialState, traineeCourseCredits: traineeCourseCreditsInitialState }
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText('Finish registration')).toBeTruthy();
  });
});
