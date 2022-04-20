import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { ParsedUrlQuery } from 'querystring';

const name = 'updatedViolation';

export const updateViolation = createAsyncThunk(
  `${name}/updateViolation`,
  async ({ organizationId, organizationViolationsId, action, reasonForAction, id }: ParsedUrlQuery) => {
    const endPoint = `/api/oshaViolations/v3.01/oshaViolations(${id})/${action}`;

    const { data } = await axios.put<IOshaViolations>(endPoint, {
      organizationId: organizationId && organizationId,
      organizationViolationId: organizationViolationsId && organizationViolationsId,
      reasonForAction: reasonForAction
    });

    return { data, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { violation: IOshaViolations | null; total: number } & CommonState;

export const initialState: State = {
  violation: null,
  total: 0,
  isFetching: false,
  error: null
};

const updatedViolation = createSlice({
  name,
  initialState,
  reducers: {
    clearUpdatedViolationSearch: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(updateViolation.pending, isFetching);
    builder.addCase(updateViolation.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violation = action.payload.data;
    });
    builder.addCase(updateViolation.rejected, (state, action) => {
      state.total = 0;
      state.violation = null;
      error(state, action);
    });
  }
});

export const { clearUpdatedViolationSearch } = updatedViolation.actions;
export const { reducer: updatedViolationReducer } = updatedViolation;
