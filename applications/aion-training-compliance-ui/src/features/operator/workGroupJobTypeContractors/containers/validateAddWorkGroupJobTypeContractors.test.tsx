import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  AddWorkGroupJobTypeContractors,
  AddWorkGroupJobTypeContractorsContainer
} from './AddWorkGroupJobTypeContractors';
import { createMemoryHistory } from 'history';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount, shallow } from 'enzyme';
import { PreviouslyAddedItems } from '../../../../components/PreviouslyAddedItems';
import '@pec/aion-ui-i18next';

const organizationId = '6e092d6c-b71d-4f50-b26f-a8d900e143a7';
const workGroupId = '54ae3576-2e74-487f-aa81-aad400dc0e9d';
const workGroupJobTypeId = 'b4f651eb-dc75-44d3-9ff3-aad400db3975';

const wrapper = mount(
  <FakeStoreAndRouter state={{ workGroupJobType: {} }}>
    <AddWorkGroupJobTypeContractorsContainer
      history={createMemoryHistory()}
      location={{ state: null } as any}
      match={{
        params: { organizationId, workGroupId, workGroupJobTypeId },
        isExact: true,
        path: '',
        url: ''
      }}
    />
  </FakeStoreAndRouter>
);

const instance = wrapper.find<AddWorkGroupJobTypeContractors>(AddWorkGroupJobTypeContractors).instance();

describe('the validation method on add work group job type contractors container', () => {
  it('fetches the contractor names that match the names selected in the form', async () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: {
              '@odatacount': 1,
              value: [
                {
                  id: '123456789',
                  workGroupJobTypeId: '111111111',
                  organizationId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
                  workGroupId: '54ae3576-2e74-487f-aa81-aad400dc0e9d',
                  jobTypeId: '222222222',
                  contractorId: '333333333',
                  contractorOrganizationId: '444444444',
                  contractorName: 'Rough Scoots',
                  isDeleted: false,
                  compliantEmployeesCount: 0,
                  totalEmployeesCount: 0,
                  compliantEmployeesPercentage: 0,
                  employeeCountUpdatedDateUtc: '2019-10-04T16:50:15.423095',
                  contractor: undefined
                }
              ]
            }
          } as AxiosResponse)
        )
    );

    const validationResults = await instance.validate([
      {
        id: '111111111',
        clientId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
        organizationId: '222222222',
        name: 'Rough Scoots',
        description: undefined,
        compliantEmployeesCount: 0,
        totalEmployeesCount: 0,
        compliantEmployeesPercentage: 0,
        employeeCountUpdatedDateUtc: '2019-10-04T16:50:15.423095',
        isDeleted: false,
        contactName: 'Scooter',
        contactJobTitle: undefined,
        address: '8829 Frosted Mini Scooter Way',
        city: 'Roughdale',
        state: 'NM',
        contactPhoneNumber: undefined,
        contactMobileNumber: undefined,
        contactEmail: 'comeScootWithUs@scoot.com'
      }
    ]);

    const expectedResults = shallow(
      <PreviouslyAddedItems invalidNames={['Rough Scoots']} typeOfItem="contractors" classes={{}} />
    )
      .render()
      .text();

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
    axios.get = jest.fn(() => new Promise((resolve, reject) => reject(Error)));

    const validationResults = await instance.validate([
      {
        id: '111111111',
        clientId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
        organizationId: '222222222',
        name: 'Rough Scoots',
        description: undefined,
        compliantEmployeesCount: 0,
        totalEmployeesCount: 0,
        compliantEmployeesPercentage: 0,
        employeeCountUpdatedDateUtc: '2019-10-04T16:50:15.423095',
        isDeleted: false,
        contactName: 'Scooter',
        contactJobTitle: undefined,
        address: '8829 Frosted Mini Scooter Way',
        city: 'Roughdale',
        state: 'NM',
        contactPhoneNumber: undefined,
        contactMobileNumber: undefined,
        contactEmail: 'comeScootWithUs@scoot.com'
      }
    ]);

    expect(validationResults).toBe('error processing validation request');
  });
});
