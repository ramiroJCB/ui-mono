import axios, { AxiosError } from 'axios';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { IEditShopLinksForm } from 'interfaces/safetyProgram';

const updateShopLinksRequest = () =>
  ({
    type: 'UPDATE_SHOP_LINKS_REQUEST'
  } as const);

const updateShopLinksSuccess = (payload: string[]) =>
  ({
    type: 'UPDATE_SHOP_LINKS_SUCCESS',
    payload
  } as const);

const updateShopLinksFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_SHOP_LINKS_FAILURE',
    error
  } as const;
};

export const updateShopLinks = (
  values: IEditShopLinksForm
): ThunkAction<Promise<IEditShopLinksForm['safetyProgramIds']>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateShopLinksRequest());

      const { data } = await axios.put<IEditShopLinksForm['safetyProgramIds']>(
        'api/v3.01/safetyPrograms/showShopLinks ',
        {
          safetyProgramIds: values.safetyProgramIds
        }
      );

      dispatch(updateShopLinksSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateShopLinksFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateShopLinksRequest>
  | ReturnType<typeof updateShopLinksSuccess>
  | ReturnType<typeof updateShopLinksFailure>;
