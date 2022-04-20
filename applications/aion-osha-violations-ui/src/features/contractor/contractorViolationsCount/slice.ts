import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IContractorViolationsCount } from 'interfaces/contractorViolationCount';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';

const name = 'contractorViolationsCount';

export const fetchContractorViolationsCount = createAsyncThunk(
  `${name}/fetchContractorViolationCount`,
  async (organizationId: string) => {
    const { data } = await axios.get<OdataResponse<IContractorViolationsCount[]>>(
      '/api/oshaViolations/v3.01/organizationYearlyOshaViolations',
      {
        params: { $filter: `organizationId eq ${organizationId}` }
      }
    );
    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { annualViolationTotals: IContractorViolationsCount[] | null } & CommonState;

export const initialState: State = {
  annualViolationTotals: null,
  isFetching: false,
  error: null
};

const contractorViolationsCount = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchContractorViolationsCount.pending, isFetching);
    builder.addCase(fetchContractorViolationsCount.fulfilled, (state, action) => {
      state.isFetching = false;
      state.annualViolationTotals = action.payload.data;
    });
    builder.addCase(fetchContractorViolationsCount.rejected, (state, action) => {
      state.annualViolationTotals = null;
      error(state, action);
    });
  }
});

export const { reducer: contractorViolationsCountReducer } = contractorViolationsCount;
