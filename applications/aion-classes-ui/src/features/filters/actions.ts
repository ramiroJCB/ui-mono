import axios, { AxiosError, AxiosResponse } from 'axios';
import { ITrainingProgram } from '@pec/aion-ui-core/interfaces/trainingProgram';
import { ITrainingProvider } from '@pec/aion-ui-core/interfaces/trainingProvider';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

type Payload = {
  programs: ITrainingProgram[];
  providers: ITrainingProvider[];
};

const fetchFiltersRequest = () =>
  ({
    type: 'FETCH_FILTERS_REQUEST'
  } as const);

const fetchFiltersSuccess = (payload: Payload) =>
  ({
    type: 'FETCH_FILTERS_SUCCESS',
    payload
  } as const);

const fetchFiltersFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_FILTERS_FAILURE',
    error
  } as const;
};

export const fetchFilters = (
  programIds: string,
  providerIds: string
): ThunkAction<Promise<Payload>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchFiltersRequest());

      const [programsResponse, providersResponse] = (await axios.all([
        programIds
          ? axios.get('/api/v3.01/programs', {
              params: {
                $filter: `(id in (${programIds}))`
              }
            })
          : undefined,
        providerIds
          ? axios.get('/api/v3.01/trainingProviders', {
              params: {
                $filter: `(id in (${providerIds}))`
              }
            })
          : undefined
      ])) as [
        AxiosResponse<{ value: ITrainingProgram[] }> | undefined,
        AxiosResponse<{ value: ITrainingProvider[] }> | undefined
      ];

      const filters = {
        programs: programsResponse?.data.value || [],
        providers: providersResponse?.data.value || []
      };

      dispatch(fetchFiltersSuccess(filters));
      resolve(filters);
    } catch (error) {
      dispatch(fetchFiltersFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchFiltersRequest>
  | ReturnType<typeof fetchFiltersSuccess>
  | ReturnType<typeof fetchFiltersFailure>;
