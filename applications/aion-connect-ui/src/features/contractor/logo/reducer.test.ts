import { error, organizations } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';
import { IUploadedLogo } from 'interfaces/uploadedLogo';

let prevState: State;
const organization = organizations[2];
const logoBlob = new Blob(['foobar'], { type: 'image/jpg' });
const metaData: IUploadedLogo = {
  id: 'd43d747e-274c-4517-a64e-ed30b833e790',
  organizationId: organization.id,
  isDeleted: false,
  fileName: 'test.jpg',
  mimeType: 'image/jpeg',
  storagePath: 'organization-images/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg'
};

beforeEach(() => {
  prevState = initialState;
});

describe('logo reducer', () => {
  it('should update state correctly when dispatching FETCH_LOGO_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_LOGO_REQUEST',
      organizationId: organization.id
    });

    expect(prevState.logo).toBeNull();
    expect(nextState.error).toBeNull();
  });

  it('should update state correctly when dispatching ADD_LOGO_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_LOGO_REQUEST',
      payload: logoBlob
    });

    expect(prevState.logo).toBeNull();
    expect(nextState.error).toBeNull();
  });

  it('should update state correctly when dispatching FETCH_LOGO_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_LOGO_SUCCESS',
      payload: logoBlob,
      metaData,
      organizationId: organization.id
    });

    expect(nextState.error).toBeNull();
    expect(nextState.logo).toEqual(logoBlob);
  });

  it('should update state correctly when dispatching ADD_LOGO_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_LOGO_SUCCESS',
      payload: logoBlob,
      metaData
    });

    expect(nextState.error).toBeNull();
    expect(nextState.logo).toEqual(logoBlob);
  });

  it('should update state correctly when dispatching ADD_LOGO_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_LOGO_FAILURE',
      error
    });

    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching FETCH_LOGO_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_LOGO_FAILURE',
      error
    });

    expect(nextState.error).toEqual(error);
  });
});
