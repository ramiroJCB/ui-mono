import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { AddWorkGroupJobType, AddWorkGroupJobTypeContainer } from './AddWorkGroupJobTypes';
import { createMemoryHistory } from 'history';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount, shallow } from 'enzyme';
import { PreviouslyAddedItems } from '../../../../components/PreviouslyAddedItems';
import '@pec/aion-ui-i18next';

const organizationId = '08eaa1e1-dffc-4736-ac4f-a8d900e15ffe';
const workGroupId = 'e050b84c-1a47-4e2a-ad48-aad400d98b8b';

const wrapper = mount(
  <FakeStoreAndRouter state={{ workGroup: {} }}>
    <AddWorkGroupJobTypeContainer
      history={createMemoryHistory()}
      location={{ state: null } as any}
      match={{ params: { organizationId, workGroupId }, isExact: true, path: '', url: '' }}
    />
  </FakeStoreAndRouter>
);

const instance = wrapper.find<AddWorkGroupJobType>(AddWorkGroupJobType).instance();

describe('the validation method on add work group job types container', () => {
  it('fetches the work group job type names that match the job type names selected in the form', async () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: {
              '@odatacount': 1,
              value: [
                {
                  compliantContractorCount: 0,
                  compliantContractorPercentage: 0,
                  contractorCountUpdatedDateUtc: '0001-01-01T00:00:00',
                  id: '88888888-8888-8888-8888-aad400d98b8b',
                  isDeleted: false,
                  jobTypeId: '111111111',
                  jobTypeName: 'Pressure Washing',
                  organizationId: '08eaa1e1-dffc-4736-ac4f-a8d900e15ffe',
                  totalContractorCount: 0,
                  oshaReferenceNumbers: null,
                  workGroupId: 'e050b84c-1a47-4e2a-ad48-aad400d98b8b',
                  workGroupName: 'Blake Test A'
                }
              ]
            }
          } as AxiosResponse)
        )
    );

    const validationResults = await instance.validate([
      {
        id: '223456789',
        organizationId: '750aaa27-7588-41e0-995c-cdd008285bb2',
        name: 'Pressure Washing',
        description: 'Washing with pressure',
        compliantContractorCount: 0,
        totalContractorsCount: 0,
        compliantContractorPercentage: 0,
        contractorCountUpdatedDateUtc: '0001-01-01T00:00:00',
        isDeleted: false
      }
    ]);

    const expectedResults = shallow(
      <PreviouslyAddedItems invalidNames={['Pressure Washing']} typeOfItem="job types" classes={{}} />
    )
      .render()
      .text();

    expect(axios.get).toHaveBeenCalled();
    expect(
      shallow(validationResults as JSX.Element)
        .render()
        .text()
    ).toEqual(expectedResults);
  });

  it('returns is required if the form is left blank', async () => {
    const validationResults = await instance.validate([]);

    expect(validationResults).toBe('is required');
  });

  it('returns an error', async () => {
    axios.get = jest.fn(() => new Promise((_resolve, reject) => reject(Error)));

    const validationResults = await instance.validate([
      {
        id: '223456789',
        organizationId: '750aaa27-7588-41e0-995c-cdd008285bb2',
        name: 'Pressure Washing',
        description: 'Washing with pressure',
        compliantContractorCount: 0,
        totalContractorsCount: 0,
        compliantContractorPercentage: 0,
        contractorCountUpdatedDateUtc: '0001-01-01T00:00:00',
        isDeleted: false
      }
    ]);

    expect(axios.get).toHaveBeenCalled();
    expect(validationResults).toBe('error processing validation request');
  });
});
