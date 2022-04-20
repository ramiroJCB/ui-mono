import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Typography from '@material-ui/core/Typography';
import { AddOfficeLocationContainer } from 'features/contractor/officeLocation/containers/AddOfficeLocation';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as officeLocationsInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { IOfficeLocation } from 'interfaces/officeLocation';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { mount } from 'enzyme';
import { OfficeLocationsContainer } from './OfficeLocations';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, officeLocations, userInfo, error } = fixtures;
const organization = organizations[2];
const officeLocation = officeLocations[1];
const axiosMock = new MockAdapter(axios);
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  officeLocations: officeLocationsInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/officeLocations`).reply(200, officeLocations);
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('office locations container', () => {
  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, officeLocations: { ...officeLocationsInitialState, error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={OfficeLocationsContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });

  it('renders some office locations', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, officeLocations: { ...officeLocationsInitialState, officeLocations } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={OfficeLocationsContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('td')
        .at(5)
        .text()
    ).toEqual(officeLocation.name);
  });

  it('shows an message when they add 5 locations', () => {
    const fiveOfficeLocations: IOfficeLocation[] = [];

    for (let i = 0; i <= 5; i++) {
      fiveOfficeLocations.push(officeLocation);
    }

    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, officeLocations: { ...officeLocationsInitialState, officeLocations: fiveOfficeLocations } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={OfficeLocationsContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find(Typography)
        .at(2)
        .text()
    ).toEqual('Office and locations amount of 5 has been exceeded.');
  });

  it('filters out the primary office location from the max allowed', () => {
    const fiveOfficeLocationsWithPrimary: IOfficeLocation[] = [officeLocations[0]];

    for (let i = 0; i <= 3; i++) {
      fiveOfficeLocationsWithPrimary.push(officeLocation);
    }
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          officeLocations: { ...officeLocationsInitialState, officeLocations: fiveOfficeLocationsWithPrimary }
        }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={OfficeLocationsContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(AddIcon)).toHaveLength(1);
  });

  it('deletes a office location', () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`).reply(200);

    const axiosSpy = jest.spyOn(axios, 'delete');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, officeLocations: { ...officeLocationsInitialState, officeLocations } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={OfficeLocationsContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(ConfirmDelete)
      .at(0)
      .simulate('click');

    wrapper.find(LoadingButton).simulate('click');

    expect(axiosSpy).toHaveBeenCalledWith(
      `/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`
    );
  });

  it('does not render the add accreditation container if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, profile: { ...profileInitialState, viewAsClient: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={OfficeLocationsContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<AddOfficeLocationContainer />)).toBeFalsy();
  });
});
