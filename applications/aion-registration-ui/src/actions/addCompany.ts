import * as types from '../reducers/company';
import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { ICompany } from '../interfaces/company';
import { ICompanyForm } from '../interfaces/companyForm';
import { RootState } from '../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addCompanyRequest = () => ({
  type: types.ADD_COMPANY_REQUEST as typeof types.ADD_COMPANY_REQUEST
});

const addCompanySuccess = (payload: ICompany) => ({
  type: types.ADD_COMPANY_SUCCESS as typeof types.ADD_COMPANY_SUCCESS,
  payload
});

const addCompanyFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: types.ADD_COMPANY_FAILURE as typeof types.ADD_COMPANY_FAILURE,
    error
  };
};

const matchCompanySuccess = (payload: ICompany) => ({
  type: types.MATCH_COMPANY_SUCCESS as typeof types.MATCH_COMPANY_SUCCESS,
  payload
});

export const addCompany = (
  company: ICompanyForm,
  history: History
): ThunkAction<Promise<ICompany>, RootState, null, Actions> => dispatch => {
  return new Promise<ICompany>(async (resolve, reject) => {
    try {
      dispatch(addCompanyRequest());

      const response = await axios.post<ICompany>('/api/v2/organizations', company);
      const newCompany = response.data;

      dispatch(addCompanySuccess(newCompany));
      history.push(`/companies/${newCompany.id}/enter-your-info`);

      resolve(newCompany);
    } catch (error) {
      if (error.response.status === 409) {
        const matchedCompany: ICompany = error.response.data.data;

        history.push(`/companies/${matchedCompany.id}/enter-your-info`);

        dispatch(matchCompanySuccess(matchedCompany));
        resolve(matchedCompany);
      } else {
        dispatch(addCompanyFailure(error));
        reject(error);
      }
    }
  });
};

export type Actions =
  | ReturnType<typeof addCompanyRequest>
  | ReturnType<typeof addCompanySuccess>
  | ReturnType<typeof addCompanyFailure>
  | ReturnType<typeof matchCompanySuccess>;
