import axios, { AxiosError } from 'axios';
import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchOrganizationFeaturesRequest = () =>
  ({
    type: 'FETCH_ORGANIZATION_FEATURES_REQUEST'
  } as const);

export const fetchOrganizationFeaturesSuccess = (payload: IOrganizationFeature[]) =>
  ({
    type: 'FETCH_ORGANIZATION_FEATURES_SUCCESS',
    payload
  } as const);

export const fetchOrganizationFeaturesFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_ORGANIZATION_FEATURES_FAILURE',
    error
  } as const;
};

const shouldFetchOrganizationFeatures = (state: RootState) => {
  const {
    organizationFeatures: { organizationFeatures, isFetching, error }
  } = state;

  return !isFetching && !error && !organizationFeatures;
};

const fetchOrganizationFeatures = (): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchOrganizationFeaturesRequest());

    const response = await axios.get<IOrganizationFeature[]>('/api/v2/organizationfeatures');

    dispatch(fetchOrganizationFeaturesSuccess(response.data));
  } catch (error) {
    dispatch(fetchOrganizationFeaturesFailure(error));
  }
};

export const fetchOrganizationFeaturesIfNeeded = (): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchOrganizationFeatures(getState())) {
    dispatch(fetchOrganizationFeatures());
  }
};

export type Actions =
  | ReturnType<typeof fetchOrganizationFeaturesRequest>
  | ReturnType<typeof fetchOrganizationFeaturesSuccess>
  | ReturnType<typeof fetchOrganizationFeaturesFailure>;
