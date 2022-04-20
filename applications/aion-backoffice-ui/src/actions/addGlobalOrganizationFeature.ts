import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { IOrganizationFeatureForm } from '../interfaces/organizationFeatureForm';
import { reset } from 'redux-form';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addGlobalOrganizationFeatureRequest = () =>
  ({
    type: 'ADD_GLOBAL_ORGANIZATION_FEATURE_REQUEST'
  } as const);

export const addGlobalOrganizationFeatureSuccess = (payload: IOrganizationFeature) =>
  ({
    type: 'ADD_GLOBAL_ORGANIZATION_FEATURE_SUCCESS',
    payload
  } as const);

export const addGlobalOrganizationFeatureFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_GLOBAL_ORGANIZATION_FEATURE_FAILURE',
    error
  } as const;
};

export const addGlobalOrganizationFeature = (
  orgFeature: IOrganizationFeatureForm
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addGlobalOrganizationFeatureRequest());

      await axios.post<IOrganizationFeature>('/api/v3.01/globalOrganizationFeatures', {
        feature: orgFeature.feature.name,
        organizationType: orgFeature.organizationType
      });

      dispatch(addGlobalOrganizationFeatureSuccess(orgFeature.feature));
      dispatch(reset(`assignRemoveGlobalOrganizationFeatureForm-${orgFeature.feature.name}`));
      dispatch(
        enqueueSnackbar({
          message: 'Your change has been saved.',
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(addGlobalOrganizationFeatureFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addGlobalOrganizationFeatureRequest>
  | ReturnType<typeof addGlobalOrganizationFeatureSuccess>
  | ReturnType<typeof addGlobalOrganizationFeatureFailure>;
