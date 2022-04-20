import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { IOrganizationFeatureForm } from '../interfaces/organizationFeatureForm';
import { reset } from 'redux-form';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteGlobalOrganizationFeatureRequest = () =>
  ({
    type: 'DELETE_GLOBAL_ORGANIZATION_FEATURE_REQUEST'
  } as const);

export const deleteGlobalOrganizationFeatureSuccess = (payload: IOrganizationFeature) =>
  ({
    type: 'DELETE_GLOBAL_ORGANIZATION_FEATURE_SUCCESS',
    payload
  } as const);

export const deleteGlobalOrganizationFeatureFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_GLOBAL_ORGANIZATION_FEATURE_FAILURE',
    error
  } as const;
};

export const deleteGlobalOrganizationFeature = (
  orgFeature: IOrganizationFeatureForm
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteGlobalOrganizationFeatureRequest());

      await axios.delete('/api/v3.01/globalOrganizationFeatures', {
        data: { feature: orgFeature.feature.name, organizationType: orgFeature.organizationType }
      });

      dispatch(deleteGlobalOrganizationFeatureSuccess(orgFeature.feature));
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
      dispatch(deleteGlobalOrganizationFeatureFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteGlobalOrganizationFeatureRequest>
  | ReturnType<typeof deleteGlobalOrganizationFeatureSuccess>
  | ReturnType<typeof deleteGlobalOrganizationFeatureFailure>;
