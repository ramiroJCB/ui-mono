import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { EditCertificationContainer } from './EditCertification';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconButton } from '@material-ui/core';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations, certifications } = fixtures;
const organization = organizations[2];
const certification = certifications[0];
const axiosMock = new MockAdapter(axios);

it('edits an certification', () => {
  axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/certifications(${certification.id})`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'put');
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        organization: { isFetching: true, organization, fetchError: null },
        certification: { isFetching: true, certification: null, error: null }
      }}
      initialEntries={[`/organization/${organization.id}/connect/profile`]}
    >
      <Route
        path="/organization/:organizationId/connect/profile"
        render={props => <EditCertificationContainer {...props} initialValues={certification} />}
      />
    </FakeStoreAndRouter>
  );

  const name = 'Welding';
  wrapper.find(IconButton).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: name } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(
    `/api/v3.01/organizations(${organization.id})/certifications(${certification.id})`,
    {
      ...certification,
      name
    }
  );
});
