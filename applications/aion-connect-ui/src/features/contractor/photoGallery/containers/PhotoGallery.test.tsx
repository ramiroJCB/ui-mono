import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import MockAdapter from 'axios-mock-adapter';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IImage } from 'interfaces/image';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as photoGalleryInitialState } from '../reducer';
import { initialState as photoGalleryMetaDataInitialState } from '../metaData/reducer';
import { initialState as photoGalleryCoverPhotoInitialState } from '../coverPhoto/reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mount } from 'enzyme';
import { PhotoGalleryContainer } from './PhotoGallery';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, userInfo, error } = fixtures;
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
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  photoGallery: photoGalleryInitialState,
  photoGalleryCoverPhoto: photoGalleryCoverPhotoInitialState,
  photoGalleryMetaData: photoGalleryMetaDataInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/images`).reply(200, response);

  axiosMock
    .onGet(`/files/v3.01/organizations(${organization.id})/imagethumbnails(${uploadedImage.id})`)
    .reply(200, new Blob(['foobar'], { type: 'image/jpeg' }), { 'content-type': 'image/jpeg' });

  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('photo gallery container', () => {
  it('renders a loading spinner right away', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, photoGallery: { ...photoGalleryInitialState, isFetchingThumbnails: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={PhotoGalleryContainer} />} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(Grid)
      .at(0)
      .simulate('click');

    expect(wrapper.contains(<Loading />)).toBe(true);
  });

  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, photoGallery: { ...photoGalleryInitialState, imagesError: error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={PhotoGalleryContainer} />} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(Grid)
      .at(0)
      .simulate('click');

    expect(wrapper.contains(<Error />)).toBe(true);
  });

  it('renders some images', async () => {
    const acceptedImages: IImage[] = [];
    const response = await fetch(
      'data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    );
    const blob = await response.blob();

    for (let i = 0; i <= 9; i++) {
      acceptedImages.push({ ...image, thumbnail: blob, fullSize: blob });
    }

    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, photoGallery: { ...photoGalleryInitialState, acceptedImages } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={PhotoGalleryContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(Grid)
      .at(0)
      .simulate('click');

    expect(
      wrapper
        .find('img')
        .at(0)
        .prop('alt')
    ).toEqual('test.jpg');

    expect(wrapper.find('img')).toHaveLength(10);
  });

  it('renders the trigger button correctly if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          photoGallery: { ...photoGalleryInitialState, acceptedImages },
          photoGalleryMetaData: { ...photoGalleryMetaDataInitialState, metaData: value },
          profile: { ...profileInitialState, viewAsClient: true }
        }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={PhotoGalleryContainer} />} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(Grid)
      .at(0)
      .simulate('mouseover');

    expect(wrapper.find('h6').text()).toEqual('View Photos');
  });

  it('does not render the trigger button if viewAsClient is true and there are no images uploaded', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          profile: { ...profileInitialState, viewAsClient: true }
        }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={PhotoGalleryContainer} />} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(Grid).at(0)).toHaveLength(0);
  });
});
