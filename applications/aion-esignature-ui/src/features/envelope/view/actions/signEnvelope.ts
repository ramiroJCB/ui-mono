import axios, { AxiosError } from 'axios';
import { IEnvelopeSigningView } from 'interfaces/envelopeSigningView';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const signEnvelopeRequest = () =>
  ({
    type: 'SIGN_ENVELOPE_REQUEST'
  } as const);

const signEnvelopeSuccess = (payload: string) =>
  ({
    type: 'SIGN_ENVELOPE_SUCCESS',
    payload
  } as const);

const signEnvelopeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'SIGN_ENVELOPE_FAILURE',
    error
  } as const;
};

const shouldSignEnvelope = ({ envelopes: { isFetching } }: RootState) => !isFetching;

const signEnvelope = (envelopeId: string): ThunkAction<Promise<string>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(signEnvelopeRequest());

      const {
        data: { signingUrl }
      } = await axios.get<IEnvelopeSigningView>(`/api/v3.01/eSignatureEnvelopes(${envelopeId})/signingView`);

      dispatch(signEnvelopeSuccess(signingUrl));

      resolve(signingUrl);
    } catch (error) {
      dispatch(signEnvelopeFailure(error));

      reject();
    }
  });
};

export const signEnvelopeIfNeeded = (envelopeId: string): ThunkAction<Promise<string>, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldSignEnvelope(getState())) {
    return dispatch(signEnvelope(envelopeId));
  }

  return Promise.resolve('');
};

export type Actions =
  | ReturnType<typeof signEnvelopeRequest>
  | ReturnType<typeof signEnvelopeSuccess>
  | ReturnType<typeof signEnvelopeFailure>;
