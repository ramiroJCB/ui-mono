import axios, { AxiosError } from 'axios';
import { IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Equals } = OdataComparator;

const fetchEnvelopeRequest = () =>
  ({
    type: 'FETCH_ENVELOPE_REQUEST'
  } as const);

const fetchEnvelopeSuccess = (payload: IEnvelope) =>
  ({
    type: 'FETCH_ENVELOPE_SUCCESS',
    payload
  } as const);

const fetchEnvelopeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_ENVELOPE_FAILURE',
    error
  } as const;
};

const shouldFetchEnvelope = ({ envelopes: { isFetching } }: RootState) => !isFetching;

const fetchEnvelope = (envelopeId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchEnvelopeRequest());

    const params = new QueryBuilder()
      .top(1)
      .filter(f => f.filterBy('id', Equals, envelopeId))
      .toQueryParam();

    const { data } = await axios.get<{ value: IEnvelope[]; '@odata.count': number }>('/api/v3.01/eSignatureEnvelopes', {
      params
    });

    const envelope = data.value[0] || null;

    dispatch(fetchEnvelopeSuccess(envelope));
  } catch (error) {
    dispatch(fetchEnvelopeFailure(error));
  }
};

export const fetchEnvelopeIfNeeded = (envelopeId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchEnvelope(getState())) {
    dispatch(fetchEnvelope(envelopeId));
  }
};

export type Actions =
  | ReturnType<typeof fetchEnvelopeRequest>
  | ReturnType<typeof fetchEnvelopeSuccess>
  | ReturnType<typeof fetchEnvelopeFailure>;
