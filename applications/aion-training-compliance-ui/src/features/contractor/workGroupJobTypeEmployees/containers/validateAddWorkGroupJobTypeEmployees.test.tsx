import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { AddWorkGroupJobTypeEmployees, AddWorkGroupJobTypeEmployeesContainer } from './AddWorkGroupJobTypeEmployees';
import { createMemoryHistory } from 'history';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount, shallow } from 'enzyme';
import { PreviouslyAddedItems } from '../../../../components/PreviouslyAddedItems';
import '@pec/aion-ui-i18next';

const organizationId = '6e092d6c-b71d-4f50-b26f-a8d900e143a7';
const clientId = '08eaa1e1-dffc-4736-ac4f-a8d900e15ffe';
const workGroupContractorId = '54ae3576-2e74-487f-aa81-aad400dc0e9d';
const workGroupJobTypeId = 'b4f651eb-dc75-44d3-9ff3-aad400db3975';

const wrapper = mount(
  <FakeStoreAndRouter state={{ workGroupJobType: {} }}>
    <AddWorkGroupJobTypeEmployeesContainer
      history={createMemoryHistory()}
      location={{ state: null } as any}
      match={{
        params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId },
        isExact: true,
        path: '',
        url: ''
      }}
    />
  </FakeStoreAndRouter>
);

const instance = wrapper.find<AddWorkGroupJobTypeEmployees>(AddWorkGroupJobTypeEmployees).instance();

describe('the validation method on add work group job types employee container', () => {
  it('fetches the employee names that match the names selected in the form', async () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: {
              '@odatacount': 1,
              value: [
                {
                  compliantTrainingCount: 0,
                  compliantTrainingPercentage: 0,
                  employeeId: '15babcbd-b5c1-4643-8bde-aad40008c262',
                  employeeName: 'ADAM AGUILAR',
                  id: '8987eee1-c296-4c52-be96-aada00dd7df6',
                  isDeleted: false,
                  jobTypeName: 'Blake Job Type A',
                  organizationId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
                  totalTrainingCount: 1,
                  trainingCountUpdatedDateUtc: '2019-10-04T16:50:15.423095',
                  workGroupJobTypeId: 'b4f651eb-dc75-44d3-9ff3-aad400db3975'
                }
              ]
            }
          } as AxiosResponse)
        )
    );

    const validationResults = await instance.validate([
      {
        id: '8987eee1-c296-4c52-be96-aada00dd7df6',
        organizationId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
        traineeId: 'traineeId',
        employeeId: 'employeeId',
        name: 'ADAM AGUILAR',
        emailAdress: null,
        phoneNumber: null,
        mobilePhoneNumber: null,
        addressLine1: null,
        addressLine2: null,
        city: 'Kalamazoo',
        state: 'MI',
        zip: null,
        country: null,
        compliantTrainingCount: 0,
        totalTrainingCount: 0,
        compliantTrainingPercentage: 0,
        trainingCountUpdatedDateUtc: 'never',
        isDeleted: false
      }
    ]);

    const expectedResults = shallow(
      <PreviouslyAddedItems invalidNames={['ADAM AGUILAR']} typeOfItem="employees" classes={{}} />
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
        id: '8987eee1-c296-4c52-be96-aada00dd7df6',
        organizationId: '6e092d6c-b71d-4f50-b26f-a8d900e143a7',
        traineeId: 'traineeId',
        employeeId: 'employeeId',
        name: 'ADAM AGUILAR',
        emailAdress: null,
        phoneNumber: null,
        mobilePhoneNumber: null,
        addressLine1: null,
        addressLine2: null,
        city: 'Kalamazoo',
        state: 'MI',
        zip: null,
        country: null,
        compliantTrainingCount: 0,
        totalTrainingCount: 0,
        compliantTrainingPercentage: 0,
        trainingCountUpdatedDateUtc: 'never',
        isDeleted: false
      }
    ]);

    expect(validationResults).toBe('error processing validation request');
  });
});
