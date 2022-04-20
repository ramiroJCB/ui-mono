import axios, { AxiosError } from 'axios';
import { IPredictiveRanking } from 'interfaces/predictiveRanking';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchPredictiveRankingRequest = () =>
  ({
    type: 'FETCH_PREDICTIVE_RANKING_REQUEST'
  } as const);

const fetchPredictiveRankingSuccess = (payload: IPredictiveRanking[]) =>
  ({
    type: 'FETCH_PREDICTIVE_RANKING_SUCCESS',
    payload
  } as const);

const fetchPredictiveRankingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PREDICTIVE_RANKING_FAILURE',
    error
  } as const;
};

const shouldFetchPredictiveRanking = ({ predictiveRanking: { isFetching } }: RootState) => !isFetching;

export const fetchPredictiveRanking = (
  organizationId: string
): ThunkAction<Promise<IPredictiveRanking[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchPredictiveRankingRequest());

      const response = await axios.get<{ value: IPredictiveRanking[] }>('/api/v2/predictiveRankings', {
        params: {
          $filter: `organizationId eq ${organizationId}`
        }
      });

      dispatch(fetchPredictiveRankingSuccess(response.data.value));
      resolve(response.data.value);
    } catch (error) {
      dispatch(fetchPredictiveRankingFailure(error));
      reject(error);
    }
  });
};

export const fetchPredictiveRankingIfNeeded = (
  organizationId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchPredictiveRanking(getState())) {
    dispatch(fetchPredictiveRanking(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchPredictiveRankingRequest>
  | ReturnType<typeof fetchPredictiveRankingSuccess>
  | ReturnType<typeof fetchPredictiveRankingFailure>;
