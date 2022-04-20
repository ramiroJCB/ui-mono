import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  AddJobTypeTrainingRequirements,
  AddJobTypeTrainingRequirementsContainer
} from './AddJobTypeTrainingRequirements';
import { createMemoryHistory } from 'history';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount, shallow } from 'enzyme';
import { PreviouslyAddedItems } from '../../../../components/PreviouslyAddedItems';
import '@pec/aion-ui-i18next';

const organizationId = '6e092d6c-b71d-4f50-b26f-a8d900e143a7';
const jobTypeId = '54ae3576-2e74-487f-aa81-aad400dc0e9d';

const wrapper = mount(
  <FakeStoreAndRouter state={{ jobType: {} }}>
    <AddJobTypeTrainingRequirementsContainer
      history={createMemoryHistory()}
      location={{ state: null } as any}
      match={{
        params: { organizationId, jobTypeId },
        isExact: true,
        path: '',
        url: ''
      }}
    />
  </FakeStoreAndRouter>
);

const instance = wrapper.find<AddJobTypeTrainingRequirements>(AddJobTypeTrainingRequirements).instance();

describe('the validation method on add job type training requirements container', () => {
  it('fetches the training requiremnent names that match the names selected in the form', async () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: {
              '@odatacount': 1,
              value: [
                {
                  id: '123456789',
                  trainingRequirementName: 'H2S Awareness',
                  jobTypeId: '222222222',
                  trainingRequirementId: '111111111',
                  isDeleted: false,
                  trainingRequirement: undefined
                }
              ]
            }
          } as AxiosResponse)
        )
    );

    const validationResults = await instance.validate([
      {
        id: '123456789',
        organizationId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
        name: 'H2S Awareness',
        description: 'H2S is bad',
        expirationMillis: null,
        expirationUnits: null,
        uploadRequired: true,
        compliantContractorCount: 0,
        totalContractorCount: 0,
        oshaReferenceNumbers: null,
        compliantContractorPercentage: 0,
        contractorCountUpdatedDateUtc: '2019-10-04T16:50:15.423095',
        isDeleted: false
      }
    ]);

    const expectedResults = shallow(
      <PreviouslyAddedItems invalidNames={['H2S Awareness']} typeOfItem="requirements" classes={{}} />
    )
      .render()
      .text();

    expect(
      shallow(validationResults as JSX.Element)
        .render()
        .text()
    ).toStrictEqual(expectedResults);
  });

  it('returns is required if the form is left blank', async () => {
    const validationResults = await instance.validate([]);

    expect(validationResults).toBe('is required');
  });

  it('returns an error', async () => {
    axios.get = jest.fn(() => new Promise((_resolve, reject) => reject(Error)));

    const validationResults = await instance.validate([
      {
        id: '123456789',
        organizationId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
        name: 'H2S Awareness',
        description: 'H2S is bad',
        expirationMillis: null,
        expirationUnits: null,
        uploadRequired: true,
        compliantContractorCount: 0,
        totalContractorCount: 0,
        oshaReferenceNumbers: null,
        compliantContractorPercentage: 0,
        contractorCountUpdatedDateUtc: '2019-10-04T16:50:15.423095',
        isDeleted: false
      }
    ]);

    expect(validationResults).toBe('error processing validation request');
  });
});
