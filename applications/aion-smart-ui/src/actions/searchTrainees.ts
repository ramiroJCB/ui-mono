import axios, { AxiosError } from 'axios';
import { createEmployedTrainee } from './createEmployedTrainee';
import { formatUserInput } from 'helpers/formatTrainee';
import { History } from 'history';
import { ISearchTraineesForm } from 'interfaces/searchTraineesForm';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const searchTraineesRequest = () =>
  ({
    type: 'SEARCH_TRAINEES_REQUEST'
  } as const);

const searchTraineesSuccess = (payload: ITraineeWithEmployees[], userProvidedInfo: ISearchTraineesForm) =>
  ({
    type: 'SEARCH_TRAINEES_SUCCESS',
    payload,
    userProvidedInfo
  } as const);

const searchTraineesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'SEARCH_TRAINEES_FAILURE',
    error
  } as const;
};

const shouldSearchTrainees = ({ searchTrainees: { isFetching } }: RootState) => !isFetching;
const searchTrainees = (
  searchTraineesForm: ISearchTraineesForm,
  history: History,
  orgId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(searchTraineesRequest());
      const searchTrainee = formatUserInput(searchTraineesForm);

      const response = await axios.post<ITraineeWithEmployees[]>('/api/v2/search/trainees', searchTrainee);

      const matchedTrainees = response.data;

      dispatch(searchTraineesSuccess(matchedTrainees, searchTraineesForm));

      switch (matchedTrainees.length) {
        case 0:
          await dispatch(createEmployedTrainee(searchTrainee, history, orgId, siteId));
          break;
        default:
          history.push({ state: { showTraineeSearchResults: true } });
      }
      resolve(matchedTrainees);
    } catch (error) {
      dispatch(searchTraineesFailure(error));
      reject(error);
    }
  });
};

export const searchTraineesIfNeeded = (
  searchTraineesForm: ISearchTraineesForm,
  history: History,
  organizationId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldSearchTrainees(getState())) {
    dispatch(searchTrainees(searchTraineesForm, history, organizationId, siteId));
  }
};

export type Actions =
  | ReturnType<typeof searchTraineesRequest>
  | ReturnType<typeof searchTraineesSuccess>
  | ReturnType<typeof searchTraineesFailure>;
