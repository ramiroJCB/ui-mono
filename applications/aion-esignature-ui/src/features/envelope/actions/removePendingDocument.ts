import { RootState } from 'combineReducers';
import { ThunkAction } from 'redux-thunk';

const removePendingEnvelopeDocumentRequest = () =>
  ({
    type: 'REMOVE_PENDING_ENVELOPE_DOCUMENT'
  } as const);

export const removePendingDocument = (): ThunkAction<void, RootState, null, Action> => async dispatch => {
  dispatch(removePendingEnvelopeDocumentRequest());
};

export type Action = ReturnType<typeof removePendingEnvelopeDocumentRequest>;
