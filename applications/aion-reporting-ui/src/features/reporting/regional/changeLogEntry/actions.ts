import axios, { AxiosError } from 'axios';
import { IRegionalChangeLogEntry } from 'interfaces/regionalChangeLogEntry';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addRegionalChangeLogEntryRequest = () =>
  ({
    type: 'ADD_REGIONAL_CHANGELOG_ENTRY_REQUEST'
  } as const);

const addRegionalChangeLogEntrySuccess = (payload: IRegionalChangeLogEntry) =>
  ({
    type: 'ADD_REGIONAL_CHANGELOG_ENTRY_SUCCESS',
    payload
  } as const);

const addRegionalChangeLogEntryFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_REGIONAL_CHANGELOG_ENTRY_FAILURE',
    error
  } as const;
};

export const addRegionalChangeLogEntry = (
  regionalContractorPeriodId: string,
  createdByOrganizationId: string,
  description: string
): ThunkAction<Promise<IRegionalChangeLogEntry>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addRegionalChangeLogEntryRequest());

      const { data } = await axios.post<IRegionalChangeLogEntry>('/api/v3.01/regionalChangeLog', {
        regionalContractorPeriodId,
        createdByOrganizationId,
        description
      });

      dispatch(addRegionalChangeLogEntrySuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addRegionalChangeLogEntryFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addRegionalChangeLogEntryRequest>
  | ReturnType<typeof addRegionalChangeLogEntrySuccess>
  | ReturnType<typeof addRegionalChangeLogEntryFailure>;
