import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IContractor } from 'interfaces/contractor';
import { RootState } from 'app/store';

const name = 'contractors';

type Params = {
  organizationId: string;
  searchTerm?: string;
};

export const fetchContractors = createAsyncThunk(
  `${name}/fetchContractors`,
  async ({ organizationId, searchTerm }: Params) => {
    const pageSize = 25;
    const response = await axios.get<IContractor[]>(`/api/v2/organizations/${organizationId}/contractors`, {
      params: {
        search: searchTerm,
        pageSize
      }
    });

    const total = response.headers['x-total-count'];

    return { data: response.data, total };
  },
  { condition: condition(name) }
);

export const contractorsAdapter = createEntityAdapter<IContractor>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const contractorsSelectors = contractorsAdapter.getSelectors<RootState>(state => state.contractors);

type State = { total: number } & CommonState;

export const initialState = contractorsAdapter.getInitialState<State>({
  isFetching: false,
  total: 0,
  error: null
});

const contractors = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchContractors.pending, isFetching);
    builder.addCase(fetchContractors.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      contractorsAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(fetchContractors.rejected, error);
  }
});

export const { reducer: contractorsReducer } = contractors;
