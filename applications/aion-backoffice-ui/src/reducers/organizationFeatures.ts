import { Actions as FetchOrganizationFeaturesActions } from 'actions/organizationFeatures';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';

export type State = DeepReadonly<{
  readonly isFetching: boolean;
  readonly organizationFeatures: IOrganizationFeature[] | null;
  readonly error: AxiosError | Error | null;
}>;

const initialState: State = {
  isFetching: false,
  organizationFeatures: null,
  error: null
};

export function reducer(state: State = initialState, action: FetchOrganizationFeaturesActions): State {
  switch (action.type) {
    case 'FETCH_ORGANIZATION_FEATURES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ORGANIZATION_FEATURES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        organizationFeatures: action.payload.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName)),
        error: null
      };
    case 'FETCH_ORGANIZATION_FEATURES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
