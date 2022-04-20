import axios, { AxiosError } from 'axios';
import { ITrainingProvider } from '@pec/aion-ui-core/interfaces/trainingProvider';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const $top = 25;

type ResponseData = { value: ITrainingProvider[]; '@odata.count': number };

const fetchProvidersRequest = () =>
  ({
    type: 'FETCH_PROVIDERS_REQUEST'
  } as const);

const fetchProvidersSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_PROVIDERS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchProvidersFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PROVIDERS_FAILURE',
    error
  } as const;
};

export const fetchProviders = (
  searchTerm: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchProvidersRequest());

      const { data } = await axios.get<ResponseData>('/api/v3.01/trainingProviders', {
        params: {
          $top,
          $orderby: 'name',
          $filter: `contains(tolower(name),'${searchTerm.toLowerCase()}')`
        }
      });

      dispatch(fetchProvidersSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchProvidersFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchProvidersRequest>
  | ReturnType<typeof fetchProvidersSuccess>
  | ReturnType<typeof fetchProvidersFailure>;
