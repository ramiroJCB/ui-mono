import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IAionSsqScore } from 'interfaces/aionSsqScore';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';

const name = 'contractorsAionScores';

export type Params = {
  organizationId: string;
};

export const fetchContractorsAionScores = createAsyncThunk(
  `${name}/fetchContractorsAionScores`,
  async ({ organizationId }: Params) => {
    const { Equals } = OdataComparator;

    const params = new QueryBuilder().filter(f => f.filterBy('clientId', Equals, organizationId)).toQueryParam();

    const { data } = await axios.get<{ value: IAionSsqScore[]; '@odata.count': number }>(
      '/api/scoringEngine/v3.1/SsqScores',
      {
        params
      }
    );

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

export const contractorsAionScoresAdapter = createEntityAdapter<IAionSsqScore>();
export const contractorsAionScoresSelectors = contractorsAionScoresAdapter.getSelectors<RootState>(
  state => state.contractorsAionScores
);

type State = { total: number } & CommonState;

export const initialState = contractorsAionScoresAdapter.getInitialState<State>({
  isFetching: false,
  error: null,
  total: 0
});

const contractorsAionScores = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchContractorsAionScores.pending, isFetching);
    builder.addCase(fetchContractorsAionScores.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      contractorsAionScoresAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(fetchContractorsAionScores.rejected, error);
  }
});

export const { reducer: contractorsAionScoresReducer } = contractorsAionScores;
