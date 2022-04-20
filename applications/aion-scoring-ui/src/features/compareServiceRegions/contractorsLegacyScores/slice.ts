import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ILegacySsqScore } from 'interfaces/legacySsqScore';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'app/store';

const name = 'contractorsLegacyScores';

type Params = {
  organizationId: string;
  urlQuery?: ParsedUrlQuery;
};

export const fetchContractorsLegacyScores = createAsyncThunk(
  `${name}/fetchContractorsLegacyScores`,
  async ({ organizationId }: Params) => {
    const response = await axios.get<ILegacySsqScore[]>(
      `/api/scoringEngine/v3.1/organizations(${organizationId})/LegacySsqScores`,
      {
        params: {
          $orderby: 'contractorName'
        }
      }
    );

    return {
      data: response.data,
      total: response.data.length
    };
  },
  { condition: condition(name) }
);

export const contractorsLegacyScoresAdapter = createEntityAdapter<ILegacySsqScore>();

export const contractorsLegacyScoresSelectors = contractorsLegacyScoresAdapter.getSelectors<RootState>(
  state => state.contractorsLegacyScores
);

type State = { total: number } & CommonState;

export const initialState = contractorsLegacyScoresAdapter.getInitialState<State>({
  isFetching: false,
  total: 0,
  error: null
});

const contractorsLegacyScores = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchContractorsLegacyScores.pending, isFetching);
    builder.addCase(fetchContractorsLegacyScores.fulfilled, (state, action) => {
      const contractorsLegacyScores = action.payload.data.map(contractorScore => {
        return {
          ...contractorScore,
          id: contractorScore.contractorOrganizationId
        };
      });
      state.isFetching = false;
      state.total = action.payload.data.length;
      contractorsLegacyScoresAdapter.setAll(state, contractorsLegacyScores);
    });
    builder.addCase(fetchContractorsLegacyScores.rejected, error);
  }
});

export const { reducer: contractorsLegacyScoresReducer } = contractorsLegacyScores;
