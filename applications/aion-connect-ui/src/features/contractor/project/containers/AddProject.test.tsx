import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { AddProjectContainer } from './AddProject';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IProjectForm } from 'interfaces/projectForm';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

it('submits a new projects', () => {
  const values: IProjectForm = {
    name: 'Pipelines',
    startDateUtc: '2019-01-22T15:55:01.426Z',
    endDateUtc: '2019-06-22T15:55:01.426Z',
    isActive: false,
    description: 'This is a description.'
  };

  axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/projects`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'post');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route path="/organization/:organizationId/connect/profile" component={AddProjectContainer} />
    </FakeStoreAndRouter>
  );

  wrapper.find(Button).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: values.name } });
  wrapper
    .find(DateField)
    .at(0)
    .props()
    .input.onChange(values.startDateUtc);
  wrapper
    .find(DateField)
    .at(1)
    .props()
    .input.onChange(values.endDateUtc);
  wrapper.find('textarea[name="description"]').simulate('change', { target: { value: values.description } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/projects`, values);
});
