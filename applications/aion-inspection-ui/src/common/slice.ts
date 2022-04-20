import { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { sendError } from '@pec/aion-ui-core/sendError';

export type CommonState = {
  isFetching: boolean;
  error: SerializedError | null;
};

export const isFetching = <T extends CommonState>(state: T) => {
  state.isFetching = true;
  state.error = null;
};

export const error = <T>(
  state: CommonState,
  action: PayloadAction<
    unknown,
    string,
    { arg: T; requestId: string; aborted: boolean; condition: boolean },
    SerializedError
  >
) => {
  state.isFetching = false;
  state.error = action.error;

  sendError(action.error);
};

export const condition = (state: keyof RootState) => (_: any, { getState }: any) => {
  const selectState = getState()[state];

  if (selectState.hasOwnProperty('isFetching')) {
    const { isFetching } = selectState as CommonState;
    return !isFetching;
  }

  return undefined;
};
