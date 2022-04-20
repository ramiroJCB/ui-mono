import axios, { AxiosError } from 'axios';
import { escapeSingleQuote } from '@pec/aion-ui-core/helpers/escapeSingleQuote';
import { IContractor } from 'interfaces/contractor';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const $top = 25;

type ResponseData = { value: IContractor[]; '@odata.count': number };

const fetchContractorsRequest = () =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_CONTRACTORS_REQUEST'
  } as const);

const fetchContractorsSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_CONTRACTORS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SAFETY_PROGRAM_CONTRACTORS_FAILURE',
    error
  } as const;
};

export const fetchContractors = (
  page: number,
  searchTerm: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchContractorsRequest());
      const filters = [`contains(tolower(name),'${escapeSingleQuote(searchTerm).toLowerCase()}')`];
      Number.isInteger(Number(searchTerm)) && searchTerm !== '' && filters.push(`companyNumber eq ${searchTerm}`);

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramContractors', {
        params: {
          $top,
          $orderby: 'name',
          $skip: page * $top,
          $filter: filters.map(filter => `(${filter})`).join(' or ')
        }
      });

      dispatch(fetchContractorsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchContractorsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchContractorsRequest>
  | ReturnType<typeof fetchContractorsSuccess>
  | ReturnType<typeof fetchContractorsFailure>;
