import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IImage } from 'interfaces/image';
import { initialState as profileInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { initialState as contactInformationInitialState } from 'features/contractor/contactInformation/reducer';
import { initialState as logoInitialState } from 'features/contractor/logo/reducer';
import { initialState as photoGalleryInitialState } from 'features/contractor/photoGallery/reducer';
import { initialState as photoGalleryCoverPhotoInitialState } from 'features/contractor/photoGallery/coverPhoto/reducer';
import { initialState as photoGalleryMetaDataInitialState } from 'features/contractor/photoGallery/metaData/reducer';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { JumbotronContainer } from './Jumbotron';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, userInfo, contactInformation, announcements, error } = fixtures;
const organization = organizations[2];
const value: IUploadedImage[] = [];
const acceptedImages: IImage[] = [];
const axiosMock = new MockAdapter(axios);
const image: IImage = {
  id: 'test.jpg_0',
  fileName: 'test.jpg',
  thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
  fullSize: new Blob(['foobar'], { type: 'image/jpeg' })
};

const uploadedImage: IUploadedImage = {
  id: 'd43d747e-274c-4517-a64e-ed30b833e790',
  organizationId: organization.id,
  isDeleted: false,
  fileName: 'test.jpg',
  mimeType: 'image/jpeg',
  storagePath: 'organization-images/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg',
  thumbnailId: 'e755597a-2c52-416f-a0bd-2401d7603cbc',
  thumbnailStoragePath: 'organization-images/2bf97a15-0d9c-4c62-ad96-e1da88a71950.jpg',
  isCoverPhoto: false
};

for (let i = 0; i <= 6; i++) {
  value.push(uploadedImage);
  acceptedImages.push({ ...image, id: `${uploadedImage.fileName}_${i}`, metaData: uploadedImage });
}

const response = { value };
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
  contactInformation: contactInformationInitialState,
  logo: logoInitialState,
  photoGallery: photoGalleryInitialState,
  photoGalleryCoverPhoto: photoGalleryCoverPhotoInitialState,
  photoGalleryMetaData: photoGalleryMetaDataInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock
    .onGet(`/api/v3.01/organizations(${organization.id})/contactInformation`)
    .reply(200, { value: contactInformation });

  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/images`).reply(200, response);

  axiosMock
    .onGet(`/files/v3.01/organizations(${organization.id})/imagethumbnails(${uploadedImage.id})`)
    .reply(200, new Blob(['foobar'], { type: 'image/jpeg' }), { 'content-type': 'image/jpeg' });

  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/logo`).reply(200, logoMetaData);

  axiosMock
    .onGet(`/files/v3.01/organizations(${organization.id})/logo`)
    .reply(200, new Blob(['foobar'], { type: 'image/jpeg' }), { 'content-type': 'image/jpeg' });
  axiosMock
    .onGet(`/api/v3.01/organizations(${organization.id})/announcements`)
    .reply(200, { '@odata.count': announcements.length, value: announcements });

  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('contractor jumbotron container', () => {
  it('renders a loading spinner right away', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, organization: { ...organizationInitialState, isFetching: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={JumbotronContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Loading />)).toBe(true);
  });

  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, organization: { ...organizationInitialState, fetchError: error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={JumbotronContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });

  it('renders the company name on the header', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={state}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={JumbotronContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('h4').text()).toEqual(organization.name);
  });
});
