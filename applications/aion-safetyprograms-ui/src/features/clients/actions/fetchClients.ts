import axios, { AxiosError } from 'axios';
import { escapeSingleQuote } from '@pec/aion-ui-core/helpers/escapeSingleQuote';
import { IClient } from 'interfaces/client';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { AsyncResult } from 'react-select-async-paginate';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { OdataParams } from '@pec/aion-ui-odata/types/odataParams';

export const $top = 25;

type ResponseData = { value: IClient[]; '@odata.count': number };

const fetchClientsRequest = () =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_CLIENTS_REQUEST'
  } as const);

const fetchClientsSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_CLIENTS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchClientsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SAFETY_PROGRAM_CLIENTS_FAILURE',
    error
  } as const;
};

export const fetchClients = (
  page: number,
  searchTerm: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientsRequest());

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramClients', {
        params: {
          $top,
          $orderby: 'name',
          $skip: page * $top,
          $filter: searchTerm ? `contains(tolower(name),'${escapeSingleQuote(searchTerm).toLowerCase()}')` : undefined
        }
      });

      dispatch(fetchClientsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientsFailure(error));
      reject(error);
    }
  });

export const fetchClientsAutocomplete = (
  page: number = 1,
  top: number = 10,
  inputValue?: string
): ThunkAction<Promise<AsyncResult<OptionType, SelectAdditional>>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientsRequest());

      const $top = top;
      const params: OdataParams = { $orderby: 'name', $top };

      if (inputValue) {
        params.$filter = `contains(tolower(name),'${inputValue.toLowerCase()}')`;
      }

      const { data } = await axios.get<{ value: IClient[]; '@odata.count': number }>(
        '/api/v3.01/safetyProgramClients',
        {
          params: { $skip: (page - 1) * $top, ...params }
        }
      );

      const total = data['@odata.count'];

      dispatch(fetchClientsSuccess(data));
      resolve({
        options: data.value,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchClientsFailure(error));
      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchClientsRequest>
  | ReturnType<typeof fetchClientsSuccess>
  | ReturnType<typeof fetchClientsFailure>;
