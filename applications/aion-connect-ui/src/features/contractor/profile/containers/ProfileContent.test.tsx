import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IImage } from 'interfaces/image';
import { initialState as profileInitialState } from '../reducer';
import { initialState as accreditationsInitialState } from 'features/contractor/accreditations/reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { initialState as tradeNamesInitialState } from 'features/contractor/tradeNames/reducer';
import { initialState as announcementInitialState } from 'features/contractor/announcements/reducer';
import { initialState as certificationsInitialState } from 'features/contractor/certifications/reducer';
import { initialState as contactInformationInitialState } from 'features/contractor/contactInformation/reducer';
import { initialState as licensesInitialState } from 'features/contractor/licenses/reducer';
import { initialState as logoInitialState } from 'features/contractor/logo/reducer';
import { initialState as officeLocationsInitialState } from 'features/contractor/officeLocations/reducer';
import { initialState as projectsInitialState } from 'features/contractor/projects/reducer';
import { initialState as referencesInitialState } from 'features/contractor/references/reducer';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mount } from 'enzyme';
import { ProfileContentContainer } from './ProfileContent';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const {
  organizations,
  userInfo,
  projects,
  contactInformation,
  licenses,
  accreditations,
  certifications,
  references,
  officeLocations,
  tradeNames,
  announcements
} = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

const logoMetaData: IUploadedLogo = {
  id: 'd43d747e-274c-4517-a64e-ed30b833e790',
  organizationId: organization.id,
  fileName: 'test.jpg',
  storagePath: 'organization-logo/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg',
  mimeType: 'image/jpeg',
  isDeleted: false
};

const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  accreditations: accreditationsInitialState,
  tradeNames: tradeNamesInitialState,
  announcement: announcementInitialState,
  certifications: certificationsInitialState,
  contactInformation: contactInformationInitialState,
  licenses: licensesInitialState,
  logo: logoInitialState,
  officeLocations: officeLocationsInitialState,
  profile: profileInitialState,
  projects: projectsInitialState,
  references: referencesInitialState
};

beforeEach(() => {
  axiosMock
    .onGet(`/api/v3.01/organizations(${organization.id})/contactInformation`)
    .reply(200, { value: contactInformation });

  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/logo`).reply(200, logoMetaData);

  axiosMock
    .onGet(`/files/v3.01/organizations(${organization.id})/logo`)
    .reply(200, new Blob(['foobar'], { type: 'image/jpeg' }), { 'content-type': 'image/jpeg' });

  axiosMock
    .onGet(`/api/v3.01/organizations(${organization.id})/announcements`)
    .reply(200, { '@odata.count': announcements.length, value: announcements });

  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/projects`).reply(200, projects);
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/licenses`).reply(200, licenses);
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/accreditations`).reply(200, accreditations);
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/certifications`).reply(200, certifications);
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/references`).reply(200, references);
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/officeLocations`).reply(200, officeLocations);
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/tradeNames`).reply(200, tradeNames);
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('contractor profile content container', () => {
  it('renders a loading spinner right away', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, announcement: { ...announcementInitialState, isFetching: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ProfileContentContainer} />} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Loading />)).toBe(true);
  });
});
