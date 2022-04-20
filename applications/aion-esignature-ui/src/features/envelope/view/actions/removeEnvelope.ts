import { RootState } from 'combineReducers';
import { ThunkAction } from 'redux-thunk';

const removeEnvelopeRequest = () =>
  ({
    type: 'REMOVE_ENVELOPE'
  } as const);

export const removeEnvelope = (): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  dispatch(removeEnvelopeRequest());
};

export type Actions = ReturnType<typeof removeEnvelopeRequest>;
