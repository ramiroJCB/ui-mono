import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import {
  accreditations,
  certifications,
  contactInformation,
  licenses,
  officeLocations,
  projects,
  references
} from '../../../../../fixtures';
import { CompletionComponent } from '../components/Completion';
import { CompletionContainer } from './Completion';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as accreditationsInitialState } from 'features/contractor/accreditations/reducer';
import { initialState as certificationsInitialState } from 'features/contractor/certifications/reducer';
import { initialState as contactInformationInitialState } from 'features/contractor/contactInformation/reducer';
import { initialState as licensesInitialState } from 'features/contractor/licenses/reducer';
import { initialState as logoInitialState } from 'features/contractor/logo/reducer';
import { initialState as officeLocationsInitialState } from 'features/contractor/officeLocations/reducer';
import { initialState as projectsInitialState } from 'features/contractor/projects/reducer';
import { initialState as referencesInitialState } from 'features/contractor/references/reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, userInfo } = fixtures;
const organization = organizations[2];

const logoBlob = new Blob(['foobar'], { type: 'image/jpg' });

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
  profile: profileInitialState,
  logo: { ...logoInitialState, metaData: logoMetaData, logo: logoBlob },
  contactInformation: { ...contactInformationInitialState, contactInformation },
  projects: { ...projectsInitialState, projects },
  licenses: { ...licensesInitialState, licenses },
  accreditations: { ...accreditationsInitialState, accreditations },
  certifications: { ...certificationsInitialState, certifications },
  officeLocations: { ...officeLocationsInitialState, officeLocations },
  references: { ...referencesInitialState, references }
};

describe('completion container', () => {
  it('renders one close (incomplete) icon if the logo is missing', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          logo: logoInitialState
        }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={CompletionContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('svg[data-icon="CloseIcon"]')).toHaveLength(1);
    expect(wrapper.find('svg[data-icon="CheckIcon"]')).toHaveLength(2);
  });

  it('renders one close (incomplete) icon if contactInformation is missing', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          contactInformation: contactInformationInitialState
        }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={CompletionContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('svg[data-icon="CloseIcon"]')).toHaveLength(1);
    expect(wrapper.find('svg[data-icon="CheckIcon"]')).toHaveLength(2);
  });

  it('renders a close (incomplete) icon if even one section is incomplete in this case officeLocations', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          officeLocations: officeLocationsInitialState
        }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={CompletionContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('svg[data-icon="CloseIcon"]')).toHaveLength(1);
    expect(wrapper.find('svg[data-icon="CheckIcon"]')).toHaveLength(2);
  });

  it('does not render the completion container if all sections are complete', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state
        }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={CompletionContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(CompletionComponent)).toHaveLength(0);
  });
});
